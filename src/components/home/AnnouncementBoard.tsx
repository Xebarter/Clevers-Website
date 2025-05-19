"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Users, Megaphone, BookOpen, Award } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { motion, AnimatePresence } from "framer-motion";

const categories = {
  general: {
    label: "General",
    color: "bg-blue-600 text-white hover:bg-blue-700",
    icon: Megaphone,
  },
  academic: {
    label: "Academic",
    color: "bg-green-600 text-white hover:bg-green-700",
    icon: BookOpen,
  },
  event: {
    label: "Event",
    color: "bg-orange-600 text-white hover:bg-orange-700",
    icon: CalendarClock,
  },
  achievement: {
    label: "Achievement",
    color: "bg-purple-600 text-white hover:bg-purple-700",
    icon: Award,
  },
  community: {
    label: "Community",
    color: "bg-pink-600 text-white hover:bg-pink-700",
    icon: Users,
  },
};

interface Announcement {
  _id: string;
  title: string;
  content: string;
  date: string;
  category: keyof typeof categories;
  pinned?: boolean;
}

const renderContentWithLinks = (content: string) => {
  // Regex to detect URLs (http(s):// or www.)
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  // Split content by URLs and wrap URLs in <a> tags
  const parts = content.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      // Ensure URL has protocol for href (add https:// to www. links)
      const href = part.startsWith("www.") ? `https://${part}` : part;
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800 transition-colors"
        >
          {part}
        </a>
      );
    }
    return part;
  });
  return <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{parts}</p>;
};

const AnnouncementBoard = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const query = `*[_type == "announcement"] | order(date desc) {
          _id,
          title,
          content,
          date,
          category,
          pinned
        }`;
        const data = await client.fetch(query);
        setAnnouncements(data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const filteredAnnouncements =
    activeTab === "all"
      ? announcements
      : announcements.filter((announcement) => announcement.category === activeTab);

  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="h-8 w-8 border-3 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-6 sm:pt-10 pb-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-10"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Clevers' Origin Announcements
          </h1>
          <p className="mt-2 text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with events, achievements, and news at Clevers' Origin Schools.
          </p>
        </motion.div>

        {/* Tabs Section */}
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-4 sm:mb-6 flex flex-wrap justify-center gap-1 sm:gap-2 bg-transparent py-2 sm:sticky sm:top-0 sm:z-10 sm:backdrop-blur-sm">
            <TabsTrigger
              value="all"
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all bg-gray-200 text-gray-800 hover:bg-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white shadow-sm min-w-[80px] sm:min-w-[100px] text-center"
            >
              All
            </TabsTrigger>
            {Object.entries(categories).map(([key, { label, color }]) => (
              <TabsTrigger
                key={key}
                value={key}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all ${color} shadow-sm min-w-[80px] sm:min-w-[100px] text-center`}
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0 pt-4 sm:pt-0">
            {sortedAnnouncements.length === 0 ? (
              <Card className="p-6 sm:p-8 text-center shadow-lg bg-white rounded-xl border border-gray-200">
                <CardContent className="p-0">
                  <p className="text-gray-500 text-base sm:text-lg font-medium">
                    No announcements in this category.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                <AnimatePresence>
                  {sortedAnnouncements.map((announcement, index) => {
                    const CategoryIcon = categories[announcement.category].icon;
                    return (
                      <motion.div
                        key={announcement._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="relative"
                      >
                        <Card
                          className={`bg-white shadow-md rounded-xl overflow-hidden border-l-6 ${
                            announcement.pinned
                              ? "border-blue-600 shadow-lg"
                              : "border-gray-200"
                          } transition-transform hover:scale-[1.02] hover:shadow-lg`}
                        >
                          {announcement.pinned && (
                            <div className="absolute top-0 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-sm translate-y-[-50%]">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M13.586 2.586A2 2 0 0115 2h2a2 2 0 012 2v12a2 2 0 01-2 2H3a2 2 0 01-2-2V4a2 2 0 012-2h2a2 2 0 011.414.586L10 6.172l3.586-3.586z" />
                              </svg>
                            </div>
                          )}
                          <CardHeader className="pb-2 px-4 sm:px-5 bg-gradient-to-r from-gray-50 to-gray-100">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                              <div className="flex items-center gap-2">
                                <CategoryIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 flex-shrink-0" />
                                <CardTitle className="text-base sm:text-lg font-bold text-gray-900">
                                  {announcement.title}
                                </CardTitle>
                              </div>
                              {announcement.pinned && (
                                <Badge className="bg-blue-600 text-white hover:bg-blue-700 font-semibold text-xs sm:text-sm">
                                  Pinned
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="text-xs sm:text-sm text-gray-500 mt-1">
                              {formatDate(announcement.date)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-3 px-4 sm:px-5">
                            {renderContentWithLinks(announcement.content)}
                          </CardContent>
                          <CardFooter className="pt-0 pb-3 px-4 sm:px-5">
                            <Badge
                              className={`${categories[announcement.category].color} px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold`}
                            >
                              {categories[announcement.category].label}
                            </Badge>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnnouncementBoard;