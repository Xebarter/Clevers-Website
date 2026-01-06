// src/app/kasokoso/page.tsx

import React from "react";
import type { Metadata } from "next";
import CampusLayout from "@/components/CampusLayout";
import { Music, Heart, BookOpen, Globe, Users } from "lucide-react";
import type { CampusInfo } from "@/components/CampusLayout";
import { CampusImageCarousel } from "../ImageCarousel"; // Updated import to use the new component

export const metadata: Metadata = {
  title: "Kasokoso Campus | Clevers' Origin Schools",
  description: "Discover our vibrant Kasokoso Campus, known for its exceptional arts and music programs in a nurturing kindergarten environment.",
};

const kasokosoCampusInfo: CampusInfo = {
  name: "Kasokoso",
  description: "Established in 2010, our Kasokoso Campus is known for its vibrant arts and cultural programs, providing children with a creative learning environment that celebrates diversity and expression.",
  established: "2010",
  students: "180+",
  headshot: "👩‍🎨",
  principal: "Esther Nakato",
  principalTitle: "Campus Headteacher",
  principalMessage: "We believe every child is born with unique talents and capabilities. At Kasokoso Campus, we create a colorful environment where these talents are discovered, nurtured, and celebrated through music, arts, and play-based learning.",
  address: "Plot 27, Kasokoso Lane, Kampala, Uganda",
  phone: "+256 700 234567",
  email: "kasokoso@cleversoriginschools.com",
  hours: "Monday to Friday: 7:30am - 4:30pm",
  accentColor: "kinder-red",

  features: [
    {
      title: "Music Excellence Program",
      description: "Our award-winning music program introduces children to diverse musical instruments, vocal training, and performance opportunities.",
      icon: <Music className="h-6 w-6 text-kinder-red" />
    },
    {
      title: "Cultural Diversity",
      description: "We celebrate various cultures through traditional songs, dances, and customs, helping children appreciate global diversity.",
      icon: <Globe className="h-6 w-6 text-kinder-red" />
    },
    {
      title: "Emotional Intelligence",
      description: "We place special emphasis on helping children recognize and express their emotions in healthy ways.",
      icon: <Heart className="h-6 w-6 text-kinder-red" />
    },
    {
      title: "Literacy Through Arts",
      description: "Our unique approach combines storytelling with artistic expression to enhance language development.",
      icon: <BookOpen className="h-6 w-6 text-kinder-red" />
    },
    {
      title: "Inclusive Learning",
      description: "We embrace different learning styles and abilities, ensuring every child receives the support they need to thrive.",
      icon: <Users className="h-6 w-6 text-kinder-red" />
    }
  ],

  facilities: [
    "5 well-equipped classrooms with flexible learning spaces",
    "Dedicated music room with various instruments including drums, xylophones, and recorders",
    "Colorful art studio with child-sized easels and art supplies",
    "Outdoor playground with musical elements and sensory play areas",
    "Mini-amphitheater for performances and storytelling sessions",
    "Reading garden with comfortable seating and shade trees",
    "Dining hall serving nutritious meals with cultural diversity",
    "Small library with books in multiple languages"
  ],

  extracurriculars: [
    "Children's Choir: Developing vocal skills and harmonious singing",
    "Traditional Dance: Learning dance forms from various Ugandan cultures",
    "Drumming Circle: Rhythm and coordination through percussion instruments",
    "Young Artists Club: Exploring different art mediums and techniques",
    "Storytelling and Drama: Building confidence through performance",
    "Mini-Olympics: Building physical skills through friendly competitions",
    "Cultural Exchange Days: Learning about global cultures and traditions"
  ],

  galleryImages: [],

  imagePlaceholder: (
    <CampusImageCarousel category="Kasokoso" />
  )
};

export default function KasokosoCampusPage() {
  return <CampusLayout campusInfo={kasokosoCampusInfo} />;
}