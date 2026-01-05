import { NextResponse } from "next/server";
import { pesapalService } from "../../../../src/lib/pesapal";
import { applicationsService } from "../../../../lib/supabase/services";

export async function POST(request: Request) {
  try {
    const { applicationId, amount, currency } = await request.json();

    console.log('Initiate payment request received:', { applicationId, amount, currency });

    if (!applicationId || !amount || !currency) {
      console.error('Missing required fields:', { applicationId, amount, currency });
      return NextResponse.json(
        { error: "Missing required fields: applicationId, amount, currency" },
        { status: 400 }
      );
    }

    // Log the environment variables (without exposing secrets)
    console.log('Environment variables check:', {
      hasConsumerKey: !!process.env.PESAPAL_CONSUMER_KEY,
      hasConsumerSecret: !!process.env.PESAPAL_CONSUMER_SECRET,
      hasSandbox: !!process.env.PESAPAL_SANDBOX,
      sandboxValue: process.env.PESAPAL_SANDBOX
    });

    // Fail fast with a clear message if Pesapal credentials are not configured server-side
    if (!process.env.PESAPAL_CONSUMER_KEY || !process.env.PESAPAL_CONSUMER_SECRET) {
      const msg = 'Pesapal credentials missing: set PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET in server env.';
      console.error(msg);
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    // Get application details
    console.log('Fetching application:', applicationId);
    const application = await applicationsService.getById(applicationId);
    if (!application) {
      console.error('Application not found:', applicationId);
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Set up callback URL - prefer server-side configured callback
    const callbackUrl = process.env.PESAPAL_CALLBACK_URL ||
      `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/payment-callback`;
      
    console.log('Callback URL:', callbackUrl);

    // Submit order to Pesapal
    console.log('Submitting order to Pesapal with data:', { 
      applicationId, 
      amount, 
      currency, 
      callbackUrl,
      applicationData: {
        id: application.id || applicationId,
        name: application.name,
        email: application.email,
        phone: application.phone,
      }
    });
    
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

    console.log('Order response received:', orderResponse);

    // Update application with the order tracking ID
    const parsedMessage = (() => {
      try { return JSON.parse(application.message || "{}"); } catch { return {}; }
    })();

    const orderTrackingId = orderResponse?.order_tracking_id || orderResponse?.orderTrackingId;
    if (!orderTrackingId) {
      console.error('Pesapal did not return an order tracking id', orderResponse);
      return NextResponse.json({ error: 'Failed to create payment order' }, { status: 502 });
    }

    console.log('Updating application with tracking ID:', orderTrackingId);
    await applicationsService.update(applicationId, {
      message: JSON.stringify({
        ...parsedMessage,
        orderTrackingId,
        paymentStatus: 'pending'
      }),
      payment_status: 'pending' // Also update the payment status in the main field
    });

    // Build redirect URL (prefer base URL from env or fallback to sandbox/live chooser)
    const pesapalBase = process.env.PESAPAL_BASE_URL || (process.env.NODE_ENV === 'production'
      ? 'https://pay.pesapal.com/v3'
      : 'https://cybqa.pesapal.com/pesapalv3');

    console.log('Payment initiation successful, returning response');
    return NextResponse.json({
      success: true,
      orderTrackingId,
      redirectUrl: `${pesapalBase.replace(/\/v3$/, '')}/Transaction/View?orderTrackingId=${orderTrackingId}`,
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to initiate payment", 
        details: error instanceof Error ? error.message : "Unknown error",
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      },
      { status: 500 }
    );
  }
}