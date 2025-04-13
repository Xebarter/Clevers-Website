// src/app/sports/sports-client.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Trophy,
  Heart,
  Users,
  Calendar,
  ArrowRight,
  Wind,
  Shield,
  Footprints,
  Smile,
  Clock,
  Waypoints,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Sports activities data
const sportsActivities = [
  {
    name: "Mini Athletics",
    description:
      "Age-appropriate running, jumping, and throwing activities that develop fundamental movement skills in a fun, non-competitive environment.",
    icon: <Footprints className="h-6 w-6 text-kinder-blue" />,
    color: "kinder-blue",
    benefits: ["Gross motor skills", "Spatial awareness", "Self-confidence"],
  },
  {
    name: "Team Games",
    description:
      "Simplified versions of football, netball, and other team sports that emphasize cooperation, taking turns, and understanding basic rules.",
    icon: <Users className="h-6 w-6 text-kinder-green" />,
    color: "kinder-green",
    benefits: ["Teamwork", "Social skills", "Following instructions"],
  },
  {
    name: "Balance & Coordination",
    description:
      "Fun activities using balance beams, hoops, and obstacle courses to develop coordination, stability, and body control.",
    icon: <Wind className="h-6 w-6 text-kinder-red" />,
    color: "kinder-red",
    benefits: ["Balance skills", "Core strength", "Spatial awareness"],
  },
  {
    name: "Swimming Basics",
    description:
      "Introduction to water safety and beginner swimming skills in our partner facility's shallow pool, supervised by trained instructors.",
    icon: <Waypoints className="h-6 w-6 text-kinder-blue" />,
    color: "kinder-blue",
    benefits: ["Water confidence", "Basic swimming skills", "Safety awareness"],
  },
  {
    name: "Yoga for Kids",
    description:
      "Child-friendly yoga poses, breathing exercises, and relaxation techniques that improve flexibility and body awareness.",
    icon: <Heart className="h-6 w-6 text-kinder-purple" />,
    color: "kinder-purple",
    benefits: ["Flexibility", "Mindfulness", "Self-regulation"],
  },
  {
    name: "Dance & Movement",
    description:
      "Creative movement activities set to music that encourage self-expression, rhythm, and cultural appreciation.",
    icon: <Smile className="h-6 w-6 text-kinder-yellow" />,
    color: "kinder-yellow",
    benefits: ["Rhythm", "Self-expression", "Cultural awareness"],
  },
];

// Sports events
const sportsEvents = [
  {
    name: "Mini Sports Day",
    date: "February",
    description:
      "A fun-filled day of age-appropriate races and games where every child participates and is celebrated.",
    icon: <Trophy className="h-5 w-5 text-kinder-yellow" />,
  },
  {
    name: "Parent-Child Sports Day",
    date: "May",
    description:
      "A special event where parents join their children for team games and activities, strengthening family bonds.",
    icon: <Users className="h-5 w-5 text-kinder-green" />,
  },
  {
    name: "Swimming Showcase",
    date: "August",
    description:
      "Children demonstrate their water confidence and basic swimming skills learned throughout the term.",
    icon: <Shield className="h-5 w-5 text-kinder-blue" />,
  },
  {
    name: "Dance Performance",
    date: "November",
    description:
      "A celebration of movement and rhythm as children perform choreographed dances from various cultures.",
    icon: <Smile className="h-5 w-5 text-kinder-purple" />,
  },
];

// Array of image paths from public/games directory
const gameImages = [
  "/games/game1.jpg",
  "/games/game2.jpg",
  "/games/game3.jpg",
  "/games/game4.jpg",
  "/games/game5.jpg",
  "/games/game6.jpg",
  "/games/game7.jpg",
  "/games/game8.jpg",
];

export default function SportsPage() {
  // State to track the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Autoplay effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === gameImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  // Variants for image animation
  const imageVariants = {
    initial: { opacity: 0, scale: 0.8, rotate: -10 },
    animate: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1 } },
    exit: { opacity: 0, scale: 0.8, rotate: 10, transition: { duration: 1 } },
  };

  // Variants for background shapes
  const shapeVariants = {
    animate: {
      rotate: 360,
      transition: { repeat: Infinity, duration: 20, ease: "linear" },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-kinder-green/20 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-heading heading-gradient">
              Sports & Physical Development
            </h1>
            <p className="text-lg text-gray-700 mb-8 font-body">
              Our developmentally appropriate sports program helps children build strong bodies, confidence, and social skills through joyful movement
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-6 font-heading text-kinder-green">
                Our Philosophy
              </h2>
              <p className="text-gray-700 mb-4 font-body">
                At Clevers' Origin Schools, we believe physical activity is essential for young children's development. Our approach to sports and movement focuses on three key principles:
              </p>

              <div className="space-y-4 mt-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-kinder-green/10 flex-shrink-0 flex items-center justify-center mt-1">
                    <Heart className="h-5 w-5 text-kinder-green" />
                  </div>
                  <div>
                    <h3 className="font-bold text-kinder-green font-heading">
                      Joy in Movement
                    </h3>
                    <p className="text-gray-700 font-body">
                      We create positive experiences that help children develop a lifelong love of physical activity.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-kinder-green/10 flex-shrink-0 flex items-center justify-center mt-1">
                    <Users className="h-5 w-5 text-kinder-green" />
                  </div>
                  <div>
                    <h3 className="font-bold text-kinder-green font-heading">
                      Inclusive Participation
                    </h3>
                    <p className="text-gray-700 font-body">
                      Every child participates regardless of ability level, with activities adapted to ensure success for all.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-kinder-green/10 flex-shrink-0 flex items-center justify-center mt-1">
                    <Footprints className="h-5 w-5 text-kinder-green" />
                  </div>
                  <div>
                    <h3 className="font-bold text-kinder-green font-heading">
                      Developmental Appropriateness
                    </h3>
                    <p className="text-gray-700 font-body">
                      Our activities are designed specifically for early childhood, focusing on fundamental skills rather than competition.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 bg-kinder-yellow/10 p-4 sm:p-6 rounded-3xl border-2 border-kinder-yellow/30 shadow-md">
              <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-md w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px]">
                {/* Animated Image Slideshow */}
                <div
                  className="absolute inset-0"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  {/* Background Animated Shapes */}
                  <motion.div
                    className="absolute top-6 left-6 w-16 h-16 rounded-full bg-kinder-blue/20 opacity-50"
                    variants={shapeVariants}
                    animate="animate"
                  />
                  <motion.div
                    className="absolute bottom-6 right-6 w-20 h-20 rounded-full bg-kinder-green/20 opacity-50"
                    variants={shapeVariants}
                    animate="animate"
                    style={{ rotate: 45 }} // Star-like shape effect
                  />
                  <motion.div
                    className="absolute top-1/3 left-1/5 w-12 h-12 rounded-full bg-kinder-yellow/20 opacity-50"
                    variants={shapeVariants}
                    animate="animate"
                  />

                  {/* Image Slideshow */}
                  <AnimatePresence>
                    <motion.div
                      key={currentImageIndex}
                      className="absolute inset-0"
                      variants={imageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                    >
                      <Image
                        src={gameImages[currentImageIndex]}
                        alt={`Children enjoying sports activity ${currentImageIndex + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-2xl"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Overlay Caption */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white text-center py-2 rounded-lg">
                    <p className="text-sm sm:text-base font-heading">
                      Kids Having Fun in Sports!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center font-heading text-kinder-blue">
            Our Sports & Movement Activities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sportsActivities.map((activity, index) => (
              <Card
                key={index}
                className="border-2 border-gray-200 rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className={`bg-${activity.color}/10 p-6`}>
                  <div className="flex gap-4 items-start">
                    <div
                      className={`w-12 h-12 rounded-full bg-${activity.color}/20 flex-shrink-0 flex items-center justify-center`}
                    >
                      {activity.icon}
                    </div>
                    <div>
                      <h3
                        className={`text-xl font-bold mb-2 font-heading text-${activity.color}`}
                      >
                        {activity.name}
                      </h3>
                      <p className="text-gray-700 font-body">{activity.description}</p>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold mb-2 font-heading text-gray-700">
                    Key Benefits:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activity.benefits.map((benefit, i) => (
                      <span
                        key={i}
                        className={`text-xs py-1 px-2 rounded-full bg-${activity.color}/10 text-${activity.color} font-body`}
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Schedule */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center font-heading text-kinder-blue">
            Sports Schedule
          </h2>

          <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-kinder-blue/20 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-4 font-heading text-kinder-blue flex items-center gap-2">
                  <Clock className="h-5 w-5" /> Weekly Schedule
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between pb-3 border-b border-gray-100">
                    <span className="font-semibold text-gray-700 font-heading">Monday</span>
                    <span className="text-gray-600 font-body">Mini Athletics</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-gray-100">
                    <span className="font-semibold text-gray-700 font-heading">Tuesday</span>
                    <span className="text-gray-600 font-body">Balance & Coordination</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-gray-100">
                    <span className="font-semibold text-gray-700 font-heading">Wednesday</span>
                    <span className="text-gray-600 font-body">Team Games</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-gray-100">
                    <span className="font-semibold text-gray-700 font-heading">Thursday</span>
                    <span className="text-gray-600 font-body">Yoga for Kids</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700 font-heading">Friday</span>
                    <span className="text-gray-600 font-body">Dance & Movement</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 font-heading text-kinder-green flex items-center gap-2">
                  <Calendar className="h-5 w-5" /> Annual Events
                </h3>
                <div className="space-y-4">
                  {sportsEvents.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="mt-0.5 text-gray-400">{event.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700 font-heading">
                            {event.name}
                          </span>
                          <span className="text-xs py-0.5 px-2 rounded-full bg-kinder-green/10 text-kinder-green font-body">
                            {event.date}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 font-body">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Facilities */}
      <section className="py-12 md:py-16 bg-kinder-green/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center font-heading text-kinder-blue">
            Our Sports Facilities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-kinder-green/20 text-center">
              <div className="w-16 h-16 rounded-full bg-kinder-green/10 mx-auto flex items-center justify-center mb-4">
                <div className="text-3xl">🏃‍♂️</div>
              </div>
              <h3 className="text-lg font-bold mb-2 font-heading text-kinder-green">
                Outdoor Play Areas
              </h3>
              <p className="text-gray-700 font-body">
                Spacious, safe outdoor spaces with soft surfaces and age-appropriate equipment.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-kinder-blue/20 text-center">
              <div className="w-16 h-16 rounded-full bg-kinder-blue/10 mx-auto flex items-center justify-center mb-4">
                <div className="text-3xl">🏊‍♀️</div>
              </div>
              <h3 className="text-lg font-bold mb-2 font-heading text-kinder-blue">
                Swimming Partnership
              </h3>
              <p className="text-gray-700 font-body">
                Access to a nearby partner facility with a shallow pool designed for young learners.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-kinder-red/20 text-center">
              <div className="w-16 h-16 rounded-full bg-kinder-red/10 mx-auto flex items-center justify-center mb-4">
                <div className="text-3xl">🧘‍♀️</div>
              </div>
              <h3 className="text-lg font-bold mb-2 font-heading text-kinder-red">
                Movement Studio
              </h3>
              <p className="text-gray-700 font-body">
                Indoor space with mirrors, mats, and equipment for yoga, dance, and movement activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center font-heading text-kinder-blue">
            What Parents Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-kinder-purple/20">
              <p className="text-gray-700 italic mb-4 font-body">
                "My daughter used to be quite shy and hesitant about physical activities. The inclusive approach at Clevers' has completely transformed her confidence. She now loves showing us her 'yoga poses' at home!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-kinder-purple/20 flex items-center justify-center text-lg">
                  👩
                </div>
                <div>
                  <div className="font-semibold text-gray-800 font-heading">
                    Mrs. Nakato
                  </div>
                  <div className="text-sm text-gray-600 font-body">
                    Parent of Sarah, Age 5
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-kinder-yellow/20">
              <p className="text-gray-700 italic mb-4 font-body">
                "The sports program at Clevers' has been amazing for my son's development. The focus on fun rather than competition means he's building skills without pressure. His coordination has improved tremendously!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-kinder-yellow/20 flex items-center justify-center text-lg">
                  👨
                </div>
                <div>
                  <div className="font-semibold text-gray-800 font-heading">
                    Mr. Okello
                  </div>
                  <div className="text-sm text-gray-600 font-body">
                    Parent of David, Age 4
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-kinder-green/20 to-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-heading text-kinder-blue">
            Join Our Active Learning Community
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8 font-body">
            Give your child the gift of joyful movement and healthy development in our nurturing environment.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/apply">
              <Button className="gap-2 bg-kinder-green border-green-600 hover:bg-kinder-green/90 hover:border-green-700 kinder-button">
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="gap-2 border-2">
                Schedule a Visit
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}