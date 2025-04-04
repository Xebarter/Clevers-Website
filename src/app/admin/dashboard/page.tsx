"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  ClipboardList,
  Users,
  School,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Megaphone,
  Calendar,
  FileText,
  Edit
} from "lucide-react";
import { useApplications } from '../applicationService';
import { useCms } from '../cmsService';

export default function DashboardPage() {
  const { applications, isLoading: isLoadingApps } = useApplications();
  const { announcements, events, pages, isLoading: isLoadingCms } = useCms();

  // Calculate application statistics
  const calculateStats = () => {
    if (!applications.length) return { total: 0, pending: 0, approved: 0, rejected: 0, waitlisted: 0 };

    const stats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      waitlisted: applications.filter(app => app.status === 'waitlisted').length,
    };

    return stats;
  };

  // Calculate CMS statistics
  const calculateCmsStats = () => {
    return {
      publishedAnnouncements: announcements.filter(a => a.status === 'published').length,
      upcomingEvents: events.filter(e => e.status === 'upcoming').length,
      publishedPages: pages.filter(p => p.isPublished).length,
    };
  };

  // Calculate campus distribution
  const calculateCampusDistribution = () => {
    if (!applications.length) return { kitintale: 0, kasokoso: 0, maganjo: 0 };

    const distribution = {
      kitintale: applications.filter(app => app.campusPreference.campus === 'kitintale').length,
      kasokoso: applications.filter(app => app.campusPreference.campus === 'kasokoso').length,
      maganjo: applications.filter(app => app.campusPreference.campus === 'maganjo').length,
    };

    return distribution;
  };

  // Get recent applications (last 5)
  const getRecentApplications = () => {
    if (!applications.length) return [];

    return [...applications]
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 5);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'approved': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      case 'waitlisted': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'waitlisted': return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const stats = calculateStats();
  const cmsStats = calculateCmsStats();
  const campusDistribution = calculateCampusDistribution();
  const recentApplications = getRecentApplications();

  if (isLoadingApps || isLoadingCms) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kinder-blue mx-auto"></div>
          <p className="mt-4 text-kinder-blue font-heading">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-kinder-blue flex items-center">
          <BarChart className="mr-2 h-6 w-6" />
          Admin Dashboard
        </h1>
        <p className="text-gray-600 font-body">
          Welcome back, admin! Here's an overview of applications and content.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-kinder-blue">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 font-body">Total Applications</p>
              <p className="text-2xl font-bold font-heading text-kinder-blue">{stats.total}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-kinder-blue/10 flex items-center justify-center text-kinder-blue">
              <ClipboardList className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 font-body">Pending</p>
              <p className="text-2xl font-bold font-heading text-yellow-600">{stats.pending}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 font-body">Approved</p>
              <p className="text-2xl font-bold font-heading text-green-600">{stats.approved}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 font-body">Rejected</p>
              <p className="text-2xl font-bold font-heading text-red-600">{stats.rejected}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <XCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CMS Stats - New Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold font-heading text-kinder-blue flex items-center mb-4">
          <Edit className="mr-2 h-5 w-5" />
          Content Management
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-kinder-blue/5 to-white">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500 font-body">Active Announcements</p>
                <p className="text-2xl font-bold font-heading text-kinder-blue">{cmsStats.publishedAnnouncements}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-kinder-blue/10 flex items-center justify-center text-kinder-blue">
                <Megaphone className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-kinder-green/5 to-white">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500 font-body">Upcoming Events</p>
                <p className="text-2xl font-bold font-heading text-kinder-green">{cmsStats.upcomingEvents}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-kinder-green/10 flex items-center justify-center text-kinder-green">
                <Calendar className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-kinder-red/5 to-white">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500 font-body">Published Pages</p>
                <p className="text-2xl font-bold font-heading text-kinder-red">{cmsStats.publishedPages}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-kinder-red/10 flex items-center justify-center text-kinder-red">
                <FileText className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Campus Distribution */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-heading">Campus Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium font-body">Kitintale Campus</p>
                  <p className="text-sm font-bold font-body text-kinder-blue">{campusDistribution.kitintale}</p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-kinder-blue h-2.5 rounded-full"
                    style={{ width: `${stats.total ? (campusDistribution.kitintale / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium font-body">Kasokoso Campus</p>
                  <p className="text-sm font-bold font-body text-kinder-red">{campusDistribution.kasokoso}</p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-kinder-red h-2.5 rounded-full"
                    style={{ width: `${stats.total ? (campusDistribution.kasokoso / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium font-body">Maganjo Campus</p>
                  <p className="text-sm font-bold font-body text-kinder-green">{campusDistribution.maganjo}</p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-kinder-green h-2.5 rounded-full"
                    style={{ width: `${stats.total ? (campusDistribution.maganjo / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
                asChild
              >
                <Link href="/admin/applications">
                  View All Applications
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-heading">Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {recentApplications.length === 0 ? (
              <div className="text-center py-6">
                <ClipboardList className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 font-body">No applications yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <Link
                    key={application.id}
                    href={`/admin/applications/${application.id}`}
                    className="block"
                  >
                    <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 font-body">{application.student.firstName} {application.student.lastName}</p>
                          <p className="text-sm text-gray-500 font-body">{application.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 font-body">{formatDate(application.submittedAt)}</p>
                        <p className="text-xs font-body">
                          <span className={`${getStatusColor(application.status)} capitalize`}>
                            {application.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-kinder-blue hover:text-kinder-blue/80 hover:bg-kinder-blue/5"
                  asChild
                >
                  <Link href="/admin/applications">
                    View All Applications
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats & Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-3 text-kinder-purple" />
            <h3 className="text-lg font-bold font-heading text-kinder-purple mb-1">Waitlisted</h3>
            <p className="text-3xl font-bold font-heading">{stats.waitlisted}</p>
            <p className="text-sm text-gray-500 font-body mt-2">Students on the waitlist</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <School className="h-8 w-8 mx-auto mb-3 text-kinder-green" />
            <h3 className="text-lg font-bold font-heading text-kinder-green mb-1">Acceptance Rate</h3>
            <p className="text-3xl font-bold font-heading">
              {stats.total ? Math.round((stats.approved / stats.total) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-500 font-body mt-2">Application approval rate</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold font-heading text-kinder-blue mb-4">Quick Actions</h3>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="gap-2 justify-start"
                asChild
              >
                <Link href="/admin/applications?status=pending">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  Review Applications
                </Link>
              </Button>

              <Button
                variant="outline"
                className="gap-2 justify-start"
                asChild
              >
                <Link href="/admin/content">
                  <Edit className="h-4 w-4 text-kinder-blue" />
                  Manage Content
                </Link>
              </Button>

              <Button
                variant="outline"
                className="gap-2 justify-start"
                asChild
              >
                <Link href="/admin/content/announcements/new">
                  <Megaphone className="h-4 w-4 text-kinder-red" />
                  New Announcement
                </Link>
              </Button>

              <Button
                variant="outline"
                className="gap-2 justify-start"
                asChild
              >
                <Link href="/admin/content/events/new">
                  <Calendar className="h-4 w-4 text-kinder-green" />
                  Add Event
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
