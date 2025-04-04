"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  GraduationCap,
  Calendar,
  Trophy,
  Dumbbell,
  Music,
  BookOpen,
  HeartHandshake,
  Landmark,
  Cpu
} from "lucide-react";

// Define gallery categories
interface GalleryCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

const galleryCategories: GalleryCategory[] = [
  { id: "all", name: "All Photos", icon: CalendarDays, color: "text-gray-500" },
  { id: "academic", name: "Academic", icon: GraduationCap, color: "text-blue-500" },
  { id: "events", name: "Events", icon: Calendar, color: "text-purple-500" },
  { id: "achievements", name: "Achievements", icon: Trophy, color: "text-yellow-500" },
  { id: "sports", name: "Sports", icon: Dumbbell, color: "text-green-500" },
  { id: "arts", name: "Arts & Culture", icon: Music, color: "text-red-500" },
  { id: "stem", name: "STEM", icon: Cpu, color: "text-pink-500" },
  { id: "community", name: "Community Service", icon: HeartHandshake, color: "text-orange-500" },
  { id: "campus", name: "Campus Life", icon: Landmark, color: "text-teal-500" },
];

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  location: string;
  imageSrc: string;
}

// Sample gallery items with placeholder images
const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Annual Science Fair 2024",
    description: "Students showcase their innovative science projects to parents and judges.",
    date: "March 15, 2025",
    category: "academic",
    location: "Kitintale Campus",
    imageSrc: "https://placehold.co/600x400/2a9d8f/FFFFFF/png?text=Science+Fair",
  },
  {
    id: 2,
    title: "Inter-House Football Tournament",
    description: "The annual football competition between school houses.",
    date: "February 20, 2025",
    category: "sports",
    location: "Maganjo Campus Sports Field",
    imageSrc: "https://placehold.co/600x400/457b9d/FFFFFF/png?text=Football+Tournament",
  },
  {
    id: 3,
    title: "Cultural Day Celebrations",
    description: "Students celebrate cultural diversity through traditional dances, cuisine, and exhibitions.",
    date: "March 2, 2025",
    category: "arts",
    location: "All Campuses",
    imageSrc: "https://placehold.co/600x400/e63946/FFFFFF/png?text=Cultural+Day",
  },
  {
    id: 4,
    title: "Graduation Ceremony 2024",
    description: "Celebrating our graduating class of 2024.",
    date: "December 15, 2024",
    category: "events",
    location: "Kasokoso Campus Auditorium",
    imageSrc: "https://placehold.co/600x400/8338ec/FFFFFF/png?text=Graduation+Ceremony",
  },
  {
    id: 5,
    title: "National Mathematics Competition",
    description: "Our students won first place in the national mathematics competition.",
    date: "January 25, 2025",
    category: "achievements",
    location: "National Arena, Kampala",
    imageSrc: "https://placehold.co/600x400/ffbe0b/FFFFFF/png?text=Math+Competition+Winners",
  },
  {
    id: 6,
    title: "Community Clean-up Day",
    description: "Students and teachers participating in community clean-up activities.",
    date: "February 5, 2025",
    category: "community",
    location: "Local Communities",
    imageSrc: "https://placehold.co/600x400/fb5607/FFFFFF/png?text=Community+Clean-up",
  },
  {
    id: 7,
    title: "Robotics Workshop",
    description: "Students learning to build and program robots with professional engineers.",
    date: "March 10, 2025",
    category: "stem",
    location: "Innovation Lab, Maganjo Campus",
    imageSrc: "https://placehold.co/600x400/ff006e/FFFFFF/png?text=Robotics+Workshop",
  },
  {
    id: 8,
    title: "School Assembly",
    description: "Weekly assembly where students gather for announcements, performances, and awards.",
    date: "Weekly",
    category: "campus",
    location: "All Campuses",
    imageSrc: "https://placehold.co/600x400/3a86ff/FFFFFF/png?text=School+Assembly",
  },
  {
    id: 9,
    title: "Sports Day",
    description: "Annual athletics competition featuring track and field events.",
    date: "January 30, 2025",
    category: "sports",
    location: "Kitintale Campus Sports Ground",
    imageSrc: "https://placehold.co/600x400/457b9d/FFFFFF/png?text=Sports+Day",
  },
  {
    id: 10,
    title: "Music Festival",
    description: "Students performing at the East African Schools Music Festival.",
    date: "February 28, 2025",
    category: "arts",
    location: "National Theatre, Kampala",
    imageSrc: "https://placehold.co/600x400/e63946/FFFFFF/png?text=Music+Festival",
  },
  {
    id: 11,
    title: "Career Day",
    description: "Professionals from various fields share insights with students about career paths.",
    date: "March 5, 2025",
    category: "academic",
    location: "All Campuses",
    imageSrc: "https://placehold.co/600x400/2a9d8f/FFFFFF/png?text=Career+Day",
  },
  {
    id: 12,
    title: "New Library Opening",
    description: "Inauguration of our new modern library at Kasokoso Campus.",
    date: "February 10, 2025",
    category: "events",
    location: "Kasokoso Campus",
    imageSrc: "https://placehold.co/600x400/8338ec/FFFFFF/png?text=Library+Opening",
  },
];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<string>("all");

  // Filter gallery items based on selected category
  const filteredItems = activeTab === "all"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeTab);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">School Gallery</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore moments from academic achievements, sports events, cultural celebrations, and campus life at Clevers' Origin Schools.
          </p>
        </div>

        {/* Gallery Categories Tabs */}
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full mb-8">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 h-auto gap-2">
            {galleryCategories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="py-2 data-[state=active]:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${category.color}`} />
                    <span>{category.name}</span>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Gallery Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No photos available in this category.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden school-card hover:shadow-lg">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={item.imageSrc}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    {getCategoryBadge(item.category)}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                    <div className="flex items-center">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {item.date}
                    </div>
                    <div className="flex items-center">
                      <Landmark className="h-3 w-3 mr-1" />
                      {item.location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to get the appropriate badge for each category
function getCategoryBadge(category: string) {
  const badgeStyles: Record<string, string> = {
    academic: "bg-blue-100 text-blue-800",
    events: "bg-purple-100 text-purple-800",
    achievements: "bg-yellow-100 text-yellow-800",
    sports: "bg-green-100 text-green-800",
    arts: "bg-red-100 text-red-800",
    stem: "bg-pink-100 text-pink-800",
    community: "bg-orange-100 text-orange-800",
    campus: "bg-teal-100 text-teal-800",
  };

  const categoryName = galleryCategories.find(cat => cat.id === category)?.name || category;

  return (
    <Badge className={badgeStyles[category] || "bg-gray-100 text-gray-800"}>
      {categoryName}
    </Badge>
  );
}
