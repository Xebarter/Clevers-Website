"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { client } from "@/sanity/lib/client";

// Define event types and their corresponding colors
const eventTypes = {
  academic: { label: "Academic", color: "bg-green-100 text-green-800 hover:bg-green-200" },
  sports: { label: "Sports", color: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
  cultural: { label: "Cultural", color: "bg-purple-100 text-purple-800 hover:bg-purple-200" },
  holiday: { label: "Holiday", color: "bg-red-100 text-red-800 hover:bg-red-200" },
  community: { label: "Community", color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
};

// Updated interface to match Sanity schema
interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: keyof typeof eventTypes;
}

const UpcomingEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from Sanity
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const query = `*[_type == "event" && date >= $today] | order(date asc) {
          _id,
          title,
          description,
          date,
          time,
          location,
          type
        }`;
        
        const data = await client.fetch(query, { today });
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Format date to a more readable format
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading upcoming events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>No upcoming events scheduled.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.map((event) => (
        <Card key={event._id} className="school-card hover:shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>{event.title}</CardTitle>
              <Badge className={eventTypes[event.type].color}>
                {eventTypes[event.type].label}
              </Badge>
            </div>
            <CardDescription>
              {event.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 pt-2">
              <div className="flex items-center text-sm text-gray-600">
                <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
                {formatDate(event.date)}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                {event.time}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                {event.location}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UpcomingEvents;