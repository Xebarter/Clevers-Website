"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Book, Star, Users, Calendar, ArrowRight } from "lucide-react";

const imageList = ["/COJS1.jpg", "/kitintale2.jpg", "/COJS2.jpg", "/maganjo3.jpg"];

export default function AboutPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

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

      {/* Story Timeline */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-6 text-kinder-blue font-heading">Our Humble Beginnings</h2>
              <p className="text-gray-700 mb-4 font-body">
                Clevers' Origin Schools began as a small kindergarten in Kitintale, Kampala in <span className="font-semibold text-kinder-blue drop-shadow-sm">2005</span>. Founded by a visionary educator, Mrs. Sarah Nantongo, who believed that early childhood education should be both joyful and rigorous.
              </p>
              <p className="text-gray-700 mb-4 font-body">
                Starting with just one classroom and 15 students, our school was built on the principle that every child deserves a colorful, engaging, and supportive learning environment.
              </p>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-kinder-blue text-white font-bold font-heading shadow-md">
                  <span className="drop-shadow-sm">2005</span>
                </div>
                <div className="h-1 w-12 bg-gradient-to-r from-kinder-blue to-kinder-green"></div>
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-kinder-green text-white font-bold font-heading shadow-md">
                  <span className="drop-shadow-sm">2010</span>
                </div>
                <div className="h-1 w-12 bg-gradient-to-r from-kinder-green to-kinder-red"></div>
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-kinder-red text-white font-bold font-heading shadow-md">
                  <span className="drop-shadow-sm">2017</span>
                </div>
                <div className="h-1 w-12 bg-gradient-to-r from-kinder-red to-kinder-purple"></div>
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-kinder-purple text-white font-bold font-heading shadow-md">
                  <span className="drop-shadow-sm">2023</span>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 bg-kinder-pink/10 p-6 rounded-3xl border-2 border-kinder-pink/30 shadow-md">
              <div className="aspect-video relative rounded-2xl overflow-hidden border-4 border-white shadow-md bg-kinder-blue/20">
                {/* Animated Image */}
                <Image
                  key={imageList[currentImageIndex]} // Force re-render on image change
                  src={imageList[currentImageIndex]}
                  alt={`Clevers' Origin Schools - Image ${currentImageIndex + 1}`}
                  layout="fill"
                  objectFit="cover"
                  style={{ transition: 'opacity 0.5s ease-in-out' }} // Add a fade transition
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Growth Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-kinder-green/10 to-kinder-blue/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center text-kinder-blue font-heading">Our Growth Journey</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="school-card">
              <CardContent className="pt-6">
                <div className="mb-4 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-kinder-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center font-heading text-kinder-blue"><span className="drop-shadow-sm shadow-md rounded-full px-2 py-0.5 bg-white/20">2010</span></h3>
                <p className="text-gray-700 font-body">
                  We expanded to our second campus in Kasokoso to serve more communities. By this time, we had grown to 150 students across both locations.
                </p>
              </CardContent>
            </Card>

            <Card className="school-card">
              <CardContent className="pt-6">
                <div className="mb-4 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-kinder-red" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center font-heading text-kinder-red"><span className="drop-shadow-sm shadow-md rounded-full px-2 py-0.5 bg-white/20">2017</span></h3>
                <p className="text-gray-700 font-body">
                  Our third campus in Maganjo opened its doors, featuring modern facilities including a library, computer lab, and sports field.
                </p>
              </CardContent>
            </Card>

            <Card className="school-card">
              <CardContent className="pt-6">
                <div className="mb-4 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-kinder-purple" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center font-heading text-kinder-purple"><span className="drop-shadow-sm shadow-md rounded-full px-2 py-0.5 bg-white/20">2023</span></h3>
                <p className="text-gray-700 font-body">
                  Today, Clevers' Origin Schools serves over 500 students across our three campuses, with a staff of 75 dedicated educators and support personnel.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center text-kinder-blue font-heading">Our Core Values</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-kinder-red/30">
              <div className="w-14 h-14 rounded-full bg-kinder-red/10 flex items-center justify-center mb-4 mx-auto">
                <Heart className="h-7 w-7 text-kinder-red" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center font-heading text-kinder-red">Compassion</h3>
              <p className="text-gray-700 text-center font-body">
                We nurture empathy and kindness in our students, teaching them to care for others and their community.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-kinder-blue/30">
              <div className="w-14 h-14 rounded-full bg-kinder-blue/10 flex items-center justify-center mb-4 mx-auto">
                <Book className="h-7 w-7 text-kinder-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center font-heading text-kinder-blue">Learning</h3>
              <p className="text-gray-700 text-center font-body">
                We foster a love for knowledge and curiosity, making learning a joyful and engaging experience.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-kinder-green/30">
              <div className="w-14 h-14 rounded-full bg-kinder-green/10 flex items-center justify-center mb-4 mx-auto">
                <Star className="h-7 w-7 text-kinder-green" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center font-heading text-kinder-green">Excellence</h3>
              <p className="text-gray-700 text-center font-body">
                We strive for the highest standards in education while celebrating each child's unique journey.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-kinder-purple/30">
              <div className="w-14 h-14 rounded-full bg-kinder-purple/10 flex items-center justify-center mb-4 mx-auto">
                <Users className="h-7 w-7 text-kinder-purple" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center font-heading text-kinder-purple">Community</h3>
              <p className="text-gray-700 text-center font-body">
                We build strong relationships between teachers, students, and families to create a supportive learning environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-kinder-yellow/20 via-kinder-pink/20 to-kinder-blue/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-heading text-kinder-blue">Learn More About Us</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8 font-body">
            Discover our mission, vision, and meet the leadership team that makes Clevers' Origin Schools a special place for learning.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/about/mission">
              <Button className="gap-2 bg-kinder-green border-green-600 hover:bg-kinder-green/90 hover:border-green-700 kinder-button">
                Our Mission & Vision
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about/leadership">
              <Button variant="outline" className="gap-2 border-2">
                Meet Our Leadership
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}