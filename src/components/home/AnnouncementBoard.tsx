"use client";

import React, { useState } from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Users, Megaphone, BookOpen, Award, AlertCircle, Calendar, ArrowRight } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  content: string;
  publishDate: string;
  isImportant?: boolean;
  category: keyof typeof categories;
}

// Define announcement categories and their corresponding colors
const categories = {
  general: { label: "General", color: "bg-blue-100 text-blue-800", icon: Megaphone },
  academic: { label: "Academic", color: "bg-green-100 text-green-800", icon: BookOpen },
  event: { label: "Event", color: "bg-orange-100 text-orange-800", icon: CalendarClock },
  achievement: { label: "Achievement", color: "bg-purple-100 text-purple-800", icon: Award },
  community: { label: "Community", color: "bg-pink-100 text-pink-800", icon: Users },
};

interface AnnouncementBoardProps {
  announcements: Announcement[];
}

const AnnouncementBoard: React.FC<AnnouncementBoardProps> = ({ announcements }) => {
  const [activeTab, setActiveTab] = useState<string>("all");

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Filter announcements based on selected category
  const filteredAnnouncements = activeTab === "all"
    ? announcements
    : announcements.filter(announcement => announcement.category === activeTab);

  // Sort announcements by importance and date
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    // First sort by importance
    if (a.isImportant && !b.isImportant) return -1;
    if (!a.isImportant && b.isImportant) return 1;

    // Then sort by publish date (newest first)
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  });

  // Display only the first 3 announcements on the home page
  const displayedAnnouncements = sortedAnnouncements.slice(0, 3);

  if (displayedAnnouncements.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center">
          <Megaphone className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Announcements</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            There are no current announcements at this time. Check back later for updates.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          {Object.entries(categories).map(([key, { label }]) => (
            <TabsTrigger key={key} value={key}>{label}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {displayedAnnouncements.length === 0 ? (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">No announcements available.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedAnnouncements.map((announcement) => {
                const CategoryIcon = categories[announcement.category].icon;
                return (
                  <Card
                    key={announcement.id}
                    className={`overflow-hidden ${announcement.isImportant
                      ? 'border-l-4 border-red-500 shadow-md'
                      : 'hover:shadow-md transition-shadow duration-200'}`}
                  >
                    <CardContent className="p-0">
                      <div className={`p-6 ${announcement.isImportant ? 'bg-red-50' : ''}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            {announcement.isImportant ? (
                              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                            ) : (
                              <CategoryIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                            )}
                            <h3 className={`font-bold text-lg font-heading ${announcement.isImportant ? 'text-red-800' : 'text-kinder-blue'}`}>
                              {announcement.title}
                            </h3>
                          </div>
                          {announcement.isImportant && (
                            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                              Important
                            </span>
                          )}
                        </div>

                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(announcement.publishDate)}
                        </div>

                        <p className="text-gray-700 line-clamp-3 mb-4">
                          {announcement.content}
                        </p>

                        <Button
                          variant="ghost"
                          className="px-0 text-kinder-blue hover:text-kinder-blue/80 hover:bg-transparent"
                          asChild
                        >
                          <Link href={`/announcements/${announcement.id}`}>
                            Read More <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnnouncementBoard;
