"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Users, Megaphone, BookOpen, Award } from "lucide-react";
import { client } from "@/sanity/lib/client";

// Define announcement categories and their corresponding colors
const categories = {
  general: { label: "General", color: "bg-blue-100 text-blue-800", icon: Megaphone },
  academic: { label: "Academic", color: "bg-green-100 text-green-800", icon: BookOpen },
  event: { label: "Event", color: "bg-orange-100 text-orange-800", icon: CalendarClock },
  achievement: { label: "Achievement", color: "bg-purple-100 text-purple-800", icon: Award },
  community: { label: "Community", color: "bg-pink-100 text-pink-800", icon: Users },
};

// Updated interface to match Sanity schema
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

  // Fetch announcements from Sanity
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

  // Filter announcements based on selected category
  const filteredAnnouncements = activeTab === "all"
    ? announcements
    : announcements.filter(announcement => announcement.category === activeTab);

  // Sort announcements by pinned status and date
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    // Pinned announcements come first
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    // Then sort by date (newest first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Format date to a more readable format
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading announcements...</p>
      </div>
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
          {sortedAnnouncements.length === 0 ? (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">No announcements available.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedAnnouncements.map((announcement) => {
                const CategoryIcon = categories[announcement.category].icon;
                return (
                  <Card key={announcement._id} className={`${announcement.pinned ? 'border-l-4 border-l-school-red' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="h-5 w-5 text-gray-500" />
                          <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        </div>
                        {announcement.pinned && (
                          <Badge variant="outline" className="bg-red-50 text-school-red border-school-red">
                            Pinned
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        {formatDate(announcement.date)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{announcement.content}</p>
                    </CardContent>
                    <CardFooter className="pt-0 justify-between">
                      <Badge className={categories[announcement.category].color}>
                        {categories[announcement.category].label}
                      </Badge>
                    </CardFooter>
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