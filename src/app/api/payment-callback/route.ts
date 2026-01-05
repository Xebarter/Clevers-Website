import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { pesapalService } from '../../../lib/pesapal';

export const dynamic = 'force-dynamic';

// Initialize Supabase client (server-side service role)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseServiceRoleKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables (server)');
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables (server)');
}
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request: NextRequest) {
  try {
    // Pesapal will send a POST request with payment information
    let payload: any;
    try {
      payload = await request.json();
    } catch (e) {
      const text = await request.text();
      try { payload = JSON.parse(text); } catch { payload = { raw: text }; }
    }

    console.log('Received Pesapal callback payload:', payload);

    // helper to try multiple possible keys
    const get = (obj: any, ...keys: string[]) => {
      for (const k of keys) {
        if (obj == null) continue;
        if (k in obj) return obj[k];
        // try case-insensitive
        const foundKey = Object.keys(obj).find(x => x.toLowerCase() === k.toLowerCase());
        if (foundKey) return obj[foundKey];
      }
      return undefined;
    };

    const OrderTrackingId = get(payload, 'OrderTrackingId', 'order_tracking_id', 'orderTrackingId', 'OrderTrackingID');
    const OrderMerchantReference = get(payload, 'OrderMerchantReference', 'merchant_reference', 'merchantReference', 'order_merchant_reference');
    let PaymentStatus = get(payload, 'PaymentStatus', 'status', 'payment_status', 'payment_status_description');
    const Currency = get(payload, 'Currency', 'currency');
    const Amount = get(payload, 'Amount', 'amount');
    const PaymentMethod = get(payload, 'PaymentMethod', 'payment_method');
    const Description = get(payload, 'Description', 'description');
    const ConfirmationCode = get(payload, 'ConfirmationCode', 'confirmation_code', 'confirmationCode');
    const Message = get(payload, 'Message', 'message');

    // If Pesapal didn't include a clear status, attempt to fetch it from their API
    if (!PaymentStatus && OrderTrackingId) {
      try {
        const statusResp = await pesapalService.getTransactionStatus(OrderTrackingId);
        PaymentStatus = statusResp?.payment_status_description || statusResp?.payment_status || statusResp?.status || PaymentStatus;
      } catch (err) {
        console.warn('Unable to fetch transaction status from Pesapal:', err);
      }
    }

    if (!OrderTrackingId || !OrderMerchantReference) {
      console.error('Missing required fields in Pesapal callback:', { OrderTrackingId, OrderMerchantReference });
      return new Response(
        JSON.stringify({ error: 'Missing required fields in callback' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update the application record with payment status
    const { data: application, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', OrderMerchantReference)
      .single();

    if (error || !application) {
      console.error('Error fetching application:', error);
      return new Response(
        JSON.stringify({ error: 'Application not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Map Pesapal statuses to our application payment status
    const mapStatus = (s: any) => {
      if (!s) return 'pending';
      const str = String(s).toUpperCase();
      if (['COMPLETED', 'PAID', 'SUCCESS'].includes(str)) return 'completed';
      if (['FAILED', 'DECLINED', 'CANCELLED', 'ERROR'].includes(str)) return 'failed';
      if (['PENDING', 'PROCESSING', 'AWAITING'].includes(str)) return 'pending';
      return str.toLowerCase();
    };

    const paymentStatus = mapStatus(PaymentStatus);

    // Update the application with payment status
    const existingMessage = (() => {
      try { return JSON.parse(application.message || '{}'); } catch { return {}; }
    })();

    const updatedMessage = {
      ...existingMessage,
      paymentStatus,
      orderTrackingId: OrderTrackingId,
      paymentMethod: PaymentMethod,
      amount: Amount,
      currency: Currency,
      description: Description,
      confirmationCode: ConfirmationCode,
      rawPesapalPayload: payload,
      lastUpdated: new Date().toISOString()
    };

    const { error: updateError } = await supabase
      .from('applications')
      .update({
        payment_status: paymentStatus,
        payment_confirmation_code: ConfirmationCode || null,
        payment_amount: Amount || null,
        payment_currency: Currency || null,
        payment_date: new Date().toISOString(),
        payment_method: PaymentMethod || null,
        application_status: paymentStatus === 'completed' ? 'PAID' : application.application_status,
        message: JSON.stringify(updatedMessage),
      })
      .eq('id', OrderMerchantReference);

    if (updateError) {
      console.error('Error updating application:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update application' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Payment status updated for application ${OrderMerchantReference}: ${PaymentStatus}`);

    // Respond to Pesapal that we received the notification
    return new Response(
      JSON.stringify({
        message: 'Payment notification received and processed successfully',
        applicationId: OrderMerchantReference,
        status: PaymentStatus,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing payment callback:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET(request: Request) {
  // Pesapal may also use GET requests for IPN
  const { searchParams } = new URL(request.url);
  const orderTrackingId = searchParams.get('OrderTrackingId');
  const orderMerchantReference = searchParams.get('OrderMerchantReference');

  if (!orderTrackingId || !orderMerchantReference) {
    return NextResponse.json(
      { error: "Missing tracking ID or merchant reference" },
      { status: 400 }
    );
  }

  // In a real implementation, you would verify this is from Pesapal
  // and update the application status accordingly
  console.log(`Received GET callback for order ${orderTrackingId}, application ${orderMerchantReference}`);

  try {
    // Fetch the current status from Pesapal to confirm
    // (This would require calling Pesapal's API to get the actual status)

    // For now, just return a success response
    return NextResponse.json({
      success: true,
      message: "GET callback received",
      orderTrackingId,
      orderMerchantReference
    });
  } catch (error) {
    console.error("Error processing GET callback:", error);

    return NextResponse.json(
      {
        error: "Failed to process GET callback",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}