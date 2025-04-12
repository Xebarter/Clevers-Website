// src/app/academics/AcademicsContent.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Award,
  BookOpen,
  GraduationCap,
  Users,
  Clock,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

const educationalApproachImages = [
  "/hol1.jpg",
  "/hol2.jpg",
  "/hol3.jpg",
  "/hol4.jpg",
];

const schoolDayImages = [
  "/day1.jpg",
  "/day2.jpg",
  "/day3.jpg",
  "/day4.jpg",
];

export default function AcademicsContent() {
  const [educationalImageIndex, setEducationalImageIndex] = useState<number>(0);
  const [schoolDayImageIndex, setSchoolDayImageIndex] = useState<number>(0);

  // Animation for Educational Approach Images
  useEffect(() => {
    const interval = setInterval(() => {
      setEducationalImageIndex((prev) => (prev + 1) % educationalApproachImages.length);
    }, 3000); // Change every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Animation for School Day Images
  useEffect(() => {
    const interval = setInterval(() => {
      setSchoolDayImageIndex((prev) => (prev + 1) % schoolDayImages.length);
    }, 3000); // Change every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Academic Excellence
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              At Clevers' Origin Schools, we nurture curiosity, creativity, and
              foundational knowledge that supports lifelong learning for every
              child.
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
              <h2 className="text-3xl font-bold mb-6">
                Our Educational Approach
              </h2>
              <p className="text-gray-600 mb-6">
                Clevers' Origin Schools follows a student-centered approach to
                early childhood and primary education, blending play, discovery,
                and structured learning in a warm and stimulating environment.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <BookOpen className="h-6 w-6 text-school-red mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg">
                      Holistic Curriculum
                    </h3>
                    <p className="text-gray-600">
                      Our lessons integrate academics, play, social skills, and
                      creativity to ensure children grow intellectually and
                      emotionally.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-6 w-6 text-school-blue mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg">Nurturing Classrooms</h3>
                    <p className="text-gray-600">
                      Small class sizes help teachers connect with each child
                      and personalize their early learning journey.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <GraduationCap className="h-6 w-6 text-school-green mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg">Caring Educators</h3>
                    <p className="text-gray-600">
                      Our teachers are not just qualified — they’re passionate
                      about making every child feel safe, valued, and eager to
                      learn.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={educationalImageIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={educationalApproachImages[educationalImageIndex]}
                    alt={`Educational Approach at Clevers' Origin Schools - Image ${educationalImageIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={educationalImageIndex === 0}
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-r from-school-blue/10 to-school-green/10" />
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
              Our curriculum follows the Uganda National Curriculum framework
              while incorporating international best practices to provide a
              globally competitive education.
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
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Nursery (Baby - Top class)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Play-based learning activities</li>
                  <li>• Early literacy and numeracy skills</li>
                  <li>• Creative arts and music</li>
                  <li>• Social and emotional development</li>
                  <li>• Gross and fine motor skills development</li>
                </ul>
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
              We celebrate academic growth through consistent progress,
              confidence building, and exciting learning milestones that set a
              strong foundation for future education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600">100%</h3>
              <p className="text-gray-600">Literacy & Numeracy Readiness</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600">Top 10</h3>
              <p className="text-gray-600">Regional Exam Rankings</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600">75+</h3>
              <p className="text-gray-600">Student Recognitions & Awards</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-amber-600">Inspiring</h3>
              <p className="text-gray-600">Love for Learning</p>
            </div>
          </div>
        </div>
      </section>

      {/* School Day */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={schoolDayImageIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={schoolDayImages[schoolDayImageIndex]}
                    alt={`A Day at Clevers' Origin Schools - Image ${schoolDayImageIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={schoolDayImageIndex === 0}
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-r from-school-red/10 to-school-blue/10" />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-6">
                A Day at Clevers' Origin Schools
              </h2>
              <p className="text-gray-600 mb-6">
                Our school day combines structure, play, and discovery, offering
                students a fun and purposeful learning experience from start to
                finish.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 border-l-4 border-school-red pl-4">
                  <Clock className="h-6 w-6 text-school-red" />
                  <div>
                    <h3 className="font-semibold">7:30 AM - 8:00 AM</h3>
                    <p className="text-gray-600">Arrival and Morning Circle</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-l-4 border-school-blue pl-4">
                  <Clock className="h-6 w-6 text-school-blue" />
                  <div>
                    <h3 className="font-semibold">8:00 AM - 10:00 AM</h3>
                    <p className="text-gray-600">Guided Learning & Activities</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-l-4 border-school-green pl-4">
                  <Clock className="h-6 w-6 text-school-green" />
                  <div>
                    <h3 className="font-semibold">10:00 AM - 10:30 AM</h3>
                    <p className="text-gray-600">Snack & Outdoor Play</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-l-4 border-amber-500 pl-4">
                  <Clock className="h-6 w-6 text-amber-500" />
                  <div>
                    <h3 className="font-semibold">10:30 AM - 12:30 PM</h3>
                    <p className="text-gray-600">Creative & Literacy Sessions</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-l-4 border-purple-500 pl-4">
                  <Clock className="h-6 w-6 text-purple-500" />
                  <div>
                    <h3 className="font-semibold">12:30 PM - 1:30 PM</h3>
                    <p className="text-gray-600">Lunch and Quiet Time</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-l-4 border-teal-500 pl-4">
                  <Clock className="h-6 w-6 text-teal-500" />
                  <div>
                    <h3 className="font-semibold">1:30 PM - 3:30 PM</h3>
                    <p className="text-gray-600">Afternoon Play & Wrap-up</p>
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
          <h2 className="text-3xl font-bold mb-6">
            Ready to Join Our Academic Journey?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Discover how Clevers' Origin Schools can provide your child with a
            supportive and exciting educational environment.
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