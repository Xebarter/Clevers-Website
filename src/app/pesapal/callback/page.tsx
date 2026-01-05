// Enable dynamic rendering to prevent static generation issues
"use client";

export const dynamic = 'force-dynamic';

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function PesapalCallbackContent() {
  const params = useSearchParams();
  const orderTrackingId = params.get("OrderTrackingId");
  const [status, setStatus] = useState<"PENDING" | "COMPLETED" | "FAILED" | "UNKNOWN">("PENDING");
  const [message, setMessage] = useState("Checking payment status...");
  const [applicationId, setApplicationId] = useState<string | null>(null);

  useEffect(() => {
    if (!orderTrackingId) {
      setStatus("UNKNOWN");
      setMessage("No tracking ID provided. Please return to the application form.");
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const res = await fetch(`/api/pesapal/status?orderTrackingId=${orderTrackingId}`);
        const data = await res.json();

        if (res.ok) {
          setApplicationId(data.applicationId);
          
          if (data.paymentStatus === "completed") {
            setStatus("COMPLETED");
            setMessage("Payment completed successfully! Your application is now being processed.");
          } else if (data.paymentStatus === "failed") {
            setStatus("FAILED");
            setMessage("Payment failed. Please try again.");
          } else {
            setStatus("PENDING");
            setMessage("Payment is still being processed. Please wait...");
          }
        } else {
          setStatus("UNKNOWN");
          setMessage("Unable to check payment status. Please contact support.");
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setStatus("UNKNOWN");
        setMessage("An error occurred while checking payment status. Please try again.");
      }
    };

    // Check status immediately
    checkPaymentStatus();

    // Then check every 5 seconds if still pending
    if (status === "PENDING") {
      const interval = setInterval(checkPaymentStatus, 5000);
      const timeout = setTimeout(() => clearInterval(interval), 300000); // 5 minutes max

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [orderTrackingId, status]);

  const getStatusIcon = () => {
    switch (status) {
      case "COMPLETED":
        return (
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        );
      case "FAILED":
        return (
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        );
      case "PENDING":
        return (
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-lg p-6 sm:p-8"
      >
        <div className="text-center">
          {getStatusIcon()}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Status</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          
          {orderTrackingId && (
            <div className="text-sm text-gray-500 mb-4">
              <p>Tracking ID: <span className="font-mono font-semibold">{orderTrackingId}</span></p>
            </div>
          )}
          
          {applicationId && (
            <div className="text-sm text-gray-500 mb-6">
              <p>Application ID: <span className="font-mono font-semibold">{applicationId}</span></p>
            </div>
          )}

          {status === "COMPLETED" && (
            <div className="mt-6">
              <a 
                href="/apply" 
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
              >
                Return to Application
              </a>
            </div>
          )}

          {status === "FAILED" && (
            <div className="mt-6">
              <a 
                href="/apply" 
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
              >
                Try Again
              </a>
            </div>
          )}

          {status === "UNKNOWN" && (
            <div className="mt-6">
              <a 
                href="/contact" 
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
              >
                Contact Support
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function PesapalCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PesapalCallbackContent />
    </Suspense>
  );
}