"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarClock,
  Users,
  Megaphone,
  BookOpen,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  announcementsService,
  type Announcement,
} from "../../../lib/supabase/services";

const categories = {
  general: {
    label: "General",
    className: "bg-blue-600 text-white",
    icon: Megaphone,
  },
  academic: {
    label: "Academic",
    className: "bg-green-600 text-white",
    icon: BookOpen,
  },
  event: {
    label: "Events",
    className: "bg-orange-600 text-white",
    icon: CalendarClock,
  },
  achievement: {
    label: "Achievements",
    className: "bg-purple-600 text-white",
    icon: Award,
  },
  community: {
    label: "Community",
    className: "bg-pink-600 text-white",
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

export default function AnnouncementBoard() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await announcementsService.getAll();
        const normalized = data.map((item: Announcement) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          created_at: item.created_at ?? new Date().toISOString(),
          category: (item.category as keyof typeof categories) ?? "general",
          author: item.author,
          image_url: item.image_url,
          cta_text: item.cta_text,
          cta_link: item.cta_link,
        }));
        setAnnouncements(normalized);
      } catch (e) {
        setError("Unable to load announcements.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const grouped = announcements.reduce<Record<string, AnnouncementItem[]>>(
    (acc, a) => {
      const key = a.category ?? "general";
      acc[key] = acc[key] || [];
      acc[key].push(a);
      return acc;
    },
    {}
  );

  const latest = [...announcements]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 3);

  if (loading) {
    return (
      <Card className="max-w-5xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Latest Announcements</CardTitle>
          <CardDescription>Loading updates…</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-muted animate-pulse"
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-5xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Latest Announcements</CardTitle>
          <CardDescription className="text-red-500">
            {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const AnnouncementCard = ({ item }: { item: AnnouncementItem }) => {
    const category = categories[item.category ?? "general"];
    const Icon = category.icon;

    return (
      <Card className="overflow-hidden rounded-2xl border bg-background hover:shadow-lg transition">
        <div className="grid md:grid-cols-[180px_1fr] gap-4">
          {item.image_url && (
            <div className="relative h-40 md:h-full">
              <img
                src={item.image_url}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          )}

          <div className="p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>

              <Badge
                className={`gap-1 rounded-full px-3 py-1 text-xs ${category.className}`}
              >
                <Icon className="h-3 w-3" />
                <span className="hidden sm:inline">
                  {category.label}
                </span>
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.content}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              {item.author && (
                <span className="text-xs text-muted-foreground">
                  By {item.author}
                </span>
              )}

              {item.cta_text && item.cta_link && (
                <Button size="sm" asChild>
                  <a
                    href={item.cta_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.cta_text}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl md:text-3xl">
          Latest Announcements
        </CardTitle>
        <CardDescription>
          Official updates and communications from the school
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="flex w-full overflow-x-auto justify-start gap-2">
            <TabsTrigger value="all">All</TabsTrigger>
            {Object.entries(categories).map(([key, c]) => (
              <TabsTrigger key={key} value={key}>
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-6 space-y-6">
            <AnimatePresence>
              {latest.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AnnouncementCard item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </TabsContent>

          {Object.keys(categories).map((key) => (
            <TabsContent
              key={key}
              value={key}
              className="mt-6 space-y-6"
            >
              {(grouped[key] || []).length ? (
                grouped[key].map((item) => (
                  <AnnouncementCard key={item.id} item={item} />
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No announcements available.
                </p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
