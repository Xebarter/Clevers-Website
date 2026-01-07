"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Book, Star, Users, Calendar, ArrowRight } from "lucide-react";
import { galleryService, GalleryImage } from "../../../lib/supabase/services";

const defaultImageList = ["/COJS1.jpg", "/kitintale2.jpg", "/COJS2.jpg", "/maganjo3.jpg"];

export default function AboutPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const data = await galleryService.getAll();
        setGalleryImages(data);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        // Fallback to default images if there's an error
        setGalleryImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  // Use gallery images if available, otherwise fallback to default images
  const imagesToDisplay = galleryImages.length > 0 
    ? galleryImages 
    : defaultImageList.map(url => ({ 
        file_url: url, 
        title: "Default image", 
        alt_text: "Default image",
        id: url,
        blur_url: `data:image/svg+xml;base64,${btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="30" viewBox="0 0 50 30">
            <rect width="50" height="30" fill="#e2e8f0"/>
            <circle cx="25" cy="15" r="10" fill="#94a3b8" opacity="0.5"/>
          </svg>
        `)}`
      }));

  // Preload images - optimized for faster loading
  useEffect(() => {
    if (imagesToDisplay.length > 0) {
      const urls = Array.isArray(imagesToDisplay) 
        ? imagesToDisplay.map(img => typeof img === 'string' ? img : img.file_url) 
        : defaultImageList;
        
      // Preload the first image immediately since it's priority
      if (urls[0]) {
        const preloadFirstImage = new window.Image();
        preloadFirstImage.src = urls[0];
      }
      
      // Preload next few images that will be displayed
      const preloadCount = Math.min(3, urls.length); // Preload first 3 images
      for (let i = 1; i < preloadCount; i++) {
        if (urls[i]) {
          const preloadImage = new window.Image();
          preloadImage.src = urls[i];
        }
      }
    }
  }, [imagesToDisplay]);

  useEffect(() => {
    if (imagesToDisplay.length <= 1) return; // Don't auto-rotate if there's only one or no images
    
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesToDisplay.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [imagesToDisplay]);

  // Get the current image URL based on whether we have gallery images or default images
  const currentImageUrl = Array.isArray(imagesToDisplay) 
    ? typeof imagesToDisplay[currentImageIndex] === 'object' 
      ? imagesToDisplay[currentImageIndex].file_url 
      : imagesToDisplay[currentImageIndex] 
    : defaultImageList[currentImageIndex % defaultImageList.length];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-kinder-yellow/20 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-heading heading-gradient">
              Our Story
            </h1>
            <p className="text-lg text-gray-700 mb-8 font-body">
              A journey of nurturing young minds and building a community of joyful learners
            </p>
          </div>
        </div>
      </section>

      {/* Hero Image Section */}
      <div className="relative h-64 md:h-96 w-full overflow-hidden">
        {Array.isArray(imagesToDisplay) ? (
          imagesToDisplay.map((img, index) => {
            const blurData = typeof img === 'object' && 'blur_url' in img && img.blur_url 
              ? img.blur_url 
              : `data:image/svg+xml;base64,${btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="30" viewBox="0 0 50 30">
                  <rect width="50" height="30" fill="#e2e8f0"/>
                  <circle cx="25" cy="15" r="10" fill="#94a3b8" opacity="0.5"/>
                </svg>
              `)}`;
            
            // Determine if this image should have priority
            // Priority for current image and the next one to be shown
            const nextImageIndex = (currentImageIndex + 1) % imagesToDisplay.length;
            const isPriority = index === currentImageIndex || index === nextImageIndex;
            
            return (
              <div
                key={typeof img === 'object' ? img.id || index : index}
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image
                  src={typeof img === 'object' ? img.file_url : img}
                  alt={typeof img === 'object' ? img.alt_text || img.title : "About image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority={isPriority}
                  placeholder="blur"
                  blurDataURL={blurData}
                  loading="eager"
                />
              </div>
            );
          })
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <p className="text-gray-600">Loading images...</p>
          </div>
        )}
      </div>

      {/* ================= ORIGIN ================= */}
      <section className="py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <h2 className="text-3xl font-heading font-bold text-kinder-blue mb-6">
              Our Humble Beginnings
            </h2>

            <p className="text-gray-700 font-body mb-4 leading-relaxed">
              Clevers’ Origin Schools was founded in{" "}
              <span className="font-semibold text-kinder-blue">2005</span> in
              Kitintale, Kampala, by Mr. Mugwanya Christopher—a visionary
              educator who believed that education should be joyful,
              disciplined, and child-centered.
            </p>

            <p className="text-gray-700 font-body mb-6 leading-relaxed">
              What began with one classroom and 15 learners has grown into a
              trusted institution grounded in care, academic rigor, and strong
              community values.
            </p>

            {/* Timeline */}
            <div className="flex items-center gap-3 flex-wrap">
              {["2005", "2019", "2021", "2026"].map((year, i) => (
                <React.Fragment key={year}>
                  <div className="h-9 w-9 rounded-full bg-kinder-blue text-white flex items-center justify-center font-heading font-bold shadow-sm">
                    {year.slice(2)}
                  </div>
                  {i < 3 && (
                    <div className="h-1 w-10 bg-gradient-to-r from-kinder-blue to-kinder-green" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative rounded-3xl border border-kinder-pink/30 shadow-lg overflow-hidden aspect-video bg-gray-100">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 rounded-full border-2 border-kinder-blue border-t-transparent animate-spin" />
              </div>
            ) : (
              <Image
                src={currentImageUrl}
                alt="Clevers' Origin Schools"
                fill
                className="object-cover transition-opacity duration-700"
                priority
              />
            )}
          </div>
        </div>
      </section>

      {/* ================= GROWTH ================= */}
      <section className="py-16 bg-gradient-to-r from-kinder-green/10 to-kinder-blue/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center text-kinder-blue mb-12">
            Our Growth Journey
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                year: "2005",
                color: "text-kinder-blue",
                text:
                  "Kitintale Campus was established, laying the foundation for our educational philosophy.",
              },
              {
                year: "2019",
                color: "text-kinder-red",
                text:
                  "Kasokoso Campus opened, extending our mission to a wider community.",
              },
              {
                year: "2021",
                color: "text-kinder-purple",
                text:
                  "Maganjo Campus launched with a focus on innovation and modern learning spaces.",
              },
            ].map((item) => (
              <Card
                key={item.year}
                className="border-none shadow-md bg-white"
              >
                <CardContent className="pt-6 text-center">
                  <Calendar className={`h-10 w-10 mx-auto ${item.color}`} />
                  <h3 className={`text-xl font-heading font-bold mt-4 ${item.color}`}>
                    {item.year}
                  </h3>
                  <p className="text-gray-700 font-body mt-3">
                    {item.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center text-kinder-blue mb-12">
            Our Core Values
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: "Compassion",
                color: "text-kinder-red",
                text:
                  "We nurture kindness, empathy, and respect in every child.",
              },
              {
                icon: Book,
                title: "Learning",
                color: "text-kinder-blue",
                text:
                  "We inspire curiosity and a lifelong love for knowledge.",
              },
              {
                icon: Star,
                title: "Excellence",
                color: "text-kinder-green",
                text:
                  "We pursue high standards while honoring each child’s pace.",
              },
              {
                icon: Users,
                title: "Community",
                color: "text-kinder-purple",
                text:
                  "We build strong partnerships with families and educators.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="bg-white p-6 rounded-3xl shadow-md border text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-4">
                  <v.icon className={`h-7 w-7 ${v.color}`} />
                </div>
                <h3 className={`text-xl font-heading font-bold mb-2 ${v.color}`}>
                  {v.title}
                </h3>
                <p className="text-gray-700 font-body">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-16 bg-gradient-to-r from-kinder-yellow/20 via-kinder-pink/20 to-kinder-blue/20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-heading font-bold text-kinder-blue mb-4">
            Learn More About Us
          </h2>
          <p className="text-gray-700 font-body mb-8">
            Discover our mission, vision, and leadership team shaping the future
            of Clevers’ Origin Schools.
          </p>

          <Link href="/about/mission">
            <Button className="kinder-button bg-kinder-green hover:bg-kinder-green/90">
              Our Mission & Vision
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
