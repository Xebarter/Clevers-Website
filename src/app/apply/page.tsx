import React from "react";
import { Metadata } from "next";
import ApplicationForm from "@/components/ApplicationForm";

export const metadata: Metadata = {
  title: "Apply Now | Clevers' Origin Schools",
  description: "Apply to Clevers' Origin Schools for a nurturing and innovative educational experience at our Kitintale, Kasokoso, or Maganjo campuses.",
};

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-blue-900/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">
              Apply to Clevers' Origin Schools
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Join our vibrant community at Kitintale, Kasokoso, or Maganjo. Complete the form below to start your application.
            </p>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <ApplicationForm />
          </div>
        </div>
      </section>
    </div>
  );
}