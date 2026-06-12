"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Sparkles, GraduationCap, MapPin, Medal } from "lucide-react";
import AnnouncementBoard from "@/components/home/AnnouncementBoard";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import CampusShowcase from "@/components/home/CampusShowcase";
import HallOfFameSection from "@/components/home/HallOfFame";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import { galleryService, GalleryImage } from "../../lib/supabase/services";

export default function Home() {
  const [images, setImages] = useState<GalleryImage[]>([]); // Changed to GalleryImage[] to include metadata
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);

  const showHeroSpinner = loading || (images.length > 0 && !firstImageLoaded);

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const allImages = await galleryService.getAll();
        // Filter images that belong to the "Other/General" category
        const otherImages = allImages.filter(img => img.category === 'other');
        setImages(otherImages);
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
    setFirstImageLoaded(false);
  }, [images]);

  useEffect(() => {
    if (images.length <= 1) return; // Don't auto-rotate if there are no images or only one
    
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images]);

  // Preload images by creating image objects - optimized for faster loading
  useEffect(() => {
    if (images.length > 0) {
      // Preload the first image immediately since it's priority
      if (images[0]) {
        const preloadFirstImage = new window.Image();
        preloadFirstImage.src = images[0].file_url;
      }
      
      // Preload next few images that will be displayed
      const preloadCount = Math.min(3, images.length); // Preload first 3 images
      for (let i = 1; i < preloadCount; i++) {
        if (images[i]) {
          const preloadImage = new window.Image();
          preloadImage.src = images[i].file_url;
        }
      }
    }
  }, [images]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-tl from-yellow-50 via-pink-50 to-blue-50 text-gray-800">
      
      {/* Hero Section */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-yellow-50/90 to-green-50" />
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-pink-300/25 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full bg-yellow-300/20 blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-[360px] h-[360px] rounded-full bg-green-300/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(236 72 153 / 0.08) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-300/40 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Hero Text */}
            <div className="space-y-7 lg:space-y-8">
              <div className="hero-fade-up inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-pink-200/60 shadow-sm shadow-pink-100/50">
                <Sparkles className="w-4 h-4 text-yellow-500 shrink-0" />
                <span className="text-sm font-medium tracking-wide text-gray-700">
                  Nurturing Excellence, Empowering Futures
                </span>
              </div>

              <h1 className="hero-fade-up hero-fade-up-delay-1 text-4xl sm:text-5xl md:text-[3.4rem] lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-gray-900">
                Welcome to{" "}
                <span className="relative inline-block mt-1">
                  <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 bg-clip-text text-transparent">
                    Clevers&apos; Origin Schools
                  </span>
                  <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-pink-400 via-yellow-300 to-green-400 rounded-full opacity-80" />
                </span>
              </h1>

              <p className="hero-fade-up hero-fade-up-delay-2 text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed">
                Nurturing young minds with creativity, knowledge, and values across our three vibrant campuses in Kitintale, Kasokoso, and Maganjo.
              </p>

              <div className="hero-fade-up hero-fade-up-delay-3 flex flex-wrap gap-3">
                {[
                  { icon: MapPin, label: "3 Campuses", color: "text-pink-500 bg-pink-50 border-pink-100" },
                  { icon: GraduationCap, label: "Holistic Education", color: "text-green-600 bg-green-50 border-green-100" },
                  { icon: Medal, label: "Award-Winning MDD", color: "text-yellow-600 bg-yellow-50 border-yellow-100" },
                ].map(({ icon: Icon, label, color }) => (
                  <span
                    key={label}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium border ${color}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </span>
                ))}
              </div>

              <div className="hero-fade-up hero-fade-up-delay-4 flex flex-wrap gap-4 pt-1">
                <Link href="/apply">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-7 py-6 gap-2 shadow-lg shadow-pink-200/60 hover:shadow-pink-300/70 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Apply Now <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/campus">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-7 py-6 gap-2 border-2 border-green-300/80 text-green-700 bg-white/60 backdrop-blur-sm hover:bg-green-50 hover:border-green-400 transition-all duration-300"
                  >
                    Explore Campuses
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Slideshow */}
            <div className="relative hero-fade-up hero-fade-up-delay-2">
              <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-br from-pink-400/25 via-yellow-300/20 to-green-400/25 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-pink-200/30 ring-1 ring-white/80 aspect-[4/3]">
                {showHeroSpinner && (
                  <div
                    className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-pink-50/95 via-yellow-50/95 to-green-50/95 backdrop-blur-sm"
                    aria-busy="true"
                  >
                    <div className="hero-spinner" role="status" aria-label="Loading images" />
                    <p className="text-sm font-medium text-green-700/80 tracking-wide">Loading images...</p>
                  </div>
                )}
                {!loading && images.length > 0 ? (
                  <>
                    {images.map((img, index) => {
                      const blurData = img.blur_url || `data:image/svg+xml;base64,${btoa(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="30" viewBox="0 0 50 30">
                          <rect width="50" height="30" fill="#fce7f3"/>
                          <circle cx="25" cy="15" r="10" fill="#f9a8d4" opacity="0.5"/>
                        </svg>
                      `)}`;

                      const nextImageIndex = (currentImage + 1) % images.length;
                      const isPriority = index === currentImage || index === nextImageIndex;

                      return (
                        <div
                          key={img.id || index}
                          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out overflow-hidden ${index === currentImage ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                        >
                          <Image
                            src={img.file_url}
                            alt={img.alt_text || img.title || ""}
                            fill
                            priority={isPriority}
                            placeholder="blur"
                            blurDataURL={blurData}
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                            className={`object-cover ${index === currentImage ? "hero-ken-burns" : ""}`}
                            loading="eager"
                            onLoad={() => {
                              if (index === 0) setFirstImageLoaded(true);
                            }}
                            onError={() => {
                              if (index === 0) setFirstImageLoaded(true);
                            }}
                          />
                        </div>
                      );
                    })}
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/35 via-black/10 to-transparent z-20 pointer-events-none" />
                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImage(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 ${
                              index === currentImage
                                ? "w-7 bg-white shadow-sm"
                                : "w-2 bg-white/50 hover:bg-white/80"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : !loading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-50 via-yellow-50 to-green-50">
                    <p className="text-gray-500">No images available</p>
                  </div>
                ) : null}
              </div>

              {/* Floating accent card */}
              <div className="hero-float absolute -bottom-5 -left-2 sm:-left-6 hidden sm:flex bg-white/90 backdrop-blur-md rounded-2xl shadow-xl shadow-green-100/50 p-4 border border-green-100/80 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center ring-1 ring-green-200/60">
                    <GraduationCap className="text-green-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">3 Vibrant Campuses</p>
                    <p className="text-xs text-gray-500">Kitintale · Kasokoso · Maganjo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-yellow-50/90 to-transparent pointer-events-none" />
      </section>

      {/* Hall of Fame - Right below hero */}
      <HallOfFameSection />

      {/* Announcements */}
      <section className="py-20 bg-gradient-to-b from-yellow-50/70 via-white to-pink-50/30 relative overflow-hidden">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-pink-200/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-pink-600 mb-3">
              Stay Informed
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Announcements
            </h2>
            <p className="text-gray-600 mt-3 text-base sm:text-lg leading-relaxed">
              Official updates and communications from Clevers&apos; Origin Schools.
            </p>
          </div>
          <AnnouncementBoard />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-b from-white via-green-50/40 to-pink-50/20 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-green-200/15 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600 mb-3">
              What Sets Us Apart
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Why Choose Us
            </h2>
            <p className="text-gray-600 mt-3 text-base sm:text-lg leading-relaxed">
              A holistic education that develops talent, character, and academic achievement.
            </p>
          </div>
          <WhyChooseUs />
        </div>
      </section>

      {/* Campus Showcase */}
      <section className="py-20 bg-gradient-to-b from-white via-green-50/60 to-yellow-50/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-green-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-green-600 mb-3">
              Visit Us
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Our Campuses
            </h2>
            <p className="text-gray-600 mt-3 text-base sm:text-lg leading-relaxed">
              Three vibrant locations across Kampala, united by a shared commitment to nurturing every learner.
            </p>
          </div>
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