"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Search, Filter, ChevronRight, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useApplications, Application } from '../applicationService';

export default function ApplicationsPage() {
  const { applications, isLoading } = useApplications();
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Application['status'] | 'all'>('all');

  // Filter applications whenever filters or search term change
  useEffect(() => {
    if (!applications) return;

    let filtered = [...applications];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Apply search filter (case insensitive)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app =>
        app.student.firstName.toLowerCase().includes(term) ||
        app.student.lastName.toLowerCase().includes(term) ||
        app.guardian.email.toLowerCase().includes(term) ||
        app.id.toLowerCase().includes(term)
      );
    }

    // Sort by submission date (newest first)
    filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);

  // Get counts for each status
  const statusCounts = applications.reduce((counts, app) => {
    counts[app.status] = (counts[app.status] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  // Helper function to get status badge
  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300">
          <Clock className="h-3 w-3 mr-1" /> Pending
        </Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" /> Approved
        </Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border border-red-300">
          <XCircle className="h-3 w-3 mr-1" /> Rejected
        </Badge>;
      case 'waitlisted':
        return <Badge className="bg-blue-100 text-blue-800 border border-blue-300">
          <AlertCircle className="h-3 w-3 mr-1" /> Waitlisted
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kinder-blue mx-auto"></div>
          <p className="mt-4 text-kinder-blue font-heading">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-kinder-blue flex items-center">
          <ClipboardList className="mr-2 h-6 w-6" />
          Application Management
        </h1>
        <p className="text-gray-600 font-body">
          View and manage student applications
        </p>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card
          className={`border-l-4 ${statusFilter === 'all' ? 'border-l-kinder-blue' : 'border-l-gray-200'} cursor-pointer hover:shadow-md transition-shadow`}
          onClick={() => setStatusFilter('all')}
        >
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 font-body">Total</p>
              <p className="text-2xl font-bold font-heading text-kinder-blue">{applications.length}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-kinder-blue/10 flex items-center justify-center text-kinder-blue">
              <ClipboardList className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`border-l-4 ${statusFilter === 'pending' ? 'border-l-yellow-500' : 'border-l-gray-200'} cursor-pointer hover:shadow-md transition-shadow`}
          onClick={() => setStatusFilter('pending')}
        >
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 font-body">Pending</p>
              <p className="text-2xl font-bold font-heading text-yellow-600">{statusCounts.pending || 0}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`border-l-4 ${statusFilter === 'approved' ? 'border-l-green-500' : 'border-l-gray-200'} cursor-pointer hover:shadow-md transition-shadow`}
          onClick={() => setStatusFilter('approved')}
        >
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 font-body">Approved</p>
              <p className="text-2xl font-bold font-heading text-green-600">{statusCounts.approved || 0}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`border-l-4 ${statusFilter === 'rejected' ? 'border-l-red-500' : 'border-l-gray-200'} cursor-pointer hover:shadow-md transition-shadow`}
          onClick={() => setStatusFilter('rejected')}
        >
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 font-body">Rejected</p>
              <p className="text-2xl font-bold font-heading text-red-600">{statusCounts.rejected || 0}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <XCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            className="kinder-input pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2 whitespace-nowrap"
            onClick={() => setStatusFilter('waitlisted')}
          >
            <Filter className="h-4 w-4" />
            Waitlisted ({statusCounts.waitlisted || 0})
          </Button>
        </div>
      </div>

      {/* Applications list */}
      <div className="flex-1 overflow-auto bg-white rounded-xl border border-gray-200">
        {filteredApplications.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center p-8">
            <div>
              <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 font-heading mb-1">No applications found</h3>
              <p className="text-gray-500 font-body">
                {searchTerm || statusFilter !== 'all' ?
                  'Try adjusting your search or filters' :
                  'There are no applications to display'}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredApplications.map((application) => (
              <Link
                key={application.id}
                href={`/admin/applications/${application.id}`}
                className="block hover:bg-gray-50 transition-colors"
              >
                <div className="p-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-800 font-heading">
                          {application.student.firstName} {application.student.lastName}
                        </h3>
                        <span className="ml-3">
                          {getStatusBadge(application.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-body mt-1">
                        {application.id} • {application.campusPreference.campus.charAt(0).toUpperCase() + application.campusPreference.campus.slice(1)} Campus
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 font-body">
                          Submitted on {formatDate(application.submittedAt)}
                        </p>
                        <p className="text-xs text-gray-500 font-body">
                          by {application.guardian.firstName} {application.guardian.lastName}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
