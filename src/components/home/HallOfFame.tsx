"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Medal, Trophy, Star, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { hallOfFameService, type HallOfFame } from "../../../lib/supabase/services";

export default function HallOfFameSection() {
  const [entries, setEntries] = useState<HallOfFame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const data = await hallOfFameService.getAll();
        setEntries(data);
      } catch (err: any) {
        console.error("Error fetching Hall of Fame entries:", err);
        setError(err.message || "Failed to load Hall of Fame entries");
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  // Auto-scroll carousel gently every 5 seconds
  useEffect(() => {
    if (entries.length <= 3 || isPaused) return; // Only auto-scroll if carousel is active and not paused

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev < entries.length - 1 ? prev + 1 : 0));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [entries.length, isPaused]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : entries.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < entries.length - 1 ? prev + 1 : 0));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || entries.length === 0) {
    return null; // Don't show section if there's an error or no entries
  }

  // Show carousel if more than 3 entries, otherwise show grid
  const shouldShowCarousel = entries.length > 3;

  return (
    <section className="py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Hall of Fame</h2>
            <Trophy className="h-8 w-8 text-yellow-500 ml-3" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Celebrating the outstanding achievements of our exceptional learners
          </p>
        </div>

        {/* Show carousel for more than 3 entries */}
        {shouldShowCarousel ? (
          <div 
            className="relative max-w-6xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Carousel Container */}
            <div className="overflow-hidden" ref={carouselRef}>
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {entries.map((entry) => (
                  <div key={entry.id} className="w-full flex-shrink-0 px-2 sm:px-4 lg:px-6">
                    <LargeCard entry={entry} />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
            </button>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-6 sm:mt-8">
              {entries.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`transition-all ${
                    index === currentIndex
                      ? "w-8 h-3 bg-yellow-500"
                      : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                  } rounded-full`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Show grid for 3 or fewer entries */
          <div className="max-w-6xl mx-auto">
            {entries.length === 1 ? (
              /* Single entry - full width centered */
              <div className="max-w-4xl mx-auto">
                <LargeCard entry={entries[0]} />
              </div>
            ) : (
              /* 2-3 entries - responsive grid */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {entries.map((entry) => (
                  <LargeCard key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// Large Card Component - Wide layout that fills screen appropriately
function LargeCard({ entry }: { entry: HallOfFame }) {
  const isFeatured = entry.is_featured;
  
  return (
    <div className={`group bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-1 hover:shadow-3xl w-full ${
      isFeatured ? 'border-4 border-yellow-400' : 'border-2 border-gray-200'
    }`}>
      {/* Badge - Only show if featured */}
      {isFeatured && (
        <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400 text-white px-6 py-2 flex items-center justify-center">
          <Star className="h-5 w-5 mr-2 fill-current animate-pulse" />
          <span className="font-bold text-sm sm:text-base tracking-wide">HALL OF FAME</span>
          <Star className="h-5 w-5 ml-2 fill-current animate-pulse" />
        </div>
      )}

      {/* Card Content - Horizontal Layout on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Image - Left side on desktop, top on mobile */}
        <div className="relative h-[300px] sm:h-[350px] lg:h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          <Image
            src={entry.image_url}
            alt={entry.image_alt_text || entry.learner_names}
            fill
            className="object-contain lg:object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={95}
            priority={isFeatured}
          />
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content - Right side on desktop, bottom on mobile */}
        <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-white to-yellow-50 flex flex-col justify-center">
          {/* Name with trophy icon */}
          <div className="flex items-start gap-3 mb-4">
            <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500 flex-shrink-0 mt-1" />
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">{entry.learner_names}</h3>
          </div>
          
          {/* Achievement */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 sm:p-5 rounded-r-xl mb-4 sm:mb-6">
            <p className="text-base sm:text-lg lg:text-xl text-gray-800 font-medium leading-relaxed">{entry.achievement}</p>
          </div>

          {/* Date with medal icon */}
          <div className="flex items-center gap-2 text-gray-600">
            <Medal className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            <span className="text-sm sm:text-base lg:text-lg font-semibold">
              {new Date(entry.achievement_date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

