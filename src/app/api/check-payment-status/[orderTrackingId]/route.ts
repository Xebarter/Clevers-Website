import { NextResponse } from "next/server";
import { pesapalService } from "../../../../../src/lib/pesapal";
import { applicationsService } from "../../../../../lib/supabase/services";

export async function GET(
  request: Request,
  { params }: { params: { orderTrackingId: string } }
) {
  try {
    const { orderTrackingId } = params;

    if (!orderTrackingId) {
      return NextResponse.json(
        { error: "Order tracking ID is required" },
        { status: 400 }
      );
    }

    // Get transaction status from Pesapal
    const transactionStatus = await pesapalService.getTransactionStatus(orderTrackingId);

    // Update the application's payment status in the database based on Pesapal response
    if (transactionStatus && transactionStatus.merchant_reference) {
      const applicationId = transactionStatus.merchant_reference;
      
      // Update application with payment status
      const application = await applicationsService.getById(applicationId);
      if (application) {
        let newPaymentStatus = "pending";
        
        // According to Pesapal documentation, status values can be "COMPLETED", "PAID", "FAILED", etc.
        if (transactionStatus.payment_status_description === "COMPLETED" || 
            transactionStatus.payment_status_description === "PAID") {
          newPaymentStatus = "completed";
        } else if (transactionStatus.payment_status_description === "FAILED" || 
                  transactionStatus.payment_status_description === "CANCELLED") {
          newPaymentStatus = "failed";
        } else {
          newPaymentStatus = transactionStatus.payment_status_description.toLowerCase();
        }
        
        await applicationsService.update(applicationId, {
          payment_status: newPaymentStatus,
          payment_confirmation_code: transactionStatus.confirmation_code,
          payment_amount: transactionStatus.amount,
          payment_currency: transactionStatus.currency,
          payment_method: transactionStatus.payment_method,
          message: JSON.stringify({
            ...JSON.parse(application.message || "{}"),
            paymentStatus: newPaymentStatus,
            confirmationCode: transactionStatus.confirmation_code,
            amount: transactionStatus.amount,
            currency: transactionStatus.currency,
            paymentMethod: transactionStatus.payment_method,
            description: transactionStatus.description,
            lastUpdated: new Date().toISOString()
          })
        });
      }
    }

    return NextResponse.json({
      success: true,
      payment_status_description: transactionStatus.payment_status_description,
      details: transactionStatus,
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to check payment status", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}