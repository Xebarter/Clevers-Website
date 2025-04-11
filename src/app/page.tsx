"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Music, Medal, Book, ChevronRight } from "lucide-react";
import AnnouncementBoard from "@/components/home/AnnouncementBoard";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import CampusShowcase from "@/components/home/CampusShowcase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const images = [
    "/image1.jpg",
    "/image2.jpg",
    "/image3.jpg",
    "/image4.jpg",
    "/image5.jpg",
    "/image6.jpg",
    "/image7.jpg",
    "/image8.jpg",
    "/image9.jpg",
    "/image10.jpg",
    "/image11.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-10 sm:py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative z-10">
          <div className="w-full lg:w-1/2 space-y-4 sm:space-y-5 md:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Welcome to{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#ff5252] via-[#FFD700] to-[#66bb6a] bg-clip-text text-transparent animate-pulse">
                  Clevers' Origin Schools
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-[#ff5252] via-[#40c4ff] to-[#66bb6a] rounded-full"></span>
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-lg">
              Nurturing young minds with creativity, knowledge, and values across our three vibrant campuses in Kitintale, Kasokoso, and Maganjo.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Link href="/apply">
                <Button size="lg" className="gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base">
                  Apply Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>

          {/* Slideshow */}
          <div className="w-full lg:w-1/2 relative h-[200px] sm:h-[250px] md:h-[350px] lg:h-[400px] mt-6 lg:mt-0 rounded-lg overflow-hidden shadow-xl">
            {images.map((src, index) => (
              <Image
                key={index}
                src={src}
                alt=""
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                className={`absolute object-cover transition-opacity duration-1000 ease-in-out ${
                  index === currentImage ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-black/20 z-10 rounded-lg" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/40 z-0 pointer-events-none" />
      </section>

      {/* Announcement Board */}
      <section className="py-8 sm:py-10 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="section-title text-2xl sm:text-3xl md:text-4xl">Announcements</h2>
          <AnnouncementBoard />
        </div>
      </section>

      {/* Key Features */}
      <section className="py-10 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="section-title mb-8 sm:mb-10 md:mb-12 text-2xl sm:text-3xl md:text-4xl">Why Choose Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <Card className="school-card h-full">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-school-red/10 flex items-center justify-center mb-3 sm:mb-4">
                  <Music className="h-5 w-5 sm:h-6 sm:w-6 text-school-red" />
                </div>
                <CardTitle className="text-lg sm:text-xl md:text-2xl">Music, Dance & Drama</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base">
                  Our award-winning MDD program nurtures artistic talents and builds confidence through regular performances and competitions.
                </CardDescription>
                <Link href="/student-life/arts" className="flex items-center text-school-red mt-3 sm:mt-4 text-sm font-medium hover:underline">
                  Learn More <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="school-card h-full">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-school-blue/10 flex items-center justify-center mb-3 sm:mb-4">
                  <Medal className="h-5 w-5 sm:h-6 sm:w-6 text-school-blue" />
                </div>
                <CardTitle className="text-lg sm:text-xl md:text-2xl">Extracurricular Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base">
                  From sports to robotics, we offer diverse extracurricular programs to develop well-rounded students with varied interests.
                </CardDescription>
                <Link href="/student-life/activities" className="flex items-center text-school-blue mt-3 sm:mt-4 text-sm font-medium hover:underline">
                  Learn More <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="school-card h-full sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-school-green/10 flex items-center justify-center mb-3 sm:mb-4">
                  <Book className="h-5 w-5 sm:h-6 sm:w-6 text-school-green" />
                </div>
                <CardTitle className="text-lg sm:text-xl md:text-2xl">Academic Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base">
                  Our rigorous academic program is designed to challenge students and prepare them for success in higher education and beyond.
                </CardDescription>
                <Link href="/academics/curriculum" className="flex items-center text-school-green mt-3 sm:mt-4 text-sm font-medium hover:underline">
                  Learn More <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-10 sm:py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="section-title mb-8 sm:mb-10 md:mb-12 text-2xl sm:text-3xl md:text-4xl">Upcoming Events</h2>
          <UpcomingEvents />
          <div className="text-center mt-6 sm:mt-8">
            <Link href="/academics/calendar">
              <Button variant="outline" className="gap-2 text-sm sm:text-base">
                View Full Calendar <Calendar className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Campus Showcase */}
      <section className="py-10 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="section-title mb-8 sm:mb-10 md:mb-12 text-2xl sm:text-3xl md:text-4xl">Our Campuses</h2>
          <CampusShowcase />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-10 sm:py-12 md:py-16 bg-gradient-to-r from-school-red/10 via-school-blue/10 to-school-green/10">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Ready to Join Our School Community?</h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-lg sm:max-w-xl md:max-w-2xl mx-auto mb-6 sm:mb-8">
            Take the first step towards a bright future for your child. Apply now to secure a place at one of our three vibrant campuses.
          </p>
          <Link href="/apply">
            <Button size="lg" className="gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base">
              Start Your Application <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}