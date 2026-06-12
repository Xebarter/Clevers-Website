import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import ApplicationForm from "@/components/ApplicationForm";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Clock,
  FileText,
  Calendar,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Apply Now | Clevers' Origin Schools",
  description:
    "Apply to Clevers' Origin Schools for a nurturing educational experience at our Kitintale, Kasokoso, or Maganjo campuses.",
};

const steps = [
  "Student information",
  "Parent / guardian details",
  "Campus & boarding preference",
  "Additional information",
  "Review & submit",
];

const campuses = [
  {
    name: "Kitintale",
    dot: "bg-red-500",
    accent: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
    options: "Day & Boarding",
  },
  {
    name: "Kasokoso",
    dot: "bg-blue-500",
    accent: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    options: "Day school",
  },
  {
    name: "Maganjo",
    dot: "bg-emerald-500",
    accent: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    options: "Day & Boarding",
  },
];

const afterApply = [
  {
    icon: Mail,
    title: "Confirmation email",
    text: "You'll receive an acknowledgement with your application reference number.",
  },
  {
    icon: Calendar,
    title: "Admissions review",
    text: "Our team reviews your application and contacts you within 3–5 working days.",
  },
  {
    icon: MapPin,
    title: "Campus visit",
    text: "We invite you to tour your preferred campus and meet our staff.",
  },
];

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50/20 to-green-50/30">
      {/* Hero — compact on mobile so the form is reachable immediately */}
      <section className="relative py-6 sm:py-12 lg:py-20 overflow-hidden bg-gradient-to-br from-pink-50 via-yellow-50/80 to-green-50">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative text-center max-w-3xl">
          <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-pink-100 shadow-sm mb-6">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Admissions open for 2025</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-2 sm:mb-5">
            Apply to{" "}
            <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 bg-clip-text text-transparent">
              Clevers&apos; Origin Schools
            </span>
          </h1>
          <p className="hidden sm:block text-lg text-gray-600 leading-relaxed">
            Join our community at Kitintale, Kasokoso, or Maganjo. Complete the form below — it takes about 10
            minutes.
          </p>
        </div>
      </section>

      {/* Form */}
      <section
        className="pt-4 sm:pt-8 lg:py-16 pb-28 md:pb-16 bg-gradient-to-b from-gray-50/90 to-white"
        id="application-form"
      >
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="hidden lg:block text-left mb-10 lg:mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-600 mb-3">Start your application</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Admission Application</h2>
            <p className="text-gray-600 mt-3 max-w-2xl leading-relaxed">
              Fill in the details below. Our admissions team will review your submission and get back to you promptly.
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10 items-start">
            {/* Form — first on mobile */}
            <div className="order-1 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2 rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500" />
              <div className="p-4 sm:p-8 lg:p-10">
                <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-100">
                  <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Application form</h2>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        Fields marked <span className="text-red-500 font-medium">*</span> are required
                      </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-gray-50 border border-gray-100 px-3 py-1.5 text-xs text-gray-600">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      ~10 min
                    </div>
                  </div>
                  <a
                    href="tel:+256772470972"
                    className="lg:hidden inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-green-700"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Need help? Call admissions
                  </a>
                </div>
                <ApplicationForm />
              </div>
            </div>

            {/* Application steps — desktop sidebar only */}
            <div className="hidden lg:block lg:col-start-1 lg:row-start-1 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-green-600" />
                </div>
                <h2 className="text-sm font-bold text-gray-900">Application steps</h2>
              </div>
              <ol className="space-y-1">
                {steps.map((step, i) => (
                  <li
                    key={step}
                    className="flex items-start gap-3 text-sm rounded-lg px-2 py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-50 text-xs font-bold text-green-700 ring-1 ring-green-100">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 pt-1 leading-snug">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Sidebar cards — after form on mobile; below steps on desktop */}
            <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-2 space-y-5 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <h2 className="text-sm font-bold text-gray-900">Our campuses</h2>
                </div>
                <ul className="space-y-2">
                  {campuses.map((c) => (
                    <li
                      key={c.name}
                      className={`flex items-center gap-3 text-sm rounded-lg px-3 py-2.5 border ${c.border} ${c.bg}`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${c.dot}`} />
                      <span>
                        <span className={`font-semibold ${c.accent}`}>{c.name}</span>
                        <span className="text-gray-500 block text-xs mt-0.5">{c.options}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/campus"
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-green-700 hover:text-green-800 hover:underline"
                >
                  Compare campuses <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50/50 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-white/80 flex items-center justify-center shadow-sm">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <h2 className="text-sm font-bold text-green-900">Need help?</h2>
                </div>
                <p className="text-xs text-green-800/80 mb-3 leading-relaxed">
                  Our admissions team is happy to guide you through the process.
                </p>
                <a
                  href="tel:+256772470972"
                  className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-green-800 mb-2 transition-colors"
                >
                  <Phone className="h-4 w-4 text-green-600" />
                  +256 772 470 972
                </a>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-green-800 transition-colors"
                >
                  <Mail className="h-4 w-4 text-green-600" />
                  Contact admissions
                </Link>
              </div>

              <div className="hidden lg:flex items-start gap-2.5 rounded-xl bg-white border border-gray-100 p-4 text-xs text-gray-500 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>Fields marked with * are required. Your data is handled securely and never shared.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What happens next — desktop only; keeps mobile focused on the form */}
      <section className="hidden lg:block py-14 sm:py-16 border-t border-gray-100 bg-white">
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 mb-3">After you apply</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">What Happens Next?</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {afterApply.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="relative text-center sm:text-left">
                  {i < afterApply.length - 1 && (
                    <div className="hidden sm:block absolute top-6 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-gray-200 to-transparent" />
                  )}
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4 ring-1 ring-blue-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA — desktop only */}
      <section className="hidden lg:block py-14 bg-gradient-to-r from-pink-100/60 via-yellow-50 to-green-100/60">
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Prefer to Visit First?</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto leading-relaxed">
            Schedule a campus tour to explore our facilities, meet our teachers, and see learning in action.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button className="rounded-lg bg-green-600 hover:bg-green-700 text-white gap-2 px-6">
                Schedule a visit <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/campus">
              <Button variant="outline" className="rounded-lg border-gray-300 gap-2 px-6">
                Explore campuses
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
