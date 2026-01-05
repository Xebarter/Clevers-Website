import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { pesapalService } from "@/lib/pesapal";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set in environment variables (server)");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request: NextRequest) {
  try {
    // Extract request body
    const body = await request.json();
    
    // Validate required fields
    const { firstName, lastName, email, phoneNumber, amount, eventId, quantity, ticketTypeId } = body;
    
    if (!firstName || !lastName || !email || !phoneNumber || !amount || !eventId || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields: firstName, lastName, email, phoneNumber, amount, eventId, quantity" },
        { status: 400 }
      );
    }

    // Create a ticket record in the database with pending status
    const { data: ticket, error: ticketError } = await supabase
      .from("tickets")
      .insert({
        event_id: eventId,
        ticket_type_id: ticketTypeId || null,
        email,
        buyer_name: `${firstName} ${lastName}`,
        buyer_phone: phoneNumber,
        quantity: parseInt(quantity),
        price: parseFloat(amount) / parseInt(quantity), // price per ticket
        status: "pending",
        pesapal_status: "initiated"
      })
      .select("id")
      .single();

    if (ticketError) {
      console.error("Error creating ticket record:", ticketError);
      return NextResponse.json(
        { error: "Failed to create ticket record", details: ticketError.message },
        { status: 500 }
      );
    }

    // Get the created ticket ID
    const ticketId = ticket.id;

    // Prepare callback URL for Pesapal
    const callbackUrl = process.env.PESAPAL_CALLBACK_URL || `${request.nextUrl.origin}/payment-complete`;

    // Submit order to Pesapal
    const orderResponse = await pesapalService.submitOrder(
      ticketId,
      parseFloat(amount),
      "UGX", // Hardcoded currency as per documentation
      callbackUrl,
      {
        id: ticketId,
        name: `${firstName} ${lastName}`,
        email,
        phone: phoneNumber,
        parent_name: `${firstName} ${lastName}`,
        campus: "Not Applicable", // Tickets don't have campus
        payment_status: "pending",
        message: JSON.stringify({ eventId, ticketTypeId })
      }
    );

    // Extract the order tracking ID from Pesapal response
    const orderTrackingId = orderResponse.order_tracking_id || orderResponse.orderTrackingId;

    if (!orderTrackingId) {
      console.error("Pesapal did not return an order tracking id", orderResponse);
      
      // Update ticket to failed status since order submission failed
      await supabase
        .from("tickets")
        .update({ 
          status: "failed", 
          pesapal_status: "order submission failed" 
        })
        .eq("id", ticketId);

      return NextResponse.json(
        { error: "Failed to create payment order" },
        { status: 502 }
      );
    }

    // Update the ticket record with Pesapal transaction ID
    const { error: updateError } = await supabase
      .from("tickets")
      .update({ 
        pesapal_transaction_id: orderTrackingId,
        status: "pending",
        pesapal_status: "awaiting payment"
      })
      .eq("id", ticketId);

    if (updateError) {
      console.error("Error updating ticket with Pesapal transaction ID:", updateError);
      
      return NextResponse.json(
        { error: "Failed to update ticket record", details: updateError.message },
        { status: 500 }
      );
    }

    // Return the redirect URL to the frontend
    return NextResponse.json({
      url: orderResponse.redirect_url || orderResponse.redirectUrl
    });
  } catch (error) {
    console.error("Error processing Pesapal payment for tickets:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to process payment", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}