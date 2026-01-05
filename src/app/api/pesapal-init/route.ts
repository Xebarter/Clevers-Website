import { NextResponse } from "next/server";
import { pesapalService } from "@/lib/pesapal";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // The IPN is now registered server-side when needed
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || "http://localhost:3000";
    const ipnUrl = `${baseUrl}/api/pesapal/ipn`; // Updated to use the new IPN endpoint
    
    // Register the IPN with Pesapal
    await pesapalService.registerIPN(ipnUrl);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Pesapal service initialized successfully',
      ipnUrl: ipnUrl
    });
  } catch (error) {
    console.error('Failed to initialize Pesapal service:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to initialize Pesapal service',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}