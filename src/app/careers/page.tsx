import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import CareerApplicationForm from "@/components/CareerApplicationForm";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Heart, GraduationCap, ArrowRight, Sparkles, Mail, Phone, ClipboardList } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers | Clevers' Origin Schools",
  description:
    "Join our team at Clevers' Origin Schools. Explore career opportunities and apply to be part of our dedicated educators and staff.",
};

const benefits = [
  {
    icon: Users,
    title: "Collaborative Environment",
    description: "Work alongside passionate educators in a supportive team atmosphere.",
    color: "text-pink-600 bg-pink-50 border-pink-100",
  },
  {
    icon: GraduationCap,
    title: "Professional Development",
    description: "Continuous learning opportunities and career growth programs.",
    color: "text-yellow-700 bg-yellow-50 border-yellow-100",
  },
  {
    icon: Heart,
    title: "Meaningful Impact",
    description: "Make a difference in the lives of children and shape future generations.",
    color: "text-green-600 bg-green-50 border-green-100",
  },
  {
    icon: Briefcase,
    title: "Competitive Benefits",
    description: "Attractive compensation packages and employee benefits.",
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50/20 to-yellow-50/30">
      {/* Hero */}
      <section className="relative py-16 sm:py-20 overflow-hidden bg-gradient-to-br from-pink-50 via-yellow-50/80 to-green-50">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-200/15 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-pink-100 shadow-sm mb-6">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">We&apos;re hiring</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-5">
            Join Our{" "}
            <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 bg-clip-text text-transparent">
              Team
            </span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Be part of a passionate team dedicated to nurturing young minds and shaping the future at
            Clevers&apos; Origin Schools.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-600 mb-3">Why join us</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Why Work With Us?</h2>
            <p className="text-gray-600 mt-3 leading-relaxed">
              Our staff are our greatest asset. We offer a rewarding career in education with real benefits.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article
                  key={benefit.title}
                  className={`rounded-2xl border p-6 text-center transition-shadow hover:shadow-md ${benefit.color}`}
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-white/80 flex items-center justify-center mb-4 shadow-sm">
                    <Icon className={`h-6 w-6 ${benefit.color.split(" ")[0]}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50/80 to-white" id="apply">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-600 mb-3">Apply today</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Application Form</h2>
            <p className="text-gray-600 mt-3 leading-relaxed">
              Ready to make a difference? Complete the form below to take the first step toward a rewarding career
              with us.
            </p>
          </div>
          <div className="max-w-2xl mx-auto rounded-2xl border border-gray-100 bg-white shadow-lg p-6 sm:p-8">
            <CareerApplicationForm />
          </div>
        </div>
      </section>

      {/* Status check */}
      <section className="py-14 border-y border-gray-100 bg-white">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-xl">
          <ClipboardList className="h-10 w-10 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Already Applied?</h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Check the status of your job application and download your submission as a PDF.
          </p>
          <Link href="/careers/status">
            <Button className="rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md">
              Check Application Status <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* HR contact */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-yellow-50/50 to-pink-50/30">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Have Questions?</h2>
          <p className="text-gray-600 mb-8">
            For inquiries about career opportunities, contact our HR department.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="mailto:cleversorigin@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-all"
            >
              <Mail className="h-4 w-4 text-pink-500" />
              cleversorigin@gmail.com
            </a>
            <a
              href="tel:+256772470972"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-all"
            >
              <Phone className="h-4 w-4 text-green-600" />
              +256 772 470 972
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
