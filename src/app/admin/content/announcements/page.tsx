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
  Megaphone,
  Search,
  PlusCircle,
  Pencil,
  Trash2,
  Eye,
  ArrowUpDown,
  CheckCircle,
  Clock,
  Archive
} from "lucide-react";
import { useCms, Announcement } from '../../cmsService';

export default function AnnouncementsPage() {
  const { announcements, deleteAnnouncement, updateAnnouncement, isLoading } = useCms();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Announcement>('publishDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Handle sorting
  const handleSort = (field: keyof Announcement) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort announcements
  const filteredAnnouncements = announcements
    .filter(announcement =>
      (statusFilter === 'all' || announcement.status === statusFilter) &&
      (search === '' ||
        announcement.title.toLowerCase().includes(search.toLowerCase()) ||
        announcement.content.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle boolean values
      if (typeof aValue === 'boolean') {
        aValue = aValue ? 'true' : 'false';
        bValue = bValue ? 'true' : 'false';
      }

      if (sortDirection === 'asc') {
        return String(aValue).localeCompare(String(bValue));
      } else {
        return String(bValue).localeCompare(String(aValue));
      }
    });

  // Handle deletion of an announcement
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      deleteAnnouncement(id);
    }
  };

  // Handle status change
  const handleStatusChange = (id: string, status: Announcement['status']) => {
    updateAnnouncement(id, { status });
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

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kinder-blue mx-auto"></div>
          <p className="mt-4 text-kinder-blue font-heading">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-kinder-blue flex items-center">
          <Megaphone className="mr-2 h-6 w-6" />
          Announcements
        </h1>
        <p className="text-gray-600 font-body">
          Manage announcements that appear on the website and in the parent portal.
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/admin/content/announcements/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Announcement
          </Link>
        </Button>
      </div>

      {/* Announcements Table */}
      <Card className="flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">All Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-8">
              <Megaphone className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No announcements found</h3>
              <p className="text-gray-500 mb-4">
                {search || statusFilter !== 'all'
                  ? "Try adjusting your search or filter"
                  : "Create your first announcement to get started"}
              </p>
              {!search && statusFilter === 'all' && (
                <Button asChild>
                  <Link href="/admin/content/announcements/new">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Announcement
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
                        Title
                        {sortField === 'title' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort('publishDate')}>
                      <div className="flex items-center">
                        Publish Date
                        {sortField === 'publishDate' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort('isImportant')}>
                      <div className="flex items-center">
                        Important
                        {sortField === 'isImportant' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnnouncements.map((announcement) => (
                    <TableRow key={announcement.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {getStatusIcon(announcement.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{announcement.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[280px] hidden sm:block">
                            {announcement.content.length > 60
                              ? announcement.content.substring(0, 60) + '...'
                              : announcement.content}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{formatDate(announcement.publishDate)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {announcement.isImportant ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Important
                          </span>
                        ) : "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end items-center gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/content/announcements/${announcement.id}/preview`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Preview</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/content/announcements/${announcement.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(announcement.id)}
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
