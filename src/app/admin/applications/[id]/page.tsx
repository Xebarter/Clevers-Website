"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User, Mail, Phone, Home, BookOpen, School, Calendar,
  FileText, CreditCard, Clock, CheckCircle, XCircle,
  AlertCircle, ArrowLeft, Save, Trash2
} from "lucide-react";
import { useApplications, Application } from '../../applicationService';

interface ApplicationDetailPageProps {
  params: { id: string }
}

export default function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const { id } = params;
  const router = useRouter();
  const { applications, isLoading, updateApplicationStatus, addApplicationNotes, deleteApplication } = useApplications();

  const [application, setApplication] = useState<Application | null>(null);
  const [notes, setNotes] = useState('');
  const [currentTab, setCurrentTab] = useState('details');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load application data
  useEffect(() => {
    if (!isLoading && applications) {
      const app = applications.find(app => app.id === id);
      if (app) {
        setApplication(app);
        setNotes(app.notes || '');
      } else {
        // Application not found, redirect back to list
        router.push('/admin/applications');
      }
    }
  }, [id, applications, isLoading, router]);

  // Handle status update
  const handleStatusUpdate = (status: Application['status']) => {
    if (!application) return;

    setIsUpdating(true);

    try {
      updateApplicationStatus(application.id, status, notes);

      // Update local state to reflect changes
      setApplication({
        ...application,
        status,
        notes,
        reviewedBy: 'admin',
        reviewedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to update application status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle notes update
  const handleNotesUpdate = () => {
    if (!application) return;

    setIsUpdating(true);

    try {
      addApplicationNotes(application.id, notes);

      // Update local state
      setApplication({
        ...application,
        notes
      });
    } catch (error) {
      console.error('Failed to update notes:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle application deletion
  const handleDelete = () => {
    if (!application) return;

    if (window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      setIsDeleting(true);

      try {
        deleteApplication(application.id);
        router.push('/admin/applications');
      } catch (error) {
        console.error('Failed to delete application:', error);
        setIsDeleting(false);
      }
    }
  };

  // Get status badge
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading || !application) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kinder-blue mx-auto"></div>
          <p className="mt-4 text-kinder-blue font-heading">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4 pl-0 hover:bg-transparent hover:text-kinder-blue"
          onClick={() => router.push('/admin/applications')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Applications
        </Button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-kinder-blue flex items-center">
              Application {application.id}
            </h1>
            <div className="flex items-center mt-1">
              <p className="text-gray-600 font-body">
                {application.student.firstName} {application.student.lastName}
              </p>
              <span className="mx-2">•</span>
              <span>{getStatusBadge(application.status)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details" className="font-heading">Application Details</TabsTrigger>
          <TabsTrigger value="status" className="font-heading">Status & Notes</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto mt-6">
          <TabsContent value="details" className="h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Information */}
              <Card>
                <CardHeader className="bg-kinder-blue/10 border-b border-kinder-blue/20">
                  <CardTitle className="flex items-center text-kinder-blue font-heading">
                    <User className="mr-2 h-5 w-5" />
                    Student Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 font-body">Name</h3>
                    <p className="font-medium text-gray-900 font-body">{application.student.firstName} {application.student.lastName}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 font-body">Date of Birth</h3>
                    <p className="font-medium text-gray-900 font-body">{application.student.dateOfBirth}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 font-body">Gender</h3>
                    <p className="font-medium text-gray-900 font-body">{application.student.gender.charAt(0).toUpperCase() + application.student.gender.slice(1)}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 font-body">Nationality</h3>
                    <p className="font-medium text-gray-900 font-body">{application.student.nationality}</p>
                  </div>

                  {application.student.religion && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 font-body">Religion</h3>
                      <p className="font-medium text-gray-900 font-body">{application.student.religion}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Guardian Information */}
              <Card>
                <CardHeader className="bg-kinder-purple/10 border-b border-kinder-purple/20">
                  <CardTitle className="flex items-center text-kinder-purple font-heading">
                    <Users className="mr-2 h-5 w-5" />
                    Guardian Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 font-body">Name</h3>
                    <p className="font-medium text-gray-900 font-body">{application.guardian.firstName} {application.guardian.lastName}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 font-body">Relationship</h3>
                    <p className="font-medium text-gray-900 font-body">{application.guardian.relationship}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${application.guardian.email}`} className="font-medium text-kinder-blue hover:underline font-body">
                      {application.guardian.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a href={`tel:${application.guardian.phone}`} className="font-medium text-kinder-blue hover:underline font-body">
                      {application.guardian.phone}
                    </a>
                  </div>

                  {application.guardian.occupation && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 font-body">Occupation</h3>
                      <p className="font-medium text-gray-900 font-body">{application.guardian.occupation}</p>
                    </div>
                  )}

                  <div className="flex items-start gap-1">
                    <Home className="h-4 w-4 text-gray-400 mt-1" />
                    <p className="font-medium text-gray-900 font-body">{application.guardian.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Academic Information */}
              <Card>
                <CardHeader className="bg-kinder-green/10 border-b border-kinder-green/20">
                  <CardTitle className="flex items-center text-kinder-green font-heading">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Academic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 font-body">Applied Grade</h3>
                    <p className="font-medium text-gray-900 font-body">{application.academic.appliedGrade}</p>
                  </div>

                  {application.academic.previousSchool && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 font-body">Previous School</h3>
                      <p className="font-medium text-gray-900 font-body">{application.academic.previousSchool}</p>
                    </div>
                  )}

                  {application.academic.previousGrade && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 font-body">Previous Grade</h3>
                      <p className="font-medium text-gray-900 font-body">{application.academic.previousGrade}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 font-body">Academic Records</h3>
                    <p className="font-medium text-gray-900 font-body">
                      {application.academic.academicRecords ? 'Available' : 'Not Available'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Campus Preference */}
              <Card>
                <CardHeader className="bg-kinder-red/10 border-b border-kinder-red/20">
                  <CardTitle className="flex items-center text-kinder-red font-heading">
                    <School className="mr-2 h-5 w-5" />
                    Campus Preference
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 font-body">Campus</h3>
                    <p className="font-medium text-gray-900 font-body">
                      {application.campusPreference.campus.charAt(0).toUpperCase() + application.campusPreference.campus.slice(1)}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 font-body">Admission Term</h3>
                    <p className="font-medium text-gray-900 font-body">
                      {application.campusPreference.admissionTerm === 'term1' ? 'Term 1' :
                       application.campusPreference.admissionTerm === 'term2' ? 'Term 2' : 'Term 3'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 font-body">Residential Option</h3>
                    <p className="font-medium text-gray-900 font-body">
                      {application.campusPreference.residentialOption === 'day' ? 'Day Student' : 'Boarding Student'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader className="bg-kinder-yellow/10 border-b border-kinder-yellow/20">
                  <CardTitle className="flex items-center text-kinder-yellow font-heading">
                    <FileText className="mr-2 h-5 w-5" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 font-body">Special Needs</h3>
                    <p className="font-medium text-gray-900 font-body">
                      {application.additional.specialNeeds ? 'Yes' : 'No'}
                    </p>
                    {application.additional.specialNeeds && application.additional.specialNeedsDetails && (
                      <p className="mt-1 text-sm text-gray-600 font-body">
                        {application.additional.specialNeedsDetails}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 font-body">Health Conditions</h3>
                    <p className="font-medium text-gray-900 font-body">
                      {application.additional.healthConditions ? 'Yes' : 'No'}
                    </p>
                    {application.additional.healthConditions && application.additional.healthConditionsDetails && (
                      <p className="mt-1 text-sm text-gray-600 font-body">
                        {application.additional.healthConditionsDetails}
                      </p>
                    )}
                  </div>

                  {application.additional.howDidYouHear && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 font-body">How did you hear about us?</h3>
                      <p className="font-medium text-gray-900 font-body">{application.additional.howDidYouHear}</p>
                    </div>
                  )}

                  {application.additional.additionalComments && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 font-body">Additional Comments</h3>
                      <p className="font-medium text-gray-900 font-body">{application.additional.additionalComments}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader className="bg-kinder-orange/10 border-b border-kinder-orange/20">
                  <CardTitle className="flex items-center text-kinder-orange font-heading">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 font-body">Payment Method</h3>
                    <p className="font-medium text-gray-900 font-body">
                      {application.payment.method === 'mobile' ? 'Mobile Money' :
                       application.payment.method === 'card' ? 'Credit/Debit Card' : 'Bank Transfer'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 font-body">Payment Status</h3>
                    <p className="font-medium text-gray-900 font-body">
                      {application.payment.status === 'success' ? 'Completed' : application.payment.status}
                    </p>
                  </div>

                  {application.payment.reference && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 font-body">Reference Number</h3>
                      <p className="font-medium text-gray-900 font-body">{application.payment.reference}</p>
                    </div>
                  )}

                  {application.payment.transactionDate && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 font-body">Transaction Date</h3>
                      <p className="font-medium text-gray-900 font-body">{formatDate(application.payment.transactionDate)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="status" className="h-full space-y-6">
            {/* Current Status */}
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="font-heading">Application Status</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 font-body mb-2">Current Status</h3>
                    <div className="flex items-center">
                      {getStatusBadge(application.status)}
                      {application.reviewedBy && application.reviewedAt && (
                        <span className="ml-3 text-sm text-gray-500 font-body">
                          Updated on {formatDate(application.reviewedAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 font-body mb-2">Submission Information</h3>
                    <p className="text-sm text-gray-700 font-body">
                      Submitted on {formatDate(application.submittedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Update Status */}
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="font-heading">Update Status</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 font-body mb-3">Change application status:</h3>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant={application.status === 'pending' ? 'default' : 'outline'}
                        className="gap-2"
                        onClick={() => handleStatusUpdate('pending')}
                        disabled={isUpdating}
                      >
                        <Clock className="h-4 w-4" />
                        Pending
                      </Button>

                      <Button
                        variant={application.status === 'approved' ? 'default' : 'outline'}
                        className="gap-2"
                        onClick={() => handleStatusUpdate('approved')}
                        disabled={isUpdating}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>

                      <Button
                        variant={application.status === 'rejected' ? 'default' : 'outline'}
                        className="gap-2"
                        onClick={() => handleStatusUpdate('rejected')}
                        disabled={isUpdating}
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>

                      <Button
                        variant={application.status === 'waitlisted' ? 'default' : 'outline'}
                        className="gap-2"
                        onClick={() => handleStatusUpdate('waitlisted')}
                        disabled={isUpdating}
                      >
                        <AlertCircle className="h-4 w-4" />
                        Waitlist
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 font-body mb-3">Notes:</h3>
                    <Textarea
                      placeholder="Add notes about this application..."
                      className="min-h-[120px]"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t px-6 py-3">
                <Button
                  className="gap-2 ml-auto"
                  onClick={handleNotesUpdate}
                  disabled={isUpdating}
                >
                  <Save className="h-4 w-4" />
                  {isUpdating ? 'Saving...' : 'Save Notes'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
