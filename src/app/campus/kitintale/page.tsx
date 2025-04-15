// src/app/kitintale/page.tsx

import React from "react";
import type { Metadata } from "next";
import CampusLayout, { CampusInfo } from "@/components/CampusLayout";
import { Award, BookOpen, Music, Palette, Users } from "lucide-react";
import ImageCarousel from "../ImageCarousel"; // Carousel stays for the animated images

export const metadata: Metadata = {
  title: "Kitintale Campus | Clevers' Origin Schools",
  description: "Explore our flagship Kitintale Campus, offering quality kindergarten education in a nurturing environment since 2005.",
};

const kitintaleCampusInfo: CampusInfo = {
  name: "Kitintale",
  description: "Our flagship campus established in 2005, featuring spacious classrooms, dedicated play areas, and innovative learning environments designed to inspire young minds.",
  established: "2005",
  students: "200+",
  headshot: "👨‍🚀",
  principal: "Joshua Musoke",
  principalTitle: "Campus Principal",
  principalMessage: "At Kitintale Campus, we create an environment where children feel safe to explore, question, and learn. Our approach combines academic excellence with joy and creativity, ensuring each child develops a lifelong love for learning.",
  address: "Plot 45, Kitintale Road, Kampala, Uganda",
  phone: "+256 700 123456",
  email: "kitintale@cleversoriginschools.com",
  hours: "Monday to Friday: 7:30am - 4:30pm",
  accentColor: "kinder-blue",

  features: [
    {
      title: "Creative Arts Program",
      description: "Our award-winning arts program encourages creative expression through painting, drama, music, and dance.",
      icon: <Palette className="h-6 w-6 text-kinder-blue" />
    },
    {
      title: "Community Garden",
      description: "Students learn about nature, sustainability, and responsibility by tending to our campus garden.",
      icon: <BookOpen className="h-6 w-6 text-kinder-blue" />
    },
    {
      title: "Leadership Development",
      description: "We foster leadership skills through collaborative projects and child-led initiatives.",
      icon: <Award className="h-6 w-6 text-kinder-blue" />
    },
    {
      title: "Multilingual Program",
      description: "Children are introduced to both English and local languages through songs, stories, and everyday communication.",
      icon: <Music className="h-6 w-6 text-kinder-blue" />
    },
    {
      title: "Small Class Sizes",
      description: "With a maximum of 20 students per class, we ensure personalized attention for every child.",
      icon: <Users className="h-6 w-6 text-kinder-blue" />
    }
  ],

  facilities: [
    "6 spacious, bright classrooms equipped with modern learning resources",
    "Large outdoor playground with climbing frames, swings, and sandpit",
    "Indoor activity hall for music, dance, and performances",
    "Library corner with age-appropriate books in multiple languages",
    "Dedicated art studio with child-friendly supplies and materials",
    "Computer corner with educational games and programs",
    "Dining area serving nutritious meals and snacks",
    "Garden area where children learn to grow vegetables and flowers"
  ],

  extracurriculars: [
    "Music and Movement: Introduction to various instruments and dance styles",
    "Mini-Sports: Development of gross motor skills through games and activities",
    "Storytelling Club: Enhancing language and imagination through stories",
    "Little Gardeners: Hands-on experience with planting and nurturing plants",
    "Drama Club: Building confidence through performance and role play",
    "Cultural Days: Celebrating diverse cultures through food, dress, and customs",
    "Parent-Child Workshops: Special sessions where parents join classroom activities"
  ],

  galleryImages: [] // Required but unused

};

export default function KitintaleCampusPage() {
  return (
    <CampusLayout
      campusInfo={{
        ...kitintaleCampusInfo,
        imagePlaceholder: (
          <ImageCarousel
            images={[
              { url: "/kitintale/kitintale1.jpg", alt: "Kitintale Campus Image 1" },
              { url: "/kitintale/kitintale2.jpg", alt: "Kitintale Campus Image 2" },
              { url: "/kitintale/kitintale3.jpg", alt: "Kitintale Campus Image 3" },
              { url: "/kitintale/kitintale4.jpg", alt: "Kitintale Campus Image 4" },
              { url: "/kitintale/kitintale5.jpg", alt: "Kitintale Campus Image 5" },
            ]}
          />
        ),
      }}
    />
  );
}
