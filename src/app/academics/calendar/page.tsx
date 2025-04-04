"use client";

import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
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
import {
  ArrowRight,
  CalendarDays,
  GraduationCap,
  PartyPopper,
  PencilLine,
  Clock,
  Landmark,
} from "lucide-react";
import type { OnArgs, Value } from 'react-calendar';

// Define a proper interface for the event type
interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  date: Date;
  category: "academic" | "exam" | "event";
  location?: string;
  time?: string;
  endDate?: Date;
}

// Define event categories
const eventCategories = [
  { id: "academic", name: "Academic", color: "bg-blue-100 text-blue-700" },
  { id: "exam", name: "Exams", color: "bg-red-100 text-red-700" },
  { id: "event", name: "Events", color: "bg-green-100 text-green-700" },
];

// Sample event data
const schoolEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Term 1 Begins",
    description: "First day of Term 1 for all students.",
    date: new Date("2025-01-13"),
    category: "academic",
    location: "All Campuses",
  },
  {
    id: 2,
    title: "Parent-Teacher Meeting",
    description: "First parent-teacher meeting of the year.",
    date: new Date("2025-02-15"),
    time: "14:00 - 17:00",
    category: "academic",
    location: "Main Hall",
  },
  {
    id: 3,
    title: "Mid-Term Break",
    description: "Mid-term break for all students.",
    date: new Date("2025-02-24"),
    endDate: new Date("2025-03-02"),
    category: "academic",
  },
  {
    id: 4,
    title: "Mid-Term Exams",
    description: "Mid-term exams for all grades.",
    date: new Date("2025-02-17"),
    endDate: new Date("2025-02-21"),
    category: "exam",
    location: "Examination Halls",
  },
  {
    id: 5,
    title: "Term 1 Ends",
    description: "Last day of Term 1.",
    date: new Date("2025-04-04"),
    category: "academic",
  },
  {
    id: 6,
    title: "Term 1 Holiday",
    description: "Holiday between Term 1 and Term 2.",
    date: new Date("2025-04-05"),
    endDate: new Date("2025-05-04"),
    category: "academic",
  },
  {
    id: 7,
    title: "Sports Day",
    description: "Annual inter-house sports competition.",
    date: new Date("2025-03-20"),
    time: "09:00 - 16:00",
    category: "event",
    location: "Sports Grounds",
  },
  {
    id: 8,
    title: "Term 2 Begins",
    description: "First day of Term 2 for all students.",
    date: new Date("2025-05-05"),
    category: "academic",
    location: "All Campuses",
  },
  {
    id: 9,
    title: "Career Day",
    description: "Professionals from various fields visit to inspire students.",
    date: new Date("2025-05-30"),
    time: "10:00 - 15:00",
    category: "event",
    location: "Auditorium",
  },
  {
    id: 10,
    title: "Mid-Term Break",
    description: "Mid-term break for all students.",
    date: new Date("2025-06-19"),
    endDate: new Date("2025-06-23"),
    category: "academic",
  },
  {
    id: 11,
    title: "Term 2 Exams",
    description: "End of Term 2 examinations.",
    date: new Date("2025-07-21"),
    endDate: new Date("2025-08-01"),
    category: "exam",
    location: "Examination Halls",
  },
  {
    id: 12,
    title: "Term 2 Ends",
    description: "Last day of Term 2.",
    date: new Date("2025-08-08"),
    category: "academic",
  },
  {
    id: 13,
    title: "Term 2 Holiday",
    description: "Holiday between Term 2 and Term 3.",
    date: new Date("2025-08-09"),
    endDate: new Date("2025-09-07"),
    category: "academic",
  },
  {
    id: 14,
    title: "Term 3 Begins",
    description: "First day of Term 3 for all students.",
    date: new Date("2025-09-08"),
    category: "academic",
    location: "All Campuses",
  },
  {
    id: 15,
    title: "Cultural Day",
    description: "Celebration of diverse cultures through performances, exhibitions, and food.",
    date: new Date("2025-09-26"),
    time: "10:00 - 16:00",
    category: "event",
    location: "School Grounds",
  },
  {
    id: 16,
    title: "Mid-Term Break",
    description: "Mid-term break for all students.",
    date: new Date("2025-10-20"),
    endDate: new Date("2025-10-24"),
    category: "academic",
  },
  {
    id: 17,
    title: "Annual Music Concert",
    description: "Showcase of musical talents from all campuses.",
    date: new Date("2025-11-08"),
    time: "18:00 - 20:00",
    category: "event",
    location: "Auditorium",
  },
  {
    id: 18,
    title: "Final Exams",
    description: "End of year examinations for all grades.",
    date: new Date("2025-11-24"),
    endDate: new Date("2025-12-05"),
    category: "exam",
    location: "Examination Halls",
  },
  {
    id: 19,
    title: "Term 3 Ends",
    description: "Last day of Term 3 and academic year.",
    date: new Date("2025-12-12"),
    category: "academic",
  },
  {
    id: 20,
    title: "Graduation Ceremony",
    description: "Graduation ceremony for P7 and S6 students.",
    date: new Date("2025-12-10"),
    time: "10:00 - 13:00",
    category: "event",
    location: "Main Hall",
  },
];

// Create a non-readonly copy for useState
const mutableEvents = [...schoolEvents];

export default function AcademicCalendarPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<"all" | "academic" | "exam" | "event">("all");
  const [visibleEvents, setVisibleEvents] = useState<CalendarEvent[]>(mutableEvents);

  // Create a handler specifically typed for the Calendar component
  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setDate(value);
    }
  };

  // Handler for tab changes that ensures type safety
  const handleTabChange = (value: string) => {
    if (value === "all" || value === "academic" || value === "exam" || value === "event") {
      setActiveTab(value as "all" | "academic" | "exam" | "event");
    }
  };

  useEffect(() => {
    if (activeTab === "all") {
      setVisibleEvents(mutableEvents);
    } else {
      setVisibleEvents(mutableEvents.filter(event => event.category === activeTab));
    }
  }, [activeTab]);

  // Function to get class for date tiles based on events
  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;

    const hasEvent = mutableEvents.some(
      event =>
        date.getDate() === new Date(event.date).getDate() &&
        date.getMonth() === new Date(event.date).getMonth() &&
        date.getFullYear() === new Date(event.date).getFullYear()
    );

    const hasAcademicEvent = mutableEvents.some(
      event =>
        event.category === "academic" &&
        date.getDate() === new Date(event.date).getDate() &&
        date.getMonth() === new Date(event.date).getMonth() &&
        date.getFullYear() === new Date(event.date).getFullYear()
    );

    const hasExamEvent = mutableEvents.some(
      event =>
        event.category === "exam" &&
        date.getDate() === new Date(event.date).getDate() &&
        date.getMonth() === new Date(event.date).getMonth() &&
        date.getFullYear() === new Date(event.date).getFullYear()
    );

    const hasSchoolEvent = mutableEvents.some(
      event =>
        event.category === "event" &&
        date.getDate() === new Date(event.date).getDate() &&
        date.getMonth() === new Date(event.date).getMonth() &&
        date.getFullYear() === new Date(event.date).getFullYear()
    );

    if (hasEvent) {
      if (hasAcademicEvent && hasExamEvent && hasSchoolEvent) {
        return "has-multiple-events";
      }
      if (hasAcademicEvent) {
        return "has-academic-event";
      }
      if (hasExamEvent) {
        return "has-exam-event";
      }
      if (hasSchoolEvent) {
        return "has-school-event";
      }
    }

    return null;
  };

  // Function to get events for the selected date
  const getEventsForSelectedDate = () => {
    return mutableEvents.filter(event => {
      const eventDate = new Date(event.date);

      // For single day events
      if (!event.endDate) {
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      }

      // For multi-day events
      const eventEndDate = new Date(event.endDate);
      return date >= eventDate && date <= eventEndDate;
    }).filter(event => activeTab === "all" || event.category === activeTab);
  };

  // Function to render event badge based on category
  const getEventBadge = (category: string) => {
    const eventCategory = eventCategories.find(cat => cat.id === category);
    if (!eventCategory) return null;

    return (
      <Badge className={eventCategory.color}>
        {eventCategory.name}
      </Badge>
    );
  };

  // Format date range for display
  const formatDateRange = (startDate: Date, endDate?: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };

    if (!endDate) {
      return startDate.toLocaleDateString('en-US', options);
    }

    const startStr = startDate.toLocaleDateString('en-US', options);
    const endStr = endDate.toLocaleDateString('en-US', options);

    return `${startStr} - ${endStr}`;
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

            <Tabs defaultValue="all" onValueChange={handleTabChange} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All Events</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="exam">Exams</TabsTrigger>
                <TabsTrigger value="event">Events</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription>
            Click on dates to view events. Dates with events are highlighted.
          </CardDescription>
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
                    {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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
                          <div
                            key={event.id}
                            className="p-3 border rounded-md"
                          >
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <h3 className="font-semibold">{event.title}</h3>
                              {getEventBadge(event.category)}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                            <div className="text-xs text-gray-500 space-y-1">
                              <div className="flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                {formatDateRange(event.date, event.endDate)}
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
