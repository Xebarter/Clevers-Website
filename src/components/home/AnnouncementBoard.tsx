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
import { Button } from "@/components/ui/button";
import { CalendarClock, Users, Megaphone, BookOpen, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { announcementsService, type Announcement } from "../../../lib/supabase/services";

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

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
  category?: keyof typeof categories;
  author?: string;
  image_url?: string;
  cta_text?: string;
  cta_link?: string;
}

const AnnouncementBoard = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await announcementsService.getAll();
        // Convert Supabase data to match component expectations
        const convertedData = data.map((item: Announcement) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          created_at: item.created_at || new Date().toISOString(),
          category: item.category as keyof typeof categories || 'general',
          author: item.author,
          image_url: item.image_url,
          cta_text: item.cta_text,
          cta_link: item.cta_link
        }));
        setAnnouncements(convertedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError("Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Group announcements by category
  const groupedAnnouncements = announcements.reduce((acc, announcement) => {
    const category = announcement.category || 'general';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(announcement);
    return acc;
  }, {} as Record<string, AnnouncementItem[]>);

  // Get the latest 3 announcements for the "All" tab
  const latestAnnouncements = [...announcements]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Latest Announcements</CardTitle>
          <CardDescription className="text-center">Loading announcements...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Latest Announcements</CardTitle>
          <CardDescription className="text-center text-red-500">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4">Unable to load announcements at this time.</p>
        </CardContent>
      </Card>
    );
  }

  // Function to render announcement content with optional image and CTA
  const renderAnnouncementContent = (announcement: AnnouncementItem) => {
    return (
      <>
        {announcement.image_url && (
          <div className="mb-4">
            <img
              src={announcement.image_url}
              alt={announcement.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
        <p className="text-gray-700 dark:text-gray-300">{announcement.content}</p>
        {announcement.cta_text && announcement.cta_link && (
          <div className="mt-4">
            <Button asChild>
              <a
                href={announcement.cta_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {announcement.cta_text}
              </a>
            </Button>
          </div>
        )}
      </>
    );
  };

  // Reusable announcement card for consistent, modern styling
  const AnnouncementCard = ({
    announcement,
    categoryKey,
    categoryData,
  }: {
    announcement: AnnouncementItem;
    categoryKey?: string;
    categoryData?: { label: string; color: string; icon: any };
  }) => {
    const CategoryIcon = categoryData?.icon || Megaphone;

    return (
      <Card className="w-full hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 rounded-xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-start gap-4">
          {announcement.image_url && (
            <div className="w-full md:w-44 h-36 flex-shrink-0">
              <img
                src={announcement.image_url}
                alt={announcement.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 p-4 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <CardTitle className="text-lg md:text-xl font-semibold truncate">
                  {announcement.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(announcement.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={`${categoryData?.color} text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1`}>
                  <CategoryIcon className="w-3 h-3" />
                  <span className="hidden sm:inline-block">{categoryData?.label}</span>
                </Badge>
              </div>
            </div>

            <div className="mt-3 text-gray-700 dark:text-gray-300">
              {renderAnnouncementContent(announcement)}
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              {announcement.author ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">By {announcement.author}</div>
              ) : (
                <div />
              )}

              {announcement.cta_text && announcement.cta_link && (
                <div>
                  <Button asChild size={"sm"}>
                    <a href={announcement.cta_link} target="_blank" rel="noopener noreferrer">
                      {announcement.cta_text}
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Latest Announcements</CardTitle>
        <CardDescription className="text-center">Stay updated with the latest school news</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="event">Events</TabsTrigger>
            <TabsTrigger value="achievement">Achievements</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="space-y-6">
              <AnimatePresence>
                {latestAnnouncements.map((announcement) => {
                  const category = announcement.category || 'general';

                  return (
                    <motion.div
                      key={announcement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AnnouncementCard
                        announcement={announcement}
                        categoryKey={category}
                        categoryData={categories[category]}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </TabsContent>

          {Object.entries(categories).map(([categoryKey, categoryData]) => (
            <TabsContent key={categoryKey} value={categoryKey} className="mt-4">
              <div className="space-y-6">
                <AnimatePresence>
                  {(groupedAnnouncements[categoryKey] || []).map((announcement) => {
                    return (
                      <motion.div
                        key={announcement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AnnouncementCard
                          announcement={announcement}
                          categoryKey={categoryKey}
                          categoryData={categoryData as any}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {(!groupedAnnouncements[categoryKey] || groupedAnnouncements[categoryKey].length === 0) && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No {categoryData.label.toLowerCase()} announcements at this time.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnnouncementBoard;