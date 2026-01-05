import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set in environment variables (server)");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request: NextRequest) {
  try {
    // Pesapal will send a POST request with payment information
    const payload = await request.json();

    console.log("Received Pesapal IPN payload:", payload);

    // Verify this is a legitimate request from Pesapal
    // Extract relevant data from the payload according to Pesapal documentation
    const {
      OrderTrackingId,  // ID that was sent to Pesapal
      OrderNotificationType,  // PAYMENT_COMPLETED, PAYMENT_FAILED, PAYMENT_CANCELLED
      OrderMerchantReference,
      payment_status_description,
      payment_method,
      confirmation_code,
    } = payload;

    if (!OrderTrackingId || !OrderNotificationType) {
      console.error("Missing required fields in Pesapal IPN:", { OrderTrackingId, OrderNotificationType });
      return new Response(
        JSON.stringify({ error: "Missing required fields in IPN" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Determine the status based on notification type
    let newStatus = "pending";
    let pesapalStatus = "";

    if (OrderNotificationType === "PAYMENT_COMPLETED") {
      newStatus = "confirmed";
      pesapalStatus = "completed";
    } else if (OrderNotificationType === "PAYMENT_FAILED" || OrderNotificationType === "PAYMENT_CANCELLED") {
      newStatus = "failed";
      pesapalStatus = OrderNotificationType.toLowerCase().replace("payment_", "");
    } else {
      pesapalStatus = OrderNotificationType;
    }

    // Try to update tickets table first
    let updateResult = await supabase
      .from("tickets")
      .update({
        status: newStatus,
        pesapal_status: pesapalStatus,
        ...(confirmation_code && { confirmation_code })
      })
      .eq("pesapal_transaction_id", OrderTrackingId);

    // If no tickets were updated, try updating applications
    if (updateResult.data && updateResult.data.length === 0) {
      // Check if any rows were affected in the ticket update
      const ticketResult = await supabase
        .from("tickets")
        .select("id")
        .eq("pesapal_transaction_id", OrderTrackingId);

      if (ticketResult.data && ticketResult.data.length === 0) {
        // No ticket found, so try updating application
        const applicationUpdateResult = await supabase
          .from("applications")
          .update({
            payment_status: newStatus === "confirmed" ? "completed" : newStatus,
            application_status: newStatus === "confirmed" ? "PAID" : "PAYMENT_FAILED",
            pesapal_status: pesapalStatus,
            ...(confirmation_code && { payment_confirmation_code: confirmation_code })
          })
          .eq("pesapal_transaction_id", OrderTrackingId);

        if (applicationUpdateResult.error) {
          console.error("Error updating application with IPN data:", applicationUpdateResult.error);
          return new Response(
            JSON.stringify({ error: "Failed to update application record" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }

        console.log(`Application status updated for tracking ID ${OrderTrackingId}: ${newStatus} (${OrderNotificationType})`);
      } else {
        // Ticket was found and updated
        if (updateResult.error) {
          console.error("Error updating ticket with IPN data:", updateResult.error);
          return new Response(
            JSON.stringify({ error: "Failed to update ticket record" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }

        console.log(`Ticket status updated for tracking ID ${OrderTrackingId}: ${newStatus} (${OrderNotificationType})`);
      }
    } else {
      // Ticket was updated
      if (updateResult.error) {
        console.error("Error updating ticket with IPN data:", updateResult.error);
        return new Response(
          JSON.stringify({ error: "Failed to update ticket record" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      console.log(`Ticket status updated for tracking ID ${OrderTrackingId}: ${newStatus} (${OrderNotificationType})`);
    }

    // Respond to Pesapal that we received the notification
    return new Response(
      JSON.stringify({
        status: "success",
        message: "IPN received and processed",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing IPN:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}