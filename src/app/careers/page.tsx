import React from "react";
import { Metadata } from "next";
import CareerApplicationForm from "@/components/CareerApplicationForm";
import { Briefcase, Users, Heart, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers | Clevers' Origin Schools",
  description: "Join our team at Clevers' Origin Schools. Explore career opportunities and apply to be part of our dedicated team of educators and staff.",
};

export default function CareersPage() {
  const benefits = [
    {
      icon: <Users className="w-8 h-8 text-pink-500" />,
      title: "Collaborative Environment",
      description: "Work alongside passionate educators in a supportive team atmosphere.",
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-yellow-500" />,
      title: "Professional Development",
      description: "Continuous learning opportunities and career growth programs.",
    },
    {
      icon: <Heart className="w-8 h-8 text-green-500" />,
      title: "Meaningful Impact",
      description: "Make a difference in the lives of children and shape future generations.",
    },
    {
      icon: <Briefcase className="w-8 h-8 text-blue-500" />,
      title: "Competitive Benefits",
      description: "Attractive compensation packages and employee benefits.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tl from-yellow-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 md:py-24 bg-gradient-to-br from-pink-100 via-yellow-100 to-green-100 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 bg-clip-text text-transparent">
                  Join Our Team
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-yellow-300 to-green-400 rounded-full"></span>
              </span>
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
              Be part of a passionate team dedicated to nurturing young minds and shaping the future at Clevers' Origin Schools.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Work With Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              At Clevers' Origin Schools, we believe our staff are our greatest asset. We offer a rewarding career in education with numerous benefits.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="flex justify-center mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-pink-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Apply Now</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ready to make a difference? Fill out the application form below and take the first step towards a rewarding career with us.
            </p>
          </div>
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
            <CareerApplicationForm />
          </div>
        </div>
      </section>

      {/* Check Application Status Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Already Applied?</h2>
          <p className="text-gray-600 mb-6">
            Check the status of your job application and download your application as PDF.
          </p>
          <a
            href="/careers/status"
            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-medium rounded-lg transition-colors"
          >
            Check Application Status
          </a>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-gradient-to-br from-pink-50 to-yellow-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Have Questions?</h2>
          <p className="text-gray-600 mb-6">
            For any inquiries about career opportunities, please contact our HR department.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-gray-700">
            <a
              href="mailto:careers@cleversorigin.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-pink-50 border border-pink-200 rounded-lg transition-colors"
            >
              <span className="font-medium">careers@cleversorigin.com</span>
            </a>
            <a
              href="tel:+256700000000"
              className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-yellow-50 border border-yellow-200 rounded-lg transition-colors"
            >
              <span className="font-medium">+256 700 000 000</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
