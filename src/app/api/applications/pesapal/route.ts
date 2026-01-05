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
    const { firstName, lastName, email, phoneNumber, amount, campus, gradeLevel } = body;

    if (!firstName || !lastName || !email || !phoneNumber || !amount || !campus || !gradeLevel) {
      return NextResponse.json(
        { error: "Missing required fields: firstName, lastName, email, phoneNumber, amount, campus, gradeLevel" },
        { status: 400 }
      );
    }

    // Create an application record in the database with pending status.
    // Use the same columns that `submit-application` uses to avoid inserting unknown columns.
    const insertPayload = {
      name: `${firstName} ${lastName}`,
      email,
      phone: phoneNumber,
      date_of_birth: null,
      gender: "",
      address: "",
      grade_level: gradeLevel,
      parent_name: `${firstName} ${lastName}`,
      parent_email: email,
      parent_phone: phoneNumber,
      message: JSON.stringify({ campus, gradeLevel, createdAt: new Date().toISOString() }),
      status: "pending",
      campus,
    };

    const { data: application, error: applicationError } = await supabase
      .from("applications")
      .insert([insertPayload])
      .select("id")
      .single();

    if (applicationError) {
      console.error("Error creating application record:", { insertPayload, applicationError });
      const details = applicationError?.message || JSON.stringify(applicationError);
      return NextResponse.json(
        { error: "Failed to create application record", details },
        { status: 500 }
      );
    }

    // Get the created application ID
    const applicationId = application.id;

    // Prepare callback URL for Pesapal
    const callbackUrl = process.env.PESAPAL_CALLBACK_URL || `${request.nextUrl.origin}/payment-complete`;

    // Submit order to Pesapal
    const orderResponse = await pesapalService.submitOrder(
      applicationId,
      parseFloat(amount),
      "UGX", // Hardcoded currency as per documentation
      callbackUrl,
      {
        id: applicationId,
        name: `${firstName} ${lastName}`,
        email,
        phone: phoneNumber,
        parent_name: `${firstName} ${lastName}`,
        campus: campus,
        payment_status: "pending",
        message: JSON.stringify({ gradeLevel, campus })
      }
    );

    // Extract the order tracking ID from Pesapal response
    const orderTrackingId = orderResponse.order_tracking_id || orderResponse.orderTrackingId;

    if (!orderTrackingId) {
      console.error("Pesapal did not return an order tracking id", orderResponse);

      // Update application to failed status since order submission failed
      await supabase
        .from("applications")
        .update({
          payment_status: "failed",
          application_status: "PAYMENT_FAILED"
        })
        .eq("id", applicationId);

      return NextResponse.json(
        { error: "Failed to create payment order" },
        { status: 502 }
      );
    }

    // Update the application record with Pesapal transaction ID and set status to awaiting payment
    const { error: updateError } = await supabase
      .from("applications")
      .update({
        pesapal_transaction_id: orderTrackingId,
        status: "awaiting_payment",
      })
      .eq("id", applicationId);

    if (updateError) {
      console.error("Error updating application with Pesapal transaction ID:", updateError);

      return NextResponse.json(
        { error: "Failed to update application record", details: updateError.message },
        { status: 500 }
      );
    }

    // Return the redirect URL to the frontend
    return NextResponse.json({
      url: orderResponse.redirect_url || orderResponse.redirectUrl,
      applicationId: applicationId
    });
  } catch (error) {
    console.error("Error processing Pesapal payment for applications:", error);

    return NextResponse.json(
      {
        error: "Failed to process payment",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}