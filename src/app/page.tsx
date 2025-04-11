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
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <div className="w-full lg:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Welcome to{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-[#ff5252] via-[#FFD700] to-[#66bb6a] bg-clip-text text-transparent animate-pulse">
                  Clevers' Origin Schools
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-[#ff5252] via-[#40c4ff] to-[#66bb6a] rounded-full"></span>
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-lg">
              Nurturing young minds with creativity, knowledge, and values across our three vibrant campuses in Kitintale, Kasokoso, and Maganjo.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/apply">
                <Button size="lg" className="gap-2">
                  Apply Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>

          {/* Slideshow */}
          <div className="w-full lg:w-1/2 relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl">
            {images.map((src, index) => (
              <Image
                key={index}
                src={src}
                alt=""
                fill
                priority={index === 0}
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
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Announcements</h2>
          <AnnouncementBoard />
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="school-card">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-school-red/10 flex items-center justify-center mb-4">
                  <Music className="h-6 w-6 text-school-red" />
                </div>
                <CardTitle>Music, Dance & Drama</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Our award-winning MDD program nurtures artistic talents and builds confidence through regular performances and competitions.
                </CardDescription>
                <Link href="/student-life/arts" className="flex items-center text-school-red mt-4 text-sm font-medium hover:underline">
                  Learn More <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="school-card">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-school-blue/10 flex items-center justify-center mb-4">
                  <Medal className="h-6 w-6 text-school-blue" />
                </div>
                <CardTitle>Extracurricular Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  From sports to robotics, we offer diverse extracurricular programs to develop well-rounded students with varied interests.
                </CardDescription>
                <Link href="/student-life/activities" className="flex items-center text-school-blue mt-4 text-sm font-medium hover:underline">
                  Learn More <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="school-card">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-school-green/10 flex items-center justify-center mb-4">
                  <Book className="h-6 w-6 text-school-green" />
                </div>
                <CardTitle>Academic Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Our rigorous academic program is designed to challenge students and prepare them for success in higher education and beyond.
                </CardDescription>
                <Link href="/academics/curriculum" className="flex items-center text-school-green mt-4 text-sm font-medium hover:underline">
                  Learn More <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title mb-12">Upcoming Events</h2>
          <UpcomingEvents />
          <div className="text-center mt-8">
            <Link href="/academics/calendar">
              <Button variant="outline" className="gap-2">
                View Full Calendar <Calendar className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Campus Showcase */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title mb-12">Our Campuses</h2>
          <CampusShowcase />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-school-red/10 via-school-blue/10 to-school-green/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Our School Community?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Take the first step towards a bright future for your child. Apply now to secure a place at one of our three vibrant campuses.
          </p>
          <Link href="/apply">
            <Button size="lg" className="gap-2">
              Start Your Application <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}