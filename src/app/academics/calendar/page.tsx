"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, Filter, Search } from "lucide-react";
import { eventsService, type Event } from "../../../../lib/supabase/services";

// Event categories and styling (consistent with UpcomingEvents component)
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
};

type EventCategory = keyof typeof eventThemes;

interface EventItem extends Event {
  category: EventCategory;
}

const CalendarPage = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventsService.getAll();

        // Map and sort events by start date
        const mappedEvents = data
          .map((event: any) => ({
            ...event,
            category: (event.category as EventCategory) || "academic",
          }))
          .sort(
            (a, b) =>
              new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
          );

        setEvents(mappedEvents);
        setFilteredEvents(mappedEvents);
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Unable to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Apply filters when selected category or search query changes
  useEffect(() => {
    let result = events;

    // Filter by category if selected
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(event => event.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        event =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          (event.location && event.location.toLowerCase().includes(query))
      );
    }

    setFilteredEvents(result);
  }, [selectedCategory, searchQuery, events]);

  // Get unique categories for filter
  const categories = Array.from(
    new Set(events.map((event: EventItem) => event.category))
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString: string, isAllDay?: boolean) => {
    if (isAllDay) return "All Day";
    
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format month and day for date block
  const formatMonthDay = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const day = date.getDate();
    return { month, day };
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">School Calendar</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay updated with all upcoming events and important dates
            </p>
          </div>
          
          <div className="animate-pulse space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-6 p-6 border rounded-xl">
                <div className="w-16 h-20 rounded-xl bg-gray-200"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="flex gap-4 mt-2">
                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                    <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center py-12">
          <div className="text-red-500 text-xl font-semibold">Error Loading Events</div>
          <p className="mt-2 text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">School Calendar</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with all upcoming events and important dates across our campuses
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="hidden md:flex items-center gap-2">
                  <Filter className="text-gray-400 h-4 w-4" />
                  <select
                    className="py-2 px-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    value={selectedCategory || "all"}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {eventThemes[category].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    !selectedCategory
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      selectedCategory === category
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {eventThemes[category].label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="space-y-6">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <CalendarDays className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchQuery || selectedCategory
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "Check back later for upcoming events and activities."}
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const { month, day } = formatMonthDay(event.start_date);
              const theme = eventThemes[event.category];
              
              return (
                <Card key={event.id} className="border border-border/60 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Date block */}
                      <div className="flex flex-col items-center justify-center min-w-[72px] h-[80px] rounded-xl border bg-card shadow-sm overflow-hidden">
                        <div className="w-full bg-primary py-1 text-[10px] font-bold text-primary-foreground text-center uppercase">
                          {month}
                        </div>
                        <div className="text-2xl font-black">{day}</div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                          <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                            {event.title}
                          </h3>
                          <Badge className={theme.className}>
                            {theme.label}
                          </Badge>
                        </div>

                        <p className="text-gray-700 mb-4">{event.description}</p>

                        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="h-4 w-4" />
                            <span>{formatDate(event.start_date)}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(event.start_date, event.is_all_day)}</span>
                          </div>

                          {event.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>All events are displayed in your local time zone</p>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;