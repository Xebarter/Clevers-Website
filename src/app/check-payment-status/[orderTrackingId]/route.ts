import { NextRequest } from 'next/server';
import { pesapalService } from '@/lib/pesapal';

export async function GET(request: NextRequest, { params }: { params: { orderTrackingId: string } }) {
  try {
    const { orderTrackingId } = params;

    if (!orderTrackingId) {
      return new Response(
        JSON.stringify({ error: 'Order tracking ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get transaction status from Pesapal
    const status = await pesapalService.getTransactionStatus(orderTrackingId);

    return new Response(
      JSON.stringify(status),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error checking payment status:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to check payment status' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}