"use client";

import React, { useState, useEffect } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar-styles.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clock, Landmark } from "lucide-react";
import { client } from "@/lib/sanity/client";

type CalendarValue = Date | [Date, Date] | null;

type CalendarEvent = {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  category: "academic" | "exam" | "event";
  location?: string;
  time?: string;
  isImportant?: boolean;
};

const eventCategories = [
  { id: "academic", name: "Academic", color: "bg-blue-100 text-blue-700" },
  { id: "exam", name: "Exams", color: "bg-red-100 text-red-700" },
  { id: "event", name: "Events", color: "bg-green-100 text-green-700" },
];

export default function AcademicCalendarPage() {
  const [date, setDate] = useState<CalendarValue>(new Date());
  const [activeTab, setActiveTab] = useState<"all" | "academic" | "exam" | "event">("all");
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const query = `
          [
            ...*[_type == "event"]{
              _id,
              title,
              description,
              "startDate": date,
              "endDate": date,
              "category": type,
              location,
              time,
              isImportant
            },
            ...*[_type == "calendarEvent"]{
              _id,
              title,
              description,
              startDate,
              endDate,
              category,
              location,
              time,
              isImportant
            }
          ]
        `;
        const data = await client.fetch(query);
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    }

    fetchEvents();
  }, []);

  const handleDateChange: CalendarProps['onChange'] = (value) => {
    setDate(value as CalendarValue);
  };

  const handleTabChange = (value: string) => {
    if (value === "all" || value === "academic" || value === "exam" || value === "event") {
      setActiveTab(value);
    }
  };

  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;

    const hasCategoryEvent = (category: CalendarEvent["category"]) =>
      events.some(event =>
        event.category === category &&
        date >= new Date(new Date(event.startDate).setHours(0, 0, 0, 0)) &&
        (!event.endDate || date <= new Date(new Date(event.endDate).setHours(23, 59, 59, 999)))
      );

    const hasEvent = events.some(event => {
      const start = new Date(event.startDate).setHours(0, 0, 0, 0);
      const end = event.endDate
        ? new Date(event.endDate).setHours(23, 59, 59, 999)
        : start;
      return date >= new Date(start) && date <= new Date(end);
    });

    if (hasEvent) {
      if (hasCategoryEvent("academic") && hasCategoryEvent("exam") && hasCategoryEvent("event")) {
        return "has-multiple-events";
      }
      if (hasCategoryEvent("academic")) return "has-academic-event";
      if (hasCategoryEvent("exam")) return "has-exam-event";
      if (hasCategoryEvent("event")) return "has-school-event";
    }

    return null;
  };

  const getEventsForSelectedDate = () => {
    if (!date) return [];
    const selectedDate = Array.isArray(date) ? date[0] : date;

    return events.filter(event => {
      const start = new Date(event.startDate).setHours(0, 0, 0, 0);
      const end = event.endDate
        ? new Date(event.endDate).setHours(23, 59, 59, 999)
        : start;

      return selectedDate >= new Date(start) && selectedDate <= new Date(end);
    }).filter(event => activeTab === "all" || event.category === activeTab);
  };

  const getEventBadge = (category: string) => {
    const eventCategory = eventCategories.find(cat => cat.id === category);
    if (!eventCategory) return null;

    return (
      <Badge className={eventCategory.color}>
        {eventCategory.name}
      </Badge>
    );
  };

  const formatDateRange = (startDate: string, endDate?: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const start = new Date(startDate);
    if (!endDate) return start.toLocaleDateString('en-US', options);

    const end = new Date(endDate);
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

  const formatDisplayDate = (value: CalendarValue) => {
    if (!value) return "No date selected";
    if (Array.isArray(value)) {
      return `${value[0].toLocaleDateString()} - ${value[1].toLocaleDateString()}`;
    }
    return value.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Academic Calendar</h1>
        <p className="text-gray-600 mb-8">
          Stay informed about important dates, exams, and school events throughout the academic year.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Academic Calendar
            </CardTitle>
            <Tabs defaultValue="all" onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="all">All Events</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="exam">Exams</TabsTrigger>
                <TabsTrigger value="event">Events</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription>Click on dates to view events. Dates with events are highlighted.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Calendar
                onChange={handleDateChange}
                value={date}
                tileClassName={getTileClassName}
                className="w-full border rounded-md"
              />
            </div>
            <div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {formatDisplayDate(date)}
                  </CardTitle>
                  <CardDescription>
                    {getEventsForSelectedDate().length} event{getEventsForSelectedDate().length !== 1 ? 's' : ''} on this date
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {getEventsForSelectedDate().length === 0 ? (
                    <p className="text-gray-500 text-center p-4">No events on this date</p>
                  ) : (
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {getEventsForSelectedDate().map(event => (
                          <div key={event._id} className={`p-3 border rounded-md ${event.isImportant ? 'border-l-4 border-l-blue-500' : ''}`}>
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <h3 className="font-semibold">{event.title}</h3>
                              {getEventBadge(event.category)}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                            <div className="text-xs text-gray-500 space-y-1">
                              <div className="flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                {formatDateRange(event.startDate, event.endDate)}
                              </div>
                              {event.time && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {event.time}
                                </div>
                              )}
                              {event.location && (
                                <div className="flex items-center gap-1">
                                  <Landmark className="h-3 w-3" />
                                  {event.location}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
