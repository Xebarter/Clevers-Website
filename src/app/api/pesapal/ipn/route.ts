import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client (server-side service role)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseServiceRoleKey) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is not set in environment variables (server)");
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set in environment variables (server)");
}
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(req: NextRequest) {
  try {
    // Pesapal will send a POST request with payment information
    const payload = await req.json();

    console.log("Received Pesapal IPN payload:", payload);

    // Verify this is a legitimate request from Pesapal
    // Extract relevant data from the payload according to Pesapal documentation
    const {
      order_tracking_id: orderTrackingId,
      merchant_reference: merchantReference,
      status: paymentStatus,
      currency: currency,
      amount: amount,
      payment_method: paymentMethod,
      description: description,
      confirmation_code: confirmationCode,
      message: message,
    } = payload;

    if (!orderTrackingId || !merchantReference) {
      console.error("Missing required fields in Pesapal IPN:", { orderTrackingId, merchantReference });
      return new Response(
        JSON.stringify({ error: "Missing required fields in IPN" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update the application record with payment status
    const { data: application, error } = await supabase
      .from("applications")
      .select("*")
      .eq("id", merchantReference)
      .single();

    if (error || !application) {
      console.error("Error fetching application:", error);
      return new Response(
        JSON.stringify({ error: "Application not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Determine the payment status based on Pesapal's response
    let normalizedPaymentStatus = "pending";
    if (paymentStatus === "COMPLETED" || paymentStatus === "PAID") {
      normalizedPaymentStatus = "completed";
    } else if (paymentStatus === "FAILED" || paymentStatus === "CANCELLED") {
      normalizedPaymentStatus = "failed";
    } else {
      normalizedPaymentStatus = paymentStatus.toLowerCase();
    }

    // Update the application with payment status
    const { error: updateError } = await supabase
      .from("applications")
      .update({
        payment_status: normalizedPaymentStatus,
        payment_confirmation_code: confirmationCode,
        payment_amount: amount,
        payment_currency: currency,
        payment_date: new Date().toISOString(),
        payment_method: paymentMethod,
        application_status: normalizedPaymentStatus === "completed" 
          ? "PAID"
          : application.application_status, // Only update application status if payment was successful
        message: JSON.stringify({
          ...JSON.parse(application.message || "{}"),
          paymentStatus: normalizedPaymentStatus,
          orderTrackingId: orderTrackingId,
          paymentMethod: paymentMethod,
          amount: amount,
          currency: currency,
          description: description,
          confirmationCode: confirmationCode,
          lastUpdated: new Date().toISOString()
        })
      })
      .eq("id", merchantReference);

    if (updateError) {
      console.error("Error updating application:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update application" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`Payment status updated for application ${merchantReference}: ${paymentStatus}`);

    // Respond to Pesapal that we received the notification
    return new Response(
      JSON.stringify({
        status: "SUCCESS",
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