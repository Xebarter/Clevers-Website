"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import {
  CalendarClock,
  Users,
  Megaphone,
  BookOpen,
  Award,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  announcementsService,
  type Announcement,
} from "../../../lib/supabase/services"

const categories = {
  general: {
    label: "General",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    accent: "bg-blue-500",
    icon: Megaphone,
  },
  academic: {
    label: "Academic",
    badge: "bg-green-50 text-green-700 border-green-200",
    accent: "bg-green-500",
    icon: BookOpen,
  },
  event: {
    label: "Events",
    badge: "bg-yellow-50 text-yellow-800 border-yellow-200",
    accent: "bg-yellow-500",
    icon: CalendarClock,
  },
  achievement: {
    label: "Achievements",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    accent: "bg-purple-500",
    icon: Award,
  },
  community: {
    label: "Community",
    badge: "bg-pink-50 text-pink-700 border-pink-200",
    accent: "bg-pink-500",
    icon: Users,
  },
} as const

type CategoryKey = keyof typeof categories

interface AnnouncementItem {
  id: string
  title: string
  content: string
  created_at: string
  category?: CategoryKey
  author?: string
  image_url?: string
  cta_text?: string
  cta_link?: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-UG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function AnnouncementImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative h-44 sm:h-48 md:h-full md:min-h-[180px] bg-gradient-to-br from-green-50 to-white shrink-0">
      {!loaded && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-white/95 via-green-50/95 to-white/95"
          aria-busy="true"
        >
          <div className="hero-spinner scale-75" role="status" aria-label="Loading image" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 180px"
        className="object-cover"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  )
}

function AnnouncementCard({ item }: { item: AnnouncementItem }) {
  const category = categories[item.category ?? "general"]
  const Icon = category.icon

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${category.accent}`} />

      <div className={`grid ${item.image_url ? "md:grid-cols-[200px_1fr]" : ""}`}>
        {item.image_url && (
          <AnnouncementImage src={item.image_url} alt={item.title} />
        )}

        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1.5 min-w-0 flex-1">
              <Badge
                variant="outline"
                className={`gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${category.badge}`}
              >
                <Icon className="h-3 w-3" />
                {category.label}
              </Badge>
              <h3 className="text-lg font-bold text-gray-900 leading-snug tracking-tight">
                {item.title}
              </h3>
            </div>

            <time
              dateTime={item.created_at}
              className="text-xs font-medium text-gray-400 whitespace-nowrap shrink-0"
            >
              {formatDate(item.created_at)}
            </time>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {item.content}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {item.author ? (
              <span className="text-xs text-gray-400">By {item.author}</span>
            ) : (
              <span />
            )}

            {item.cta_text && item.cta_link && (
              <Button
                size="sm"
                variant="outline"
                asChild
                className="rounded-lg border-gray-200 text-gray-700 hover:bg-gray-50"
              >
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
    </article>
  )
}

function LoadingState() {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex justify-center py-8">
        <div className="flex flex-col items-center gap-3">
          <div className="hero-spinner" role="status" aria-label="Loading announcements" />
          <p className="text-sm font-medium text-green-700/70 tracking-wide">
            Loading announcements...
          </p>
        </div>
      </div>
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="h-28 rounded-2xl bg-white/60 border border-gray-100 animate-pulse"
        />
      ))}
    </div>
  )
}

export default function AnnouncementBoard() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await announcementsService.getAll()
        const normalized = data.map((item: Announcement) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          created_at: item.created_at ?? new Date().toISOString(),
          category: (item.category as CategoryKey) ?? "general",
          author: item.author,
          image_url: item.image_url,
          cta_text: item.cta_text,
          cta_link: item.cta_link,
        }))
        setAnnouncements(normalized)
      } catch {
        setError("Unable to load announcements.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const grouped = announcements.reduce<Record<string, AnnouncementItem[]>>(
    (acc, a) => {
      const key = a.category ?? "general"
      acc[key] = acc[key] || []
      acc[key].push(a)
      return acc
    },
    {}
  )

  const latest = [...announcements]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5)

  if (loading) return <LoadingState />

  if (error) {
    return (
      <div className="max-w-4xl mx-auto rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    )
  }

  const availableCategories = Object.keys(categories).filter(
    (key) => (grouped[key] || []).length > 0
  )

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex justify-center overflow-x-auto pb-1">
          <TabsList className="h-auto bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl border border-pink-100 shadow-sm gap-1 flex-wrap justify-center">
            <TabsTrigger
              value="all"
              className="rounded-xl px-4 sm:px-5 py-2 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-pink-600"
            >
              All Updates
            </TabsTrigger>
            {availableCategories.map((key) => {
              const c = categories[key as CategoryKey]
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="rounded-xl px-4 sm:px-5 py-2 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  {c.label}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0 space-y-4 focus-visible:outline-none">
          {latest.length > 0 ? (
            latest.map((item) => (
              <AnnouncementCard key={item.id} item={item} />
            ))
          ) : (
            <EmptyState />
          )}
        </TabsContent>

        {availableCategories.map((key) => (
          <TabsContent
            key={key}
            value={key}
            className="mt-0 space-y-4 focus-visible:outline-none"
          >
            {(grouped[key] || []).map((item) => (
              <AnnouncementCard key={item.id} item={item} />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white/60 py-14 text-center">
      <Megaphone className="w-10 h-10 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500 font-medium">No announcements at this time.</p>
      <p className="text-sm text-gray-400 mt-1">Check back soon for school updates.</p>
    </div>
  )
}
