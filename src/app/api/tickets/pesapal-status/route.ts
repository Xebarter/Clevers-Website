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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderTrackingId = searchParams.get("orderTrackingId");

    if (!orderTrackingId) {
      return NextResponse.json(
        { error: "Order tracking ID is required" },
        { status: 400 }
      );
    }

    // Get transaction status from Pesapal
    const pesapalResponse = await pesapalService.getTransactionStatus(orderTrackingId);

    // Map Pesapal status to local status
    let localStatus = "pending";
    if (pesapalResponse.payment_status_description?.toLowerCase().includes("completed") || 
        pesapalResponse.payment_status_description?.toLowerCase().includes("success") ||
        pesapalResponse.payment_status_description?.toLowerCase().includes("paid")) {
      localStatus = "confirmed";
    } else if (pesapalResponse.payment_status_description?.toLowerCase().includes("failed") || 
               pesapalResponse.payment_status_description?.toLowerCase().includes("cancelled")) {
      localStatus = "failed";
    }

    // Update the ticket record with the new status
    const { data: ticket, error: updateError } = await supabase
      .from("tickets")
      .update({ 
        status: localStatus,
        pesapal_status: pesapalResponse.payment_status_description 
      })
      .eq("pesapal_transaction_id", orderTrackingId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating ticket status:", updateError);
      return NextResponse.json(
        { error: "Failed to update ticket status", details: updateError.message },
        { status: 500 }
      );
    }

    // Return the status information
    return NextResponse.json({
      status: localStatus,
      payment_status_description: pesapalResponse.payment_status_description,
      payment_method: pesapalResponse.payment_method,
      confirmation_code: pesapalResponse.confirmation_code,
      ticket: ticket
    });
  } catch (error) {
    console.error("Error checking Pesapal status for tickets:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to check payment status", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}