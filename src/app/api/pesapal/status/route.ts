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

    // Query the applications table to find the record with this tracking ID
    const { data: application, error } = await supabase
      .from("applications")
      .select("*")
      .or(`message.ilike.%${orderTrackingId}%`) // Using ilike to find the tracking ID in the JSON message field
      .single();

    if (error || !application) {
      console.error("Error fetching application by tracking ID:", error);
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Extract payment status from the message field
    let paymentStatus = application.payment_status || "unknown";
    try {
      const messageData = JSON.parse(application.message || "{}");
      if (messageData.paymentStatus) {
        paymentStatus = messageData.paymentStatus;
      }
    } catch (parseError) {
      console.error("Error parsing application message:", parseError);
    }

    return NextResponse.json({
      status: paymentStatus,
      applicationId: application.id,
      orderTrackingId: orderTrackingId,
      paymentStatus: paymentStatus,
      applicationStatus: application.application_status,
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    return NextResponse.json(
      { error: "Failed to check payment status" },
      { status: 500 }
    );
  }
}