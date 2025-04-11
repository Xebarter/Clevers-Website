"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, HelpCircle, Clock, FileText, Phone, Mail } from "lucide-react";

const ApplicationInfo = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-primary/5 pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Application Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Fill out all required information in the application form.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Provide accurate contact details for communication.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Select your preferred campus and admission term.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Review your application before final submission.</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-primary/5 pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Required Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-gray-500 mb-3">
            After submitting this application, you will need to provide the following documents:
          </p>
          <ul className="space-y-2 text-sm">
            <li>Birth certificate (copy)</li>
            <li>Previous school records/transcripts</li>
            <li>Immunization records</li>
            <li>Passport-sized photographs (4)</li>
            <li>Parent/guardian ID (copy)</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-primary/5 pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ol className="space-y-3 list-decimal ml-5">
            <li>
              <span className="font-medium">Application Review</span>
              <p className="text-sm text-gray-500">Our admissions team will review your application (5-7 business days).</p>
            </li>
            <li>
              <span className="font-medium">Interview Scheduling</span>
              <p className="text-sm text-gray-500">If pre-qualified, you'll be invited for an interview and assessment.</p>
            </li>
            <li>
              <span className="font-medium">Final Decision</span>
              <p className="text-sm text-gray-500">Admission decision will be communicated via email/phone.</p>
            </li>
            <li>
              <span className="font-medium">Enrollment</span>
              <p className="text-sm text-gray-500">If accepted, complete the enrollment process and fee payment.</p>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-primary/5 pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-gray-500 mb-3">
            If you need assistance with your application, please contact our admissions office:
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>+256 750 123456</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>admissions@cleversorigin.edu</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationInfo;
