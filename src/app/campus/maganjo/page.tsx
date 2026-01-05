// src/app/maganjo/page.tsx

import React from "react";
import type { Metadata } from "next";
import CampusLayout, { CampusInfo } from "@/components/CampusLayout";
import { Activity, Cpu, Trophy, Leaf, BookOpen } from "lucide-react";
import ImageCarousel from "../ImageCarousel";

export const metadata: Metadata = {
  title: "Maganjo Campus | Clevers' Origin Schools",
  description: "Explore our newest Maganjo Campus, featuring modern facilities and innovative programs focused on sports, technology, and environmental education.",
};

const maganjoCampusInfo: CampusInfo = {
  name: "Maganjo",
  description: "Our newest campus established in 2017, featuring modern facilities and innovative programs focused on sports, technology, and environmental education in a spacious setting.",
  established: "2017",
  students: "150+",
  headshot: "🧑‍🏫",
  principal: "Daniel Kigozi",
  principalTitle: "Campus Principal",
  principalMessage:
    "At Maganjo Campus, we believe in developing well-rounded children through a balance of physical activity, technological literacy, and environmental stewardship. Our modern facilities and dynamic programs provide the perfect foundation for 21st-century learning.",
  address: "Plot 13, Maganjo Road, Kampala, Uganda",
  phone: "+256 753 252 716",
  email: "cleversorigin@gmail.com",
  hours: "Monday to Friday: 7:30am - 4:30pm",
  accentColor: "kinder-green",

  features: [
    {
      title: "Sports Excellence",
      description:
        "Our comprehensive physical education program develops coordination, teamwork, and healthy habits through age-appropriate sports activities.",
      icon: <Trophy className="h-6 w-6 text-kinder-green" />,
    },
    {
      title: "Tech for Tots",
      description:
        "Introduction to basic technology concepts through interactive, screen-limited activities that build digital literacy foundations.",
      icon: <Cpu className="h-6 w-6 text-kinder-green" />,
    },
    {
      title: "Eco-Explorers",
      description:
        "Hands-on environmental education program teaching children about sustainability, conservation, and respect for nature.",
      icon: <Leaf className="h-6 w-6 text-kinder-green" />,
    },
    {
      title: "Active Learning",
      description:
        "Movement-integrated teaching approaches that combine physical activity with academic concepts for enhanced retention.",
      icon: <Activity className="h-6 w-6 text-kinder-green" />,
    },
    {
      title: "STEM Foundations",
      description:
        "Early introduction to science, technology, engineering, and math concepts through playful, hands-on projects.",
      icon: <BookOpen className="h-6 w-6 text-kinder-green" />,
    },
  ],

  facilities: [
    "6 modern, air-conditioned classrooms with flexible seating arrangements",
    "Mini sports field with running track and age-appropriate equipment",
    "Indoor gymnasium for physical activities during inclement weather",
    "Technology lab with child-friendly computing devices and educational software",
    "Nature center with gardening plots and small animal habitats",
    "Science discovery room with interactive exhibits and exploration stations",
    "Eco-friendly cafeteria serving healthy, locally-sourced meals",
    "Multipurpose hall for assemblies, events, and indoor activities",
  ],

  extracurriculars: [
    "Mini Athletics: Introduction to running, jumping, and throwing events",
    "Team Sports: Simplified versions of football, netball, and cricket",
    "Coding Cubs: Basic programming concepts through unplugged activities",
    "Nature Explorers: Field trips and outdoor education experiences",
    "Little Scientists: Hands-on experiments and scientific discoveries",
    "Eco Warriors: Environmental stewardship and conservation projects",
    "Robotics Basics: Introduction to simple machines and movement",
  ],

  galleryImages: [
    { url: "/maganjo/maganjo1.jpg", alt: "Maganjo Campus Image 1" },
    { url: "/maganjo/maganjo2.jpg", alt: "Maganjo Campus Image 2" },
    { url: "/maganjo/maganjo3.jpg", alt: "Maganjo Campus Image 3" },
    { url: "/maganjo/maganjo4.jpg", alt: "Maganjo Campus Image 4" },
    { url: "/maganjo/maganjo5.jpg", alt: "Maganjo Campus Image 5" },
  ], // Optional — handled via imagePlaceholder
};

export default function MaganjoCampusPage() {
  return (
    <CampusLayout
      campusInfo={{
        ...maganjoCampusInfo,
        imagePlaceholder: (
          <ImageCarousel
            images={[
              { url: "/maganjo/maganjo1.jpg", alt: "Maganjo Campus Image 1" },
              { url: "/maganjo/maganjo2.jpg", alt: "Maganjo Campus Image 2" },
              { url: "/maganjo/maganjo3.jpg", alt: "Maganjo Campus Image 3" },
              { url: "/maganjo/maganjo4.jpg", alt: "Maganjo Campus Image 4" },
              { url: "/maganjo/maganjo5.jpg", alt: "Maganjo Campus Image 5" },
            ]}
          />
        ),
      }}
    />
  );
}
