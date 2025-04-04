"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, Pencil, CheckCircle, Clock, Archive, Calendar } from "lucide-react";
import { useCms, Announcement } from '../../../../cmsService';
import Link from 'next/link';

export default function AnnouncementPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const { announcements, isLoading } = useCms();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const announcementId = params.id as string;

  useEffect(() => {
    if (!isLoading && announcements.length > 0) {
      const foundAnnouncement = announcements.find(a => a.id === announcementId);
      if (foundAnnouncement) {
        setAnnouncement(foundAnnouncement);
      } else {
        // Handle announcement not found
        router.push('/admin/content/announcements');
      }
    }
  }, [isLoading, announcements, announcementId, router]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'draft': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'archived': return <Archive className="h-4 w-4 text-gray-600" />;
      default: return null;
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading || !announcement) {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="mr-2"
              onClick={() => router.push('/admin/content/announcements')}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Announcements
            </Button>
            <h1 className="text-2xl font-bold font-heading text-kinder-blue flex items-center">
              <Eye className="mr-2 h-6 w-6" />
              Announcement Preview
            </h1>
          </div>
          <Skeleton className="h-4 w-48 mt-2" />
        </div>

        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2"
            onClick={() => router.push('/admin/content/announcements')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Announcements
          </Button>
          <h1 className="text-2xl font-bold font-heading text-kinder-blue flex items-center">
            <Eye className="mr-2 h-6 w-6" />
            Announcement Preview
          </h1>
        </div>
        <p className="text-gray-600 font-body mt-2">
          This is how your announcement will appear on the website.
        </p>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className={getStatusBadgeClass(announcement.status)}>
            <span className="flex items-center gap-1">
              {getStatusIcon(announcement.status)}
              {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
            </span>
          </Badge>
          {announcement.isImportant && (
            <Badge className="bg-red-100 text-red-800">Important</Badge>
          )}
        </div>
        <Button variant="outline" size="sm" asChild className="gap-1">
          <Link href={`/admin/content/announcements/${announcement.id}/edit`}>
            <Pencil className="h-4 w-4" />
            Edit Announcement
          </Link>
        </Button>
      </div>

      {/* Preview in admin dashboard style */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Admin Dashboard Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">{announcement.title}</h3>
              <Badge className={getStatusBadgeClass(announcement.status)}>
                {announcement.status}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <Calendar className="h-4 w-4 mr-1" />
              Published: {formatDate(announcement.publishDate)}
              {announcement.expiryDate && (
                <span className="ml-3">Expires: {formatDate(announcement.expiryDate)}</span>
              )}
            </div>
            <p className="text-gray-700 whitespace-pre-line">{announcement.content}</p>
            <div className="mt-3 text-sm text-gray-500">
              Posted by {announcement.author}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview as it would appear on the website */}
      <Card className="flex-1">
        <CardHeader className="pb-2">
          <CardTitle>Website Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-3xl mx-auto">
            <div className={`p-6 rounded-xl shadow-md ${announcement.isImportant ? 'border-l-4 border-red-500 bg-red-50' : 'bg-white'}`}>
              <div className="flex justify-between items-start mb-3">
                <h1 className={`text-2xl font-bold ${announcement.isImportant ? 'text-red-800' : 'text-kinder-blue'}`}>
                  {announcement.title}
                </h1>
                {announcement.isImportant && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Important
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-500 mb-4 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(announcement.publishDate)}
              </div>

              <div className="prose max-w-none">
                <div className="text-gray-700 whitespace-pre-line text-lg leading-relaxed mb-6">
                  {announcement.content}
                </div>
              </div>

              <div className="flex justify-between items-center text-sm mt-6 pt-4 border-t border-gray-100">
                <span className="text-gray-500">
                  Posted by Clevers' Origin Schools
                </span>
                {announcement.expiryDate && (
                  <span className="text-gray-500">
                    Expires on {formatDate(announcement.expiryDate)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
