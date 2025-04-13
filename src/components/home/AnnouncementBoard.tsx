// src/app/announcement-board/page.tsx
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
  general: { label: "General", color: "bg-blue-100 text-blue-800 hover:bg-blue-200", icon: Megaphone },
  academic: { label: "Academic", color: "bg-green-100 text-green-800 hover:bg-green-200", icon: BookOpen },
  event: { label: "Event", color: "bg-orange-100 text-orange-800 hover:bg-orange-200", icon: CalendarClock },
  achievement: { label: "Achievement", color: "bg-purple-100 text-purple-800 hover:bg-purple-200", icon: Award },
  community: { label: "Community", color: "bg-pink-100 text-pink-800 hover:bg-pink-200", icon: Users },
};

interface Announcement {
  _id: string;
  title: string;
  content: string;
  date: string;
  category: keyof typeof categories;
  pinned?: boolean;
}

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

  const filteredAnnouncements = activeTab === "all"
    ? announcements
    : announcements.filter(announcement => announcement.category === activeTab);

  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="h-6 w-6 sm:h-8 sm:w-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Announcement Board
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            Stay updated with the latest announcements, events, and achievements at Clevers' Origin Schools.
          </p>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-6 sm:mb-8 flex flex-wrap gap-2 justify-center">
            <TabsTrigger
              value="all"
              className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md transition-colors data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            {Object.entries(categories).map(([key, { label }]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md transition-colors data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0 mb-0">
            {sortedAnnouncements.length === 0 ? (
              <Card className="p-6 sm:p-8 text-center shadow-lg bg-white rounded-xl">
                <CardContent className="p-0">
                  <p className="text-gray-500 text-sm sm:text-lg">
                    No announcements available.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <AnimatePresence>
                  {sortedAnnouncements.map((announcement, index) => {
                    const CategoryIcon = categories[announcement.category].icon;
                    return (
                      <motion.div
                        key={announcement._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card
                          className={`bg-white shadow-lg rounded-xl overflow-hidden border-l-4 ${
                            announcement.pinned ? 'border-blue-500' : 'border-gray-200'
                          } transition-all hover:shadow-xl`}
                        >
                          <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <CategoryIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 flex-shrink-0" />
                                <CardTitle className="text-base sm:text-xl font-semibold text-gray-800">
                                  {announcement.title}
                                </CardTitle>
                              </div>
                              {announcement.pinned && (
                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium text-xs sm:text-sm">
                                  Pinned
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="text-xs sm:text-sm text-gray-500 mt-1">
                              {formatDate(announcement.date)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-3 sm:pt-4 px-4 sm:px-6">
                            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                              {announcement.content}
                            </p>
                          </CardContent>
                          <CardFooter className="pt-0 pb-3 sm:pb-4 px-4 sm:px-6">
                            <Badge
                              className={`${categories[announcement.category].color} px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium transition-colors`}
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