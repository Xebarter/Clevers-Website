import { NextRequest } from 'next/server';
import { pesapalService } from '@/lib/pesapal';
import { applicationsService } from '../../../lib/supabase/services';

export async function POST(request: NextRequest) {
  try {
    const {
      amount,
      currency,
      merchantReference,
      description,
      billingAddress,
      applicationId,
    } = await request.json();

    // Validate required fields
    if (!amount || !currency || !merchantReference || !description || !applicationId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare application data for the order
    const applicationData = {
      name: (billingAddress?.first_name || '') + ' ' + (billingAddress?.last_name || ''),
      email: billingAddress?.email_address || '',
      phone: billingAddress?.phone_number || '',
      campus: billingAddress?.line_1 || '',
    };

    // Prepare callback URL for payment completion
    const callbackUrl = `${request.nextUrl.origin}/api/payment-callback`;

    // Submit order to Pesapal
    const result = await pesapalService.submitOrder(
      merchantReference, // merchantReference should be the application id
      amount,
      currency,
      callbackUrl,
      {
        ...applicationData,
        name: applicationData.name || 'Applicant',
        email: applicationData.email,
        phone: applicationData.phone,
        campus: applicationData.campus,
      }
    );

    // Extract tracking id from Pesapal response
    const orderTrackingId = (result as any)?.order_tracking_id || (result as any)?.orderTrackingId;
    if (!orderTrackingId) {
      console.error('Pesapal did not return an order tracking id', result);
      return new Response(
        JSON.stringify({ error: 'Failed to create payment order', details: result }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update application in DB with tracking ID and pending status
    try {
      const app = await applicationsService.getById(merchantReference);
      const parsedMessage = (() => {
        try {
          return JSON.parse(app?.message || '{}');
        } catch {
          return {};
        }
      })();

      await applicationsService.update(merchantReference, {
        message: JSON.stringify({
          ...parsedMessage,
          orderTrackingId,
          paymentStatus: 'pending',
        }),
      });
    } catch (dbErr) {
      console.error('Failed to update application with orderTrackingId:', dbErr);
      // Don't fail the entire flow for a DB update error; continue to return the redirect URL
    }

    // Build redirect URL for Pesapal transaction view
    const pesapalBase = process.env.PESAPAL_BASE_URL || (process.env.NODE_ENV === 'production'
      ? 'https://pay.pesapal.com/v3'
      : 'https://cybqa.pesapal.com/pesapalv3');

    const redirectUrl = `${pesapalBase.replace(/\/v3$/, '')}/Transaction/View?orderTrackingId=${orderTrackingId}`;

    return new Response(
      JSON.stringify({ success: true, orderTrackingId, redirectUrl }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error initiating payment:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to initiate payment', details: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}