"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import CampusShowcase from "@/components/home/CampusShowcase";
import AnnouncementBoard from "@/components/home/AnnouncementBoard";
import UpcomingEvents from "@/components/home/UpcomingEvents";

// Import CMS services
import { useCms } from "./admin/cmsService";

export default function Home() {
  const { announcements, events, isLoading } = useCms();

  // Filter published and non-expired announcements
  const publishedAnnouncements = announcements.filter(announcement => {
    if (announcement.status !== 'published') return false;

    // Check if the announcement is expired
    if (announcement.expiryDate) {
      const now = new Date();
      const expiryDate = new Date(announcement.expiryDate);
      if (expiryDate < now) return false;
    }

    return true;
  });

  // Filter upcoming events
  const upcomingEvents = events.filter(event =>
    event.status === 'upcoming' && new Date(event.startDate) > new Date()
  ).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return (
    <main className="flex flex-col items-center">
      {/* Hero section */}
      <section className="w-full bg-gradient-to-b from-kinder-blue/10 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-heading heading-gradient">
                A Joyful Start to Learning
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 font-body">
                At Clevers' Origin, we create a nurturing environment where young minds grow through play,
                exploration, and discovery. Our kindergarten program is designed to inspire curiosity and build
                a strong foundation for lifelong learning.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/apply">
                  <Button className="gap-2 text-lg py-6 px-8 shadow-lg bg-kinder-red hover:bg-kinder-red/90 border-b-4 border-red-700 hover:translate-y-1 hover:border-b-2 hover:mb-0.5 transition-all duration-150 rounded-2xl">
                    Apply Now
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="gap-2 text-lg py-6 px-8 border-2 rounded-2xl">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] relative rounded-3xl overflow-hidden border-8 border-white shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-kinder-green/20 to-transparent"></div>
                {/* This is a placeholder for the hero image - replace with actual image */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="text-8xl mb-2">👨‍👩‍👧‍👦</div>
                    <p className="text-gray-600 font-heading text-xl">Happy Learning Environment</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-36 h-36 rounded-full bg-kinder-yellow flex items-center justify-center shadow-lg border-4 border-white">
                <div className="text-3xl">🌟</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements section */}
      <section className="w-full py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold font-heading text-kinder-blue">Announcements</h2>
            <Link href="/announcements">
              <Button variant="ghost" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kinder-blue mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading announcements...</p>
            </div>
          ) : (
            <AnnouncementBoard announcements={publishedAnnouncements} />
          )}
        </div>
      </section>

      {/* Campus Showcase */}
      <section className="w-full py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-kinder-blue mb-8">Our Campuses</h2>
          <CampusShowcase />
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="w-full py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold font-heading text-kinder-blue">Upcoming Events</h2>
            <Link href="/events">
              <Button variant="ghost" className="gap-2">
                View Calendar
                <Calendar className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kinder-blue mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : (
            <UpcomingEvents events={upcomingEvents} />
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-r from-kinder-blue/20 to-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading text-kinder-blue">
            Join Our Kindergarten Family
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8 font-body">
            We'd love to welcome your child to our nurturing community where they'll learn, grow, and thrive with us.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/apply">
              <Button className="gap-2 text-lg py-6 px-8 shadow-lg bg-kinder-green hover:bg-kinder-green/90 border-b-4 border-green-700 hover:translate-y-1 hover:border-b-2 hover:mb-0.5 transition-all duration-150 rounded-2xl">
                Apply for Admission
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="gap-2 text-lg py-6 px-8 border-2 rounded-2xl">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
