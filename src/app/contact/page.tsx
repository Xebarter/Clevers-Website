import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  ArrowRight,
  HelpCircle,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";
import ContactFAQ from "@/components/contact/ContactFAQ";

export const metadata: Metadata = {
  title: "Contact Us | Clevers' Origin Schools",
  description:
    "Get in touch with Clevers' Origin Schools. Contact information for all our campuses and general enquiries.",
};

const campusContacts = [
  {
    slug: "kitintale",
    name: "Kitintale Campus",
    address: "Kitintale, Along Kitintale–Kunya Road",
    phone: "+256 772 470 972",
    email: "cleversorigin@gmail.com",
    accent: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
    dot: "bg-red-500",
    button: "bg-red-500 hover:bg-red-600",
  },
  {
    slug: "kasokoso",
    name: "Kasokoso Campus",
    address: "Kasokoso, Kireka",
    phone: "+256 750 054 361",
    email: "cleversorigin@gmail.com",
    accent: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    dot: "bg-blue-500",
    button: "bg-blue-500 hover:bg-blue-600",
  },
  {
    slug: "maganjo",
    name: "Maganjo Campus",
    address: "Maganjo, Bombo Road",
    phone: "+256 753 252 716",
    email: "cleversorigin@gmail.com",
    accent: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    dot: "bg-emerald-500",
    button: "bg-emerald-500 hover:bg-emerald-600",
  },
];

const faqItems = [
  {
    question: "What are your school hours?",
    answer:
      "Regular school hours are 7:30 AM – 4:30 PM, Monday through Friday. Early drop-off from 7:00 AM and extended care until 5:30 PM may be available — contact your campus for details.",
  },
  {
    question: "How can I apply for admission?",
    answer:
      "Click Apply Now on our website to complete the online application, or visit any campus to collect a physical form.",
  },
  {
    question: "Do you provide transportation services?",
    answer:
      "Yes, we offer transportation within a 10 km radius of each campus. Buses are supervised by trained staff.",
  },
  {
    question: "What is the student-to-teacher ratio?",
    answer:
      "We maintain small classes with a maximum of 15–20 students per teacher, plus a teaching assistant for additional support.",
  },
  {
    question: "Do you serve meals at school?",
    answer:
      "Yes, we provide nutritious breakfast and lunch. Special dietary requirements can be accommodated with advance notice.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50/20 to-pink-50/20">
      {/* Hero */}
      <section className="relative py-16 sm:py-20 overflow-hidden bg-gradient-to-br from-green-50 via-white to-pink-50">
        <div className="absolute top-0 left-0 w-72 h-72 bg-green-200/15 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-green-100 shadow-sm mb-6">
            <Sparkles className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700">We&apos;d love to hear from you</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-5">
            Contact{" "}
            <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 bg-clip-text text-transparent">
              Us
            </span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Questions about admissions, campus visits, or our programs? Reach out to any of our three campuses.
          </p>
        </div>
      </section>

      {/* Campus cards */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {campusContacts.map((campus) => (
              <article
                key={campus.slug}
                className={`rounded-2xl border ${campus.border} bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-center gap-2 mb-5">
                  <span className={`h-2.5 w-2.5 rounded-full ${campus.dot}`} />
                  <h2 className={`text-lg font-bold ${campus.accent}`}>{campus.name}</h2>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className={`h-4 w-4 mt-0.5 shrink-0 ${campus.accent}`} />
                    <span className="text-gray-700">{campus.address}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className={`h-4 w-4 mt-0.5 shrink-0 ${campus.accent}`} />
                    <a href={`tel:${campus.phone.replace(/\s/g, "")}`} className="text-gray-900 font-medium hover:underline">
                      {campus.phone}
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className={`h-4 w-4 mt-0.5 shrink-0 ${campus.accent}`} />
                    <a href={`mailto:${campus.email}`} className="text-gray-900 font-medium hover:underline break-all">
                      {campus.email}
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className={`h-4 w-4 mt-0.5 shrink-0 ${campus.accent}`} />
                    <div className="text-gray-700">
                      <p>Mon – Fri: 7:30 AM – 5:00 PM</p>
                      <p>Sat: 9:00 AM – 12:00 PM</p>
                    </div>
                  </div>
                </div>
                <Link href={`/campus/${campus.slug}`} className="block mt-6">
                  <Button className={`w-full rounded-lg text-white ${campus.button}`}>
                    Campus page <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 sm:py-16 bg-gray-50/80" id="contact-form">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 mb-3">Get in touch</p>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">Send Us a Message</h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                We&apos;re here to answer questions about programs, admissions, or campus facilities.
              </p>
              <div className="space-y-5">
                {[
                  {
                    icon: HelpCircle,
                    color: "text-yellow-600 bg-yellow-50",
                    title: "General Inquiries",
                    text: "Questions or feedback about our schools and programs.",
                    href: "mailto:cleversorigin@gmail.com",
                    label: "cleversorigin@gmail.com",
                  },
                  {
                    icon: Calendar,
                    color: "text-green-600 bg-green-50",
                    title: "Schedule a Visit",
                    text: "Book a tour to see our facilities and meet our staff.",
                    href: "tel:+256772470972",
                    label: "+256 772 470 972",
                  },
                  {
                    icon: MessageSquare,
                    color: "text-pink-600 bg-pink-50",
                    title: "Admission Inquiries",
                    text: "Questions about applications, enrollment, or campus tours.",
                    href: "tel:+256772470972",
                    label: "+256 772 470 972",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl shrink-0 ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-0.5">{item.text}</p>
                      <a href={item.href} className="text-sm font-medium text-green-700 hover:underline mt-1 inline-block">
                        {item.label}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-600 mb-3">Find us</p>
            <h2 className="text-3xl font-bold text-gray-900">Our Location</h2>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-gray-100">
            <div className="aspect-video relative bg-gray-100">
              <iframe
                title="Clevers' Origin Schools on Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15959.027167556984!2d32.61808495541991!3d0.3181996000000214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177db953b299249b%3A0x98e4b4346fdbbc63!2sClever's%20Origin%20Junior%20School!5e0!3m2!1sen!2sug!4v1744825288688!5m2!1sen!2sug"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 mb-3">FAQ</p>
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <ContactFAQ items={faqItems} />
          <div className="text-center mt-10">
            <p className="text-gray-600 mb-4 text-sm">Don&apos;t see your question?</p>
            <a href="#contact-form">
              <Button className="rounded-lg bg-green-600 hover:bg-green-700 text-white gap-2">
                Ask a question <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-pink-100/60 via-yellow-50 to-green-100/60">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Join Our Family?</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Take the first step towards a joyful and nurturing educational experience for your child.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/apply">
              <Button size="lg" className="rounded-lg bg-pink-500 hover:bg-pink-600 text-white shadow-md gap-2">
                Apply Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/campus">
              <Button size="lg" variant="outline" className="rounded-lg border-gray-200 gap-2">
                Explore Campuses <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
