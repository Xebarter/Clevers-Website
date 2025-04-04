"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Search,
  PlusCircle,
  Pencil,
  Trash2,
  Eye,
  ArrowUpDown,
  Clock,
  CheckCircle,
  XCircle,
  CalendarDays
} from "lucide-react";
import { useCms, Event } from '../../cmsService';

export default function EventsPage() {
  const { events, deleteEvent, updateEvent, isLoading } = useCms();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Event>('startDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  // Format date range for display
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const isSameDay = start.toDateString() === end.toDateString();

    if (isSameDay) {
      return `${formatDate(startDate)}, ${formatTime(startDate)} - ${formatTime(endDate)}`;
    } else {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
  };

  // Handle sorting
  const handleSort = (field: keyof Event) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort events
  const filteredEvents = events
    .filter(event =>
      (statusFilter === 'all' || event.status === statusFilter) &&
      (categoryFilter === 'all' || event.category === categoryFilter) &&
      (search === '' ||
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortDirection === 'asc') {
        return String(aValue).localeCompare(String(bValue));
      } else {
        return String(bValue).localeCompare(String(aValue));
      }
    });

  // Handle deletion of an event
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
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

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'ongoing': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'past': return <CalendarDays className="h-4 w-4 text-gray-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kinder-blue mx-auto"></div>
          <p className="mt-4 text-kinder-blue font-heading">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-kinder-blue flex items-center">
          <Calendar className="mr-2 h-6 w-6" />
          Events
        </h1>
        <p className="text-gray-600 font-body">
          Manage school events and activities that appear on the website calendar.
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-2 md:flex gap-4">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="past">Past</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="arts">Arts</SelectItem>
              <SelectItem value="holiday">Holiday</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Button asChild className="col-span-2 md:col-span-1">
            <Link href="/admin/content/events/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Event
            </Link>
          </Button>
        </div>
      </div>

      {/* Events Table */}
      <Card className="flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">All Events</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No events found</h3>
              <p className="text-gray-500 mb-4">
                {search || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? "Try adjusting your search or filters"
                  : "Create your first event to get started"}
              </p>
              {!search && statusFilter === 'all' && categoryFilter === 'all' && (
                <Button asChild>
                  <Link href="/admin/content/events/new">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Event
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Status</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('title')}>
                      <div className="flex items-center">
                        Event
                        {sortField === 'title' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('startDate')}>
                      <div className="flex items-center">
                        Date & Time
                        {sortField === 'startDate' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort('category')}>
                      <div className="flex items-center">
                        Category
                        {sortField === 'category' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {getStatusIcon(event.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[200px] hidden sm:block">
                            {event.description.length > 60
                              ? event.description.substring(0, 60) + '...'
                              : event.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDateRange(event.startDate, event.endDate)}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeClass(event.category)}`}>
                          {getCategoryLabel(event.category)}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm truncate max-w-[150px]">{event.location}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end items-center gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/content/events/${event.id}/preview`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Preview</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/content/events/${event.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(event.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
