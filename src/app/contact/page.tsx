import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Calendar, ArrowRight, HelpCircle, School, MessageSquare } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Clevers' Origin Schools",
  description: "Get in touch with Clevers' Origin Schools. Contact information for all our campuses, and general questions.",
};

// Contact information for each campus
const campusContacts = [
  {
    name: "Kitintale Campus",
    address: "Plot 45, Kitintale Road, Kampala, Uganda",
    phone: "+256 772 470 972",
    email: "cleversorigin@gmail.com",
    color: "kinder-blue"
  },
  {
    name: "Kasokoso Campus",
    address: "Kasokoso, Kireka",
    phone: "+256 750 054 361",
    email: "cleversorigin@gmail.com",
    color: "kinder-red"
  },
  {
    name: "Maganjo Campus",
    address: "Plot 13, Maganjo Road, Kampala, Uganda",
    phone: "+256 753 252 716",
    email: "cleversorigin@gmail.com",
    color: "kinder-green"
  }
];

// FAQ items
const faqItems = [
  {
    question: "What are your school hours?",
    answer: "Our regular school hours are from 7:30am to 4:30pm, Monday through Friday. We also offer an early drop-off option from 7:00am and extended care until 5:30pm for parents who need additional flexibility."
  },
  {
    question: "How can I apply for admission?",
    answer: "You can start the application process by clicking the 'Apply Now' button on our website. This will guide you through our simple online application form. Alternatively, you can visit any campus to pick up a physical application form."
  },
  {
    question: "Do you provide transportation services?",
    answer: "Yes, we offer transportation services for students living within a 10km radius of each campus. Our buses are equipped with safety features and supervised by trained staff members to ensure a secure journey."
  },
  {
    question: "What is the student-to-teacher ratio?",
    answer: "We maintain small class sizes with a maximum ratio of 15-20 students per teacher, depending on the campus. Each class also has a teaching assistant to provide additional support and individual attention."
  },
  {
    question: "Do you serve meals at school?",
    answer: "Yes, we provide nutritious breakfast and lunch for all students. Our menu is carefully planned by a nutritionist and includes locally-sourced ingredients. We can accommodate special dietary requirements with advance notice."
  }
];

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-kinder-purple/20 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-heading heading-gradient">
              Contact Us
            </h1>
            <p className="text-lg text-gray-700 mb-8 font-body">
              We'd love to hear from you! Reach out with questions about admissions, campus visits, or any other inquiries
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {campusContacts.map((campus, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-3xl shadow-md border-2 border-${campus.color}/30`}
              >
                <div className={`w-14 h-14 rounded-full bg-${campus.color}/10 flex items-center justify-center mb-4`}>
                  <School className={`h-7 w-7 text-${campus.color}`} />
                </div>
                <h2 className={`text-2xl font-bold mb-4 font-heading text-${campus.color}`}>
                  {campus.name}
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 text-${campus.color}`}>
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 font-heading">Address</h3>
                      <p className="text-gray-600 font-body">{campus.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`mt-1 text-${campus.color}`}>
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 font-heading">Phone</h3>
                      <a 
                        href={`tel:${campus.phone.replace(/\s/g, '')}`} 
                        className="text-gray-600 font-body text-blue-600 hover:underline"
                      >
                        {campus.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`mt-1 text-${campus.color}`}>
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 font-heading">Email</h3>
                      <a 
                        href={`mailto:${campus.email}`} 
                        className="text-gray-600 font-body text-blue-600 hover:underline"
                      >
                        {campus.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`mt-1 text-${campus.color}`}>
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 font-heading">Office Hours</h3>
                      <p className="text-gray-600 font-body">Monday to Friday: 7:30am - 5:00pm</p>
                      <p className="text-gray-600 font-body">Saturday: 9:00am - 12:00pm</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link href={`/campus/${campus.name.toLowerCase().replace(' campus', '')}`}>
                    <Button className={`w-full gap-2 bg-${campus.color} border-b-4 border-${campus.color === 'kinder-red' ? 'red' : campus.color === 'kinder-blue' ? 'blue' : 'green'}-600 hover:bg-${campus.color}/90 kinder-button`}>
                      Visit Campus Page
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-3xl font-bold mb-6 font-heading text-kinder-blue">
                  Get in Touch
                </h2>
                <p className="text-gray-700 mb-8 font-body">
                  We're here to answer any questions you might have about our programs, admission process, or campus facilities.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-kinder-yellow/20 flex-shrink-0 flex items-center justify-center">
                      <HelpCircle className="h-5 w-5 text-kinder-yellow" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1 font-heading">General Inquiries</h3>
                      <p className="text-gray-600 font-body">
                        For general questions or feedback about our schools and programs.
                      </p>
                      <a 
                        href="mailto:cleversorigin@gmail.com" 
                        className="text-kinder-blue mt-2 font-medium font-body text-blue-600 hover:underline"
                      >
                        cleversorigin@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-kinder-green/20 flex-shrink-0 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-kinder-green" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1 font-heading">Schedule a Visit</h3>
                      <p className="text-gray-600 font-body">
                        We'd love to show you around! Schedule a visit to see our facilities and meet our staff.
                      </p>
                      <a 
                        href="tel:+256772470972" 
                        className="text-kinder-green mt-2 font-medium font-body text-blue-600 hover:underline"
                      >
                        +256772470972
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-kinder-red/20 flex-shrink-0 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-kinder-red" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1 font-heading">Admission Inquiries</h3>
                      <p className="text-gray-600 font-body">
                        Contact our admission team for questions about application, enrollment, or campus tours.
                      </p>
                      <a 
                        href="tel:+256772470972" 
                        className="text-kinder-red mt-2 font-medium font-body text-blue-600 hover:underline"
                      >
                        +256772470972
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center font-heading text-kinder-blue">
            Find Our Campuses
          </h2>

          <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-kinder-blue/20">
            <div className="aspect-video relative rounded-2xl overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15959.027167556984!2d32.61808495541991!3d0.3181996000000214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177db953b299249b%3A0x98e4b4346fdbbc63!2sClever's%20Origin%20Junior%20School!5e0!3m2!1sen!2sug!4v1744825288688!5m2!1sen!2sug" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-kinder-purple/10 to-kinder-blue/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center font-heading text-kinder-blue">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-3xl shadow-md border-2 border-kinder-yellow/20"
              >
                <h3 className="text-xl font-bold mb-3 font-heading text-kinder-purple">
                  {item.question}
                </h3>
                <p className="text-gray-700 font-body">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-gray-700 mb-4 font-body">
              Don't see your question here? Reach out to us directly!
            </p>
            <Link href="#contact-form">
              <Button className="gap-2 kinder-button">
                Ask a Question
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-16 bg-kinder-yellow/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-heading text-kinder-blue">
            Ready to Join Our Family?
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8 font-body">
            Take the first step towards providing your child with a joyful and nurturing educational experience.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/apply">
              <Button className="gap-2 bg-kinder-blue border-blue-600 hover:bg-kinder-blue/90 hover:border-blue-700 kinder-button">
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/campus">
              <Button variant="outline" className="gap-2 border-2">
                Explore Our Campuses
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}