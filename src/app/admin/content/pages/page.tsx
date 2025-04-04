"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Search,
  PlusCircle,
  Pencil,
  Trash2,
  Eye,
  ArrowUpDown,
  ExternalLink,
  Globe,
  Sections,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useCms, Page } from '../../cmsService';

export default function PagesPage() {
  const { pages, deletePage, updatePage, isLoading } = useCms();
  const [search, setSearch] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [sortField, setSortField] = useState<keyof Page>('lastUpdated');
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
  const handleSort = (field: keyof Page) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort pages
  const filteredPages = pages
    .filter(page =>
      (publishedFilter === 'all' ||
        (publishedFilter === 'published' && page.isPublished) ||
        (publishedFilter === 'draft' && !page.isPublished)) &&
      (search === '' ||
        page.title.toLowerCase().includes(search.toLowerCase()) ||
        page.slug.toLowerCase().includes(search.toLowerCase()) ||
        page.content.toLowerCase().includes(search.toLowerCase()))
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

  // Handle deletion of a page
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this page? This cannot be undone.')) {
      deletePage(id);
    }
  };

  // Handle publishing/unpublishing a page
  const handleTogglePublish = (id: string, isCurrentlyPublished: boolean) => {
    updatePage(id, { isPublished: !isCurrentlyPublished });
  };

  // Count sections in a page
  const countSections = (page: Page) => {
    return page.sections.length;
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kinder-blue mx-auto"></div>
          <p className="mt-4 text-kinder-blue font-heading">Loading pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-kinder-blue flex items-center">
          <FileText className="mr-2 h-6 w-6" />
          Page Management
        </h1>
        <p className="text-gray-600 font-body">
          Create and manage web pages for your website.
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex rounded-md border border-input">
            <button
              className={`px-3 py-2 text-sm ${publishedFilter === 'all' ? 'bg-muted font-medium' : ''}`}
              onClick={() => setPublishedFilter('all')}
            >
              All
            </button>
            <button
              className={`px-3 py-2 text-sm ${publishedFilter === 'published' ? 'bg-muted font-medium' : ''}`}
              onClick={() => setPublishedFilter('published')}
            >
              Published
            </button>
            <button
              className={`px-3 py-2 text-sm ${publishedFilter === 'draft' ? 'bg-muted font-medium' : ''}`}
              onClick={() => setPublishedFilter('draft')}
            >
              Draft
            </button>
          </div>

          <Button asChild>
            <Link href="/admin/content/pages/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Page
            </Link>
          </Button>
        </div>
      </div>

      {/* Pages Table */}
      <Card className="flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">All Pages</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPages.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No pages found</h3>
              <p className="text-gray-500 mb-4">
                {search || publishedFilter !== 'all'
                  ? "Try adjusting your search or filter"
                  : "Create your first page to get started"}
              </p>
              {!search && publishedFilter === 'all' && (
                <Button asChild>
                  <Link href="/admin/content/pages/new">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Page
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[90px]">Status</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('title')}>
                      <div className="flex items-center">
                        Title
                        {sortField === 'title' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort('slug')}>
                      <div className="flex items-center">
                        URL Slug
                        {sortField === 'slug' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort('lastUpdated')}>
                      <div className="flex items-center">
                        Last Updated
                        {sortField === 'lastUpdated' && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="hidden md:table-cell text-center">Sections</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <Badge
                          className={page.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                        >
                          {page.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{page.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[280px] hidden sm:block">
                            {page.content.length > 60
                              ? page.content.substring(0, 60) + '...'
                              : page.content}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{page.slug}</code>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{formatDate(page.lastUpdated)}</TableCell>
                      <TableCell className="hidden md:table-cell text-center">
                        <div className="flex items-center justify-center">
                          <Sections className="h-4 w-4 mr-1 text-gray-500" />
                          <span>{countSections(page)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleTogglePublish(page.id, page.isPublished)}
                            title={page.isPublished ? "Unpublish" : "Publish"}
                          >
                            {page.isPublished ? (
                              <XCircle className="h-4 w-4 text-yellow-500" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </Button>

                          <Button variant="ghost" size="icon" asChild title="Preview">
                            <Link href={`/admin/content/pages/${page.id}/preview`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button variant="ghost" size="icon" asChild title="Edit page">
                            <Link href={`/admin/content/pages/${page.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button variant="ghost" size="icon" asChild title="Edit sections">
                            <Link href={`/admin/content/pages/${page.id}/sections`}>
                              <Sections className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button variant="ghost" size="icon" title="Delete page" onClick={() => handleDelete(page.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>

                          {page.isPublished && (
                            <Button variant="ghost" size="icon" asChild title="View live page">
                              <Link href={`/${page.slug}`} target="_blank">
                                <ExternalLink className="h-4 w-4 text-kinder-blue" />
                              </Link>
                            </Button>
                          )}
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
