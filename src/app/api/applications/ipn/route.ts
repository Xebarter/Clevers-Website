import { NextRequest, NextResponse } from "next/server";

// Redirect to the main pesapal IPN handler which handles both tickets and applications
export async function POST(request: NextRequest) {
  // We'll reuse the main IPN handler at /api/pesapal-ipn
  // This route exists to maintain the same structure as documented for tickets
  // but all IPN processing is handled in the main route
  const payload = await request.json();
  
  // Forward the request to the main IPN handler
  const response = await fetch(`${request.nextUrl.origin}/api/pesapal-ipn`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
}