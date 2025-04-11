import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Award, BookOpen, GraduationCap, Users, Clock, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Academics | Clevers' Origin Schools",
  description: "Learn about our curriculum, teaching philosophy, and academic programs at Clevers' Origin Schools.",
};

export default function AcademicsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Academic Excellence</h1>
            <p className="text-lg text-gray-600 mb-8">
              At Clevers' Origin Schools, we believe in providing a comprehensive education that prepares students for success in a rapidly changing world.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/academics/curriculum">
                <Button variant="default" className="gap-2">
                  Explore Curriculum <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/academics/calendar">
                <Button variant="outline" className="gap-2">
                  Academic Calendar <Calendar className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Educational Approach</h2>
              <p className="text-gray-600 mb-6">
                Clevers' Origin Schools follows a student-centered approach to education,
                combining traditional teaching methods with innovative approaches that
                foster critical thinking, creativity, and a love for learning.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <BookOpen className="h-6 w-6 text-school-red mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg">Comprehensive Curriculum</h3>
                    <p className="text-gray-600">
                      Our curriculum is designed to develop both academic and life skills, ensuring students are well-prepared for future challenges.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-6 w-6 text-school-blue mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg">Small Class Sizes</h3>
                    <p className="text-gray-600">
                      We maintain small class sizes to ensure personalized attention and support for each student's unique learning journey.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <GraduationCap className="h-6 w-6 text-school-green mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg">Qualified Educators</h3>
                    <p className="text-gray-600">
                      Our dedicated teachers are subject matter experts who are passionate about nurturing young minds and inspiring excellence.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              {/* Placeholder for educational approach image */}
              <div className="absolute inset-0 bg-gradient-to-r from-school-blue/10 to-school-green/10" />
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xl font-medium">
                Educational Approach Image Placeholder
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Curriculum Overview</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our curriculum follows the Uganda National Curriculum framework while incorporating international best practices to provide a globally competitive education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle>Lower Primary (P1-P3)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Foundational literacy and numeracy</li>
                  <li>• Introduction to science and social studies</li>
                  <li>• Creative arts and physical education</li>
                  <li>• Value education and life skills</li>
                  <li>• Basic technology exposure</li>
                </ul>
                <Link href="/academics/curriculum/primary" className="text-blue-600 flex items-center gap-1 mt-4 text-sm font-medium hover:underline">
                  Learn more <ChevronRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Upper Primary (P4-P7)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Advanced mathematics and science</li>
                  <li>• English language and literature</li>
                  <li>• Social studies and cultural education</li>
                  <li>• Information and communications technology</li>
                  <li>• Preparation for Primary Leaving Examinations</li>
                </ul>
                <Link href="/academics/curriculum/primary" className="text-blue-600 flex items-center gap-1 mt-4 text-sm font-medium hover:underline">
                  Learn more <ChevronRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Secondary (S1-S6)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Comprehensive O-Level curriculum</li>
                  <li>• Specialized A-Level streams</li>
                  <li>• Computer science and technology</li>
                  <li>• Career guidance and mentorship</li>
                  <li>• Leadership and entrepreneurship education</li>
                </ul>
                <Link href="/academics/curriculum/secondary" className="text-blue-600 flex items-center gap-1 mt-4 text-sm font-medium hover:underline">
                  Learn more <ChevronRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Academic Excellence */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Academic Excellence</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our commitment to academic excellence is reflected in our students' achievements in national examinations, competitions, and their progression to prestigious institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600">95%</h3>
              <p className="text-gray-600">PLE Pass Rate</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600">92%</h3>
              <p className="text-gray-600">UCE Pass Rate</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600">86%</h3>
              <p className="text-gray-600">University Placement</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-amber-600">50+</h3>
              <p className="text-gray-600">Academic Awards</p>
            </div>
          </div>
        </div>
      </section>

      {/* School Day */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              {/* Placeholder for school day image */}
              <div className="absolute inset-0 bg-gradient-to-r from-school-red/10 to-school-blue/10" />
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xl font-medium">
                School Day Image Placeholder
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-6">A Day at Clevers' Origin Schools</h2>
              <p className="text-gray-600 mb-6">
                Our school day is structured to balance academic learning with co-curricular activities,
                providing students with a well-rounded educational experience.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 border-l-4 border-school-red pl-4">
                  <Clock className="h-6 w-6 text-school-red" />
                  <div>
                    <h3 className="font-semibold">7:30 AM - 8:00 AM</h3>
                    <p className="text-gray-600">Arrival and Morning Assembly</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-l-4 border-school-blue pl-4">
                  <Clock className="h-6 w-6 text-school-blue" />
                  <div>
                    <h3 className="font-semibold">8:00 AM - 10:30 AM</h3>
                    <p className="text-gray-600">Morning Learning Block</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-l-4 border-school-green pl-4">
                  <Clock className="h-6 w-6 text-school-green" />
                  <div>
                    <h3 className="font-semibold">10:30 AM - 11:00 AM</h3>
                    <p className="text-gray-600">Break Time</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-l-4 border-amber-500 pl-4">
                  <Clock className="h-6 w-6 text-amber-500" />
                  <div>
                    <h3 className="font-semibold">11:00 AM - 1:00 PM</h3>
                    <p className="text-gray-600">Mid-day Learning Block</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-l-4 border-purple-500 pl-4">
                  <Clock className="h-6 w-6 text-purple-500" />
                  <div>
                    <h3 className="font-semibold">1:00 PM - 2:00 PM</h3>
                    <p className="text-gray-600">Lunch and Recreation</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-l-4 border-teal-500 pl-4">
                  <Clock className="h-6 w-6 text-teal-500" />
                  <div>
                    <h3 className="font-semibold">2:00 PM - 4:30 PM</h3>
                    <p className="text-gray-600">Afternoon Learning and Co-curricular Activities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-school-red/10 via-school-blue/10 to-school-green/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join Our Academic Journey?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Discover how Clevers' Origin Schools can provide your child with a supportive and challenging educational environment.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/apply">
              <Button size="lg" className="gap-2">
                Apply Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="gap-2">
                Contact Us <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
