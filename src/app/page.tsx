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
import { galleryService, GalleryImage } from "../../lib/supabase/services";

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const allImages = await galleryService.getAll();
        // Filter images that belong to the "Other/General" category
        const otherImages = allImages.filter(img => img.category === 'other');
        // Extract URLs from the filtered images
        const imageUrls = otherImages.map(img => img.file_url);
        setImages(imageUrls.length > 0 ? imageUrls : []);
      } catch (error) {
        console.error('Error fetching hero images:', error);
        // If there's an error, we'll still use an empty array
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  useEffect(() => {
    if (images.length <= 1) return; // Don't auto-rotate if there are no images or only one
    
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-tl from-yellow-50 via-pink-50 to-blue-50 text-gray-800">
      
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 md:py-24 bg-gradient-to-br from-pink-100 via-yellow-100 to-green-100 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">
          
          {/* Hero Text */}
          <div className="w-full lg:w-1/2 space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
              Welcome to{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 bg-clip-text text-transparent animate-pulse">
                  Clevers' Origin Schools
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-yellow-300 to-green-400 rounded-full"></span>
              </span>
            </h1>
            <p className="text-lg text-gray-700 max-w-xl">
              Nurturing young minds with creativity, knowledge, and values across our three vibrant campuses in Kitintale, Kasokoso, and Maganjo.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/apply">
                <Button size="lg" className="bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 text-white hover:from-pink-600 hover:via-yellow-500 hover:to-green-600 px-6 py-3 gap-2">
                  Apply Now <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Slideshow */}
          <div className="w-full lg:w-1/2 relative h-[250px] sm:h-[350px] lg:h-[400px] mt-6 lg:mt-0 rounded-xl overflow-hidden shadow-2xl">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <p className="text-gray-600">Loading images...</p>
              </div>
            ) : images.length > 0 ? (
              images.map((src, index) => (
                <Image
                  key={index}
                  src={src}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  className={`absolute object-cover transition-opacity duration-1000 ease-in-out ${index === currentImage ? "opacity-100" : "opacity-0"}`}
                />
              ))
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <p className="text-gray-600">No images available</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 z-10 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-12 bg-yellow-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-pink-600 mb-6">Announcements</h2>
          <AnnouncementBoard />
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-gradient-to-br from-green-50 via-white to-pink-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-yellow-600 mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* MDD */}
            <Card className="bg-white hover:shadow-lg transition">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <Music className="text-pink-500 w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Music, Dance & Drama</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our award-winning MDD program nurtures artistic talents and builds confidence through performances and competitions.
                </CardDescription>
                <Link href="/student-life/arts" className="flex items-center text-pink-500 mt-4 font-medium hover:underline">
                  Learn More <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Activities */}
            <Card className="bg-white hover:shadow-lg transition">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Medal className="text-blue-500 w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Extracurricular Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  From football to swimming, we offer diverse programs to develop well-rounded students.
                </CardDescription>
                <Link href="/student-life/activities" className="flex items-center text-blue-500 mt-4 font-medium hover:underline">
                  Learn More <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Academics */}
            <Card className="bg-white hover:shadow-lg transition">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Book className="text-green-500 w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Academic Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  A rigorous academic program designed to prepare students for lifelong success.
                </CardDescription>
                <Link href="/academics/curriculum" className="flex items-center text-green-600 mt-4 font-medium hover:underline">
                  Learn More <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Campus Showcase */}
      <section className="py-16 bg-gradient-to-t from-white via-green-50 to-yellow-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-10">Our Campuses</h2>
          <CampusShowcase />
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-10">Upcoming Events</h2>
          <UpcomingEvents />
          <div className="text-center mt-8">
            <Link href="/academics/calendar">
              <Button variant="outline" className="text-blue-600 border-blue-400 hover:bg-blue-100">
                View Full Calendar <Calendar className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-pink-200 via-yellow-200 to-green-200 text-center">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our School Community?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Take the first step towards a bright future. Apply now to secure your child’s spot at one of our vibrant campuses.
          </p>
          <Link href="/apply">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white gap-2 px-6 py-3">
              Start Your Application <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}