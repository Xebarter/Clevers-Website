import { NextRequest, NextResponse } from "next/server";
import { pesapalService } from "@/lib/pesapal";
import { applicationsService } from "../../../../../lib/supabase/services";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { applicationId, amount, currency, description } = body;

    if (!applicationId || !amount || !currency) {
      return NextResponse.json(
        { error: "Missing required fields: applicationId, amount, currency" },
        { status: 400 }
      );
    }

    // Get application details
    const application = await applicationsService.getById(applicationId);
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Set up callback URL - prefer server-side configured callback
    const callbackUrl = process.env.PESAPAL_CALLBACK_URL ||
      `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/payment-callback`;

    // Submit order to Pesapal
    const orderResponse = await pesapalService.submitOrder(
      applicationId,
      amount,
      currency,
      callbackUrl,
      {
        id: application.id || applicationId,
        name: application.name,
        email: application.email,
        phone: application.phone,
        parent_name: application.parent_name,
        campus: application.campus || "",
        payment_status: application.payment_status || "pending",
        message: application.message,
      }
    );

    // Update application with the order tracking ID
    const parsedMessage = (() => {
      try { 
        return JSON.parse(application.message || "{}"); 
      } catch { 
        return {}; 
      }
    })();

    const orderTrackingId = orderResponse?.order_tracking_id || orderResponse?.orderTrackingId;
    if (!orderTrackingId) {
      console.error("Pesapal did not return an order tracking id", orderResponse);
      return NextResponse.json({ error: "Failed to create payment order" }, { status: 502 });
    }

    await applicationsService.update(applicationId, {
      message: JSON.stringify({
        ...parsedMessage,
        orderTrackingId,
        paymentStatus: "pending"
      }),
      payment_status: "pending" // Also update the payment status in the main field
    });

    return NextResponse.json({ 
      redirectUrl: orderResponse.redirect_url || orderResponse.redirectUrl, 
      merchantReference: applicationId 
    });
  } catch (error) {
    console.error("Error creating Pesapal order:", error);
    return NextResponse.json(
      { error: "Failed to create Pesapal order", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}