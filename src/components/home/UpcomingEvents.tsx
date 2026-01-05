"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { eventsService, type Event } from "../../../lib/supabase/services";

// Define event types and their corresponding colors
const eventTypes = {
  academic: { label: "Academic", color: "bg-green-100 text-green-800 hover:bg-green-200" },
  sports: { label: "Sports", color: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
  cultural: { label: "Cultural", color: "bg-purple-100 text-purple-800 hover:bg-purple-200" },
  holiday: { label: "Holiday", color: "bg-red-100 text-red-800 hover:bg-red-200" },
  community: { label: "Community", color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
};

// Updated interface to match Supabase schema
interface EventItem {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  location?: string;
  is_all_day?: boolean;
  category?: keyof typeof eventTypes;
}

const UpcomingEvents = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString();
        const data = await eventsService.getAll();
        
        // Filter events to only include upcoming ones
        const upcomingEvents = data.filter((event: Event) => 
          new Date(event.start_date) >= new Date(today)
        );
        
        // Convert Supabase data to match component expectations
        const convertedData = upcomingEvents.map((item: Event) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          start_date: item.start_date,
          end_date: item.end_date,
          location: item.location,
          is_all_day: item.is_all_day,
          category: item.category as keyof typeof eventTypes || 'academic'
        }));
        
        // Sort by date and limit to 3 events
        const sortedEvents = convertedData
          .sort((a: EventItem, b: EventItem) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
          .slice(0, 3);
          
        setEvents(sortedEvents);
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <CalendarDays className="mr-2 h-6 w-6" />
            Upcoming Events
          </CardTitle>
          <CardDescription className="text-center">Loading events...</CardDescription>
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
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <CalendarDays className="mr-2 h-6 w-6" />
            Upcoming Events
          </CardTitle>
          <CardDescription className="text-center text-red-500">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4">Unable to load events at this time.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
          <CalendarDays className="mr-2 h-6 w-6" />
          Upcoming Events
        </CardTitle>
        <CardDescription className="text-center">Mark your calendars for these exciting events</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <div className="space-y-6">
            {events.map((event) => {
              const eventType = event.category || 'academic';
              const eventTypeData = eventTypes[eventType] || eventTypes.academic;
              
              const eventDate = new Date(event.start_date);
              const formattedDate = eventDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
              
              const formattedTime = event.is_all_day 
                ? 'All Day' 
                : eventDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  });

              return (
                <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{event.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <CalendarDays className="mr-1.5 h-4 w-4" />
                          {formattedDate}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="mr-1.5 h-4 w-4" />
                          {formattedTime}
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="mr-1.5 h-4 w-4" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Badge className={eventTypeData.color}>
                      {eventTypeData.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No upcoming events</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Check back later for upcoming events.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;