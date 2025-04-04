import React from "react";
import type { Metadata } from "next";
import ApplicationForm from "@/components/application/ApplicationForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Apply for Admission | Clevers' Origin Schools",
  description: "Start your application to join Clevers' Origin Schools. Our multi-step application process is simple and straightforward.",
};

export default function ApplicationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Homepage</span>
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-3 font-heading text-kinder-blue">Application for Admission</h1>
          <p className="text-gray-600 max-w-2xl font-body">
            Thank you for your interest in Clevers' Origin Schools. This application will take approximately 10-15 minutes to complete. You can save your progress and return later.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <ApplicationForm />
        </div>
      </div>
    </div>
  );
}
