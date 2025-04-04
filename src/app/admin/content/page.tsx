"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Megaphone,
  Calendar,
  FileText,
  Edit,
  PlusCircle,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { useCms } from '../cmsService';

export default function ContentPage() {
  const { announcements, events, pages, isLoading } = useCms();

  // Calculate content statistics
  const getPublishedAnnouncementsCount = () => {
    return announcements.filter(ann => ann.status === 'published').length;
  };

  const getUpcomingEventsCount = () => {
    return events.filter(evt => evt.status === 'upcoming').length;
  };

  const getPublishedPagesCount = () => {
    return pages.filter(page => page.isPublished).length;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kinder-blue mx-auto"></div>
          <p className="mt-4 text-kinder-blue font-heading">Loading content management system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-kinder-blue flex items-center">
          <Edit className="mr-2 h-6 w-6" />
          Content Management
        </h1>
        <p className="text-gray-600 font-body">
          Manage your website content, including announcements, events, and web pages.
        </p>
      </div>

      {/* Content Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-kinder-blue/10 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-kinder-blue">
              <Megaphone className="h-5 w-5" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-3xl font-bold font-heading">{announcements.length}</p>
                <p className="text-sm text-gray-500 font-body">Total</p>
              </div>
              <div>
                <p className="text-3xl font-bold font-heading text-green-600">{getPublishedAnnouncementsCount()}</p>
                <p className="text-sm text-gray-500 font-body">Published</p>
              </div>
            </div>
            <div className="space-y-1 mb-4">
              {announcements.slice(0, 2).map((announcement) => (
                <div key={announcement.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <p className="text-sm font-medium truncate max-w-[200px]">{announcement.title}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    announcement.status === 'published' ? 'bg-green-100 text-green-800' :
                    announcement.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {announcement.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Button asChild size="sm" variant="default" className="flex-1">
                <Link href="/admin/content/announcements/new">
                  <PlusCircle className="h-4 w-4 mr-1" /> New
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="flex-1">
                <Link href="/admin/content/announcements">
                  Manage <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-kinder-green/10 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-kinder-green">
              <Calendar className="h-5 w-5" />
              Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-3xl font-bold font-heading">{events.length}</p>
                <p className="text-sm text-gray-500 font-body">Total</p>
              </div>
              <div>
                <p className="text-3xl font-bold font-heading text-kinder-blue">{getUpcomingEventsCount()}</p>
                <p className="text-sm text-gray-500 font-body">Upcoming</p>
              </div>
            </div>
            <div className="space-y-1 mb-4">
              {events.slice(0, 2).map((event) => (
                <div key={event.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">{event.title}</p>
                    <p className="text-xs text-gray-500">{formatDate(event.startDate)}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                    event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Button asChild size="sm" variant="default" className="flex-1">
                <Link href="/admin/content/events/new">
                  <PlusCircle className="h-4 w-4 mr-1" /> New
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="flex-1">
                <Link href="/admin/content/events">
                  Manage <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-kinder-red/10 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-kinder-red">
              <FileText className="h-5 w-5" />
              Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-3xl font-bold font-heading">{pages.length}</p>
                <p className="text-sm text-gray-500 font-body">Total</p>
              </div>
              <div>
                <p className="text-3xl font-bold font-heading text-green-600">{getPublishedPagesCount()}</p>
                <p className="text-sm text-gray-500 font-body">Published</p>
              </div>
            </div>
            <div className="space-y-1 mb-4">
              {pages.slice(0, 2).map((page) => (
                <div key={page.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">{page.title}</p>
                    <p className="text-xs text-gray-500">{formatDate(page.lastUpdated)}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    page.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {page.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Button asChild size="sm" variant="default" className="flex-1">
                <Link href="/admin/content/pages/new">
                  <PlusCircle className="h-4 w-4 mr-1" /> New
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="flex-1">
                <Link href="/admin/content/pages">
                  Manage <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Tips */}
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-kinder-blue">
            <AlertCircle className="h-5 w-5" />
            Content Management Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="text-kinder-blue">•</div>
              <p className="text-gray-700 font-body">
                <span className="font-medium">Announcements</span> are short-term notices and news updates for parents and visitors.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="text-kinder-blue">•</div>
              <p className="text-gray-700 font-body">
                <span className="font-medium">Events</span> are scheduled activities that can be displayed on the school calendar.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="text-kinder-blue">•</div>
              <p className="text-gray-700 font-body">
                <span className="font-medium">Pages</span> are full web pages that can be added to your website's navigation.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="text-kinder-blue">•</div>
              <p className="text-gray-700 font-body">
                All content can be previewed before publishing to ensure it appears correctly on the website.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-kinder-blue">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/admin/content/announcements">
                <Megaphone className="h-4 w-4 mr-2" />
                Manage Announcements
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/admin/content/events">
                <Calendar className="h-4 w-4 mr-2" />
                Manage Events
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/admin/content/pages">
                <FileText className="h-4 w-4 mr-2" />
                Manage Pages
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
