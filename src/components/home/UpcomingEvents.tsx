"use client"

import React, { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CalendarDays,
  Clock,
  MapPin,
  ArrowRight,
  ExternalLink,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { eventsService, type Event } from "../../../lib/supabase/services"

/* ----------------------------------
   Event Theme System
----------------------------------- */
const eventThemes = {
  academic: {
    label: "Academic",
    className:
      "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400",
  },
  sports: {
    label: "Sports",
    className:
      "text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400",
  },
  cultural: {
    label: "Cultural",
    className:
      "text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400",
  },
  holiday: {
    label: "Holiday",
    className:
      "text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400",
  },
  community: {
    label: "Community",
    className:
      "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400",
  },
}

type EventCategory = keyof typeof eventThemes

interface EventItem {
  id: string
  title: string
  description?: string
  start_date: string
  end_date?: string
  location?: string
  is_all_day?: boolean
  category: EventCategory
}

/* ----------------------------------
   Component
----------------------------------- */
const UpcomingEvents = () => {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const data = await eventsService.getAll()

        const upcoming = data
          .filter((e: Event) => new Date(e.start_date) >= today)
          .map((e: Event) => ({
            ...e,
            category:
              (e.category as EventCategory) ??
              ("academic" as EventCategory),
          }))
          .sort(
            (a, b) =>
              new Date(a.start_date).getTime() -
              new Date(b.start_date).getTime()
          )
          .slice(0, 4)

        setEvents(upcoming)
      } catch {
        setError("Unable to load upcoming events.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) return <EventSkeleton />
  if (error) return <ErrorState message={error} />

  return (
    <Card className="w-full bg-transparent border-none shadow-none">
      {/* Header */}
      <CardHeader className="px-0 pt-0 pb-10 flex flex-col md:flex-rowclmDmd:flex-row items-start md:items-end justify-between gap-4">
        <div className="space-y-2">
          <Badge
            variant="outline"
            className="uppercase tracking-widest text-[10px]"
          >
            Campus Life
          </Badge>
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            Upcoming Events
          </CardTitle>
          <CardDescription className="max-w-md">
            Key academic, cultural, and community activities on our calendar.
          </CardDescription>
        </div>

        <button
          type="button"
          className="hidden md:flex items-center gap-1 text-sm font-semibold text-primary hover:underline focus:outline-none"
        >
          View full calendar
          <ArrowRight className="h-4 w-4" />
        </button>
      </CardHeader>

      {/* Content */}
      <CardContent className="px-0">
        <AnimatePresence mode="popLayout">
          {events.length > 0 ? (
            <div className="grid gap-5">
              {events.map((event, index) => (
                <EventRow key={event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <EmptyEvents />
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

/* ----------------------------------
   Event Row
----------------------------------- */
const EventRow = ({
  event,
  index,
}: {
  event: EventItem
  index: number
}) => {
  const theme = eventThemes[event.category]
  const date = new Date(event.start_date)

  const timeLabel = event.is_all_day
    ? "All Day"
    : date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, ease: "easeOut" }}
      className="group flex flex-col md:flex-row gap-6 p-5 rounded-2xl border border-border/60 bg-card hover:shadow-lg transition"
    >
      <DateLeaf date={event.start_date} />

      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={`${theme.className} font-semibold`}
          >
            {theme.label}
          </Badge>

          {event.is_all_day && (
            <span className="flex items-center gap-1 text-[11px] font-bold uppercase text-muted-foreground">
              <Clock className="h-3 w-3" />
              All Day
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {!event.is_all_day && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {timeLabel}
            </span>
          )}

          {event.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {event.location}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        aria-label="View event details"
        className="self-end md:self-center rounded-full p-2 hover:bg-secondary transition focus:outline-none"
      >
        <ExternalLink className="h-5 w-5 text-muted-foreground" />
      </button>
    </motion.article>
  )
}

/* ----------------------------------
   Date Component
----------------------------------- */
const DateLeaf = ({ date }: { date: string }) => {
  const d = new Date(date)
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase()
  const day = d.getDate()

  return (
    <div className="flex flex-col items-center justify-center min-w-[64px] h-[72px] rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="w-full bg-primary py-1 text-[10px] font-bold text-primary-foreground text-center">
        {month}
      </div>
      <div className="text-2xl font-black">{day}</div>
    </div>
  )
}

/* ----------------------------------
   States
----------------------------------- */
const EventSkeleton = () => (
  <div className="space-y-6 py-12 max-w-4xl">
    <Skeleton className="h-10 w-56 mb-8" />
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-6 items-center">
        <Skeleton className="h-[72px] w-[64px] rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    ))}
  </div>
)

const EmptyEvents = () => (
  <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/30">
    <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
    <h3 className="text-lg font-bold">No upcoming events</h3>
    <p className="text-muted-foreground">
      Please check back soon for new activities.
    </p>
  </div>
)

const ErrorState = ({ message }: { message: string }) => (
  <div className="text-center py-20">
    <p className="text-sm font-semibold text-destructive">{message}</p>
  </div>
)

export default UpcomingEvents
