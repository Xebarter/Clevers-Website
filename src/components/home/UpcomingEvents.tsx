"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Event } from '@/app/admin/cmsService';

interface UpcomingEventsProps {
  events: Event[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  // Get category badge class
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'sports': return 'bg-green-100 text-green-800';
      case 'arts': return 'bg-purple-100 text-purple-800';
      case 'holiday': return 'bg-red-100 text-red-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'academic': return 'Academic';
      case 'sports': return 'Sports';
      case 'arts': return 'Arts';
      case 'holiday': return 'Holiday';
      case 'other': return 'Other';
      default: return category;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Display only the first 3 upcoming events
  const displayedEvents = events.slice(0, 3);

  if (displayedEvents.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Upcoming Events</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            There are no upcoming events scheduled at this time. Check back later for updates.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {displayedEvents.map((event) => (
        <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-0">
            <div className="relative">
              {event.imageUrl ? (
                <div className="h-48 w-full bg-gray-100 relative">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              ) : (
                <div className="h-48 w-full bg-gradient-to-br from-kinder-blue/20 via-kinder-green/20 to-transparent flex items-center justify-center">
                  <Calendar className="h-12 w-12 text-kinder-blue/40" />
                </div>
              )}

              <div className="absolute top-4 left-4">
                <Badge className={getCategoryBadgeClass(event.category)}>
                  {getCategoryLabel(event.category)}
                </Badge>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-xl font-heading drop-shadow-md">
                  {event.title}
                </h3>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-3 mb-4">
                <div className="flex items-start text-sm">
                  <Calendar className="h-4 w-4 mt-0.5 mr-2 text-kinder-blue" />
                  <div>
                    <span className="font-medium">Date: </span>
                    {formatDate(event.startDate)}
                    {new Date(event.startDate).toDateString() !== new Date(event.endDate).toDateString() && (
                      <> - {formatDate(event.endDate)}</>
                    )}
                  </div>
                </div>

                <div className="flex items-start text-sm">
                  <Clock className="h-4 w-4 mt-0.5 mr-2 text-kinder-blue" />
                  <div>
                    <span className="font-medium">Time: </span>
                    {formatTime(event.startDate)} - {formatTime(event.endDate)}
                  </div>
                </div>

                <div className="flex items-start text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 mr-2 text-kinder-blue" />
                  <div className="truncate max-w-[200px]">
                    <span className="font-medium">Location: </span>
                    {event.location}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 line-clamp-2 mb-4">
                {event.description}
              </p>

              <Button
                variant="ghost"
                className="px-0 text-kinder-blue hover:text-kinder-blue/80 hover:bg-transparent"
                asChild
              >
                <Link href={`/events/${event.id}`}>
                  Event Details <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UpcomingEvents;
