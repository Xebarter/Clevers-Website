import React from "react";
import { Metadata } from "next";
import ApplicationForm from "@/components/ApplicationForm";

export const metadata: Metadata = {
  title: "Apply Now | Clevers' Origin Schools",
  description: "Apply to Clevers' Origin Schools for a nurturing and innovative educational experience at our Kitintale, Kasokoso, or Maganjo campuses.",
};

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-tl from-yellow-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 md:py-24 bg-gradient-to-br from-pink-100 via-yellow-100 to-green-100 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 bg-clip-text text-transparent">
                  Apply to Clevers' Origin Schools
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-yellow-300 to-green-400 rounded-full"></span>
              </span>
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
              Join our vibrant community at Kitintale, Kasokoso, or Maganjo. Complete the form below to start your application.
            </p>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
            <ApplicationForm />
          </div>
        </div>
      </section>
    </div>
  );
}