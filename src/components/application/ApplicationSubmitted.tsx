"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Download, ArrowRight } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { ApplicationFormValues } from "./ApplicationFormProvider";

const ApplicationSubmitted = () => {
  const { getValues } = useFormContext<ApplicationFormValues>();
  const values = getValues();

  // Generate a random application reference number
  const applicationRef = `APP-${Math.floor(100000 + Math.random() * 900000)}-${new Date().getFullYear()}`;

  // Format date for display
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="text-center py-8">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold mb-4">Application Submitted Successfully!</h2>

      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Thank you for applying to Clevers' Origin Schools. We have received your application and will be in touch soon.
      </p>

      <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-md mx-auto text-left">
        <h3 className="font-bold text-lg mb-4">Application Details</h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Application ID:</span>
            <span className="font-medium">{applicationRef}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Applicant Name:</span>
            <span className="font-medium">{values.student.firstName} {values.student.lastName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Campus:</span>
            <span className="font-medium capitalize">{values.campusPreference.campus} Campus</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Submission Date:</span>
            <span className="font-medium">{formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download Application
        </Button>

        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          Schedule a Visit
        </Button>
      </div>

      <div className="border-t border-gray-200 pt-6 mt-6">
        <p className="text-gray-500 mb-6">
          What happens next? Our admissions team will review your application and contact you within 1-2 business days.
        </p>

        <Link href="/">
          <Button className="gap-2">
            Return to Homepage
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ApplicationSubmitted;
