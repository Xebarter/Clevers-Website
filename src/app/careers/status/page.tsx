"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Download, FileText, ExternalLink, CheckCircle, Clock, XCircle } from "lucide-react";
import { generateJobApplicationPDF, type JobApplicationData } from "@/lib/pdf";

interface ApplicationStatus {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address?: string;
  position_applied: string;
  experience_years: number;
  qualifications: string;
  skills?: string;
  cover_letter?: string;
  references_info?: string;
  cv_url?: string;
  certificates_url?: string;
  other_documents_url?: string;
  application_status: string;
  created_at: string;
}

export default function ApplicationStatusPage() {
  const [email, setEmail] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState<ApplicationStatus | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setApplication(null);

    try {
      const response = await fetch(`/api/career-application/status?email=${encodeURIComponent(email)}&id=${encodeURIComponent(applicationId)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("No application found with the provided details. Please check your email and application ID.");
        } else {
          setError("An error occurred while fetching your application. Please try again.");
        }
        return;
      }

      const data = await response.json();
      setApplication(data);
    } catch (err) {
      console.error("Error fetching application:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!application) return;

    generateJobApplicationPDF({
      id: application.id,
      full_name: application.full_name,
      email: application.email,
      phone: application.phone,
      address: application.address,
      position_applied: application.position_applied,
      experience_years: application.experience_years,
      qualifications: application.qualifications,
      skills: application.skills,
      cover_letter: application.cover_letter,
      references_info: application.references_info,
      cv_url: application.cv_url,
      certificates_url: application.certificates_url,
      other_documents_url: application.other_documents_url,
      application_status: application.application_status,
      created_at: application.created_at,
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          icon: <Clock className="w-6 h-6 text-gray-500" />,
          color: "bg-gray-100 text-gray-800 border-gray-300",
          label: "Pending Review",
          description: "Your application has been received and is waiting to be reviewed."
        };
      case "reviewing":
        return {
          icon: <Clock className="w-6 h-6 text-blue-500" />,
          color: "bg-blue-100 text-blue-800 border-blue-300",
          label: "Under Review",
          description: "Your application is currently being reviewed by our HR team."
        };
      case "shortlisted":
        return {
          icon: <CheckCircle className="w-6 h-6 text-yellow-500" />,
          color: "bg-yellow-100 text-yellow-800 border-yellow-300",
          label: "Shortlisted",
          description: "Congratulations! You have been shortlisted for the next stage."
        };
      case "interviewed":
        return {
          icon: <CheckCircle className="w-6 h-6 text-purple-500" />,
          color: "bg-purple-100 text-purple-800 border-purple-300",
          label: "Interviewed",
          description: "You have completed the interview stage. We are reviewing your performance."
        };
      case "hired":
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-500" />,
          color: "bg-green-100 text-green-800 border-green-300",
          label: "Hired",
          description: "Congratulations! You have been selected for the position. Our team will contact you soon."
        };
      case "rejected":
        return {
          icon: <XCircle className="w-6 h-6 text-red-500" />,
          color: "bg-red-100 text-red-800 border-red-300",
          label: "Not Selected",
          description: "Thank you for your interest. Unfortunately, we have decided to move forward with other candidates."
        };
      default:
        return {
          icon: <Clock className="w-6 h-6 text-gray-500" />,
          color: "bg-gray-100 text-gray-800 border-gray-300",
          label: status,
          description: "Your application status."
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getExperienceText = (years: number) => {
    if (years === 0) return "Fresh Graduate";
    if (years <= 2) return "1-2 Years";
    if (years <= 5) return "3-5 Years";
    if (years <= 10) return "5-10 Years";
    return "10+ Years";
  };

  return (
    <div className="min-h-screen bg-gradient-to-tl from-yellow-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 bg-gradient-to-br from-pink-100 via-yellow-100 to-green-100 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 bg-clip-text text-transparent">
                Check Application Status
              </span>
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Enter your email and application ID to view the status of your job application.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Find Your Application</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter the email you used to apply"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="applicationId">Application ID (Optional)</Label>
                    <Input
                      id="applicationId"
                      type="text"
                      value={applicationId}
                      onChange={(e) => setApplicationId(e.target.value)}
                      placeholder="Enter your application ID if you have it"
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-pink-500 hover:bg-pink-600"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search Application
                      </>
                    )}
                  </Button>
                </form>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Details Section */}
      {application && (
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Status Card */}
              <Card className={`border-2 ${getStatusInfo(application.application_status).color}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    {getStatusInfo(application.application_status).icon}
                    <div>
                      <h3 className="text-xl font-bold">
                        {getStatusInfo(application.application_status).label}
                      </h3>
                      <p className="text-gray-600">
                        {getStatusInfo(application.application_status).description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Application Details */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Application Details</CardTitle>
                  <Button onClick={handleDownloadPDF} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Personal Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{application.full_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{application.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{application.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Applied On</p>
                        <p className="font-medium">{formatDate(application.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Professional Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Position Applied</p>
                        <p className="font-medium">{application.position_applied}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="font-medium">{getExperienceText(application.experience_years)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Education</p>
                        <p className="font-medium">{application.qualifications}</p>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Uploaded Documents</h4>
                    <div className="flex flex-wrap gap-3">
                      {application.cv_url && (
                        <a
                          href={application.cv_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <FileText className="h-4 w-4 text-pink-500" />
                          <span>Resume/CV</span>
                          <ExternalLink className="h-3 w-3 text-gray-400" />
                        </a>
                      )}
                      {application.certificates_url && (
                        <a
                          href={application.certificates_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <FileText className="h-4 w-4 text-yellow-500" />
                          <span>Certificates</span>
                          <ExternalLink className="h-3 w-3 text-gray-400" />
                        </a>
                      )}
                      {application.other_documents_url && (
                        <a
                          href={application.other_documents_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <FileText className="h-4 w-4 text-blue-500" />
                          <span>Other Documents</span>
                          <ExternalLink className="h-3 w-3 text-gray-400" />
                        </a>
                      )}
                      {!application.cv_url && !application.certificates_url && !application.other_documents_url && (
                        <p className="text-gray-500">No documents uploaded</p>
                      )}
                    </div>
                  </div>

                  {/* Application ID */}
                  <div className="text-center text-sm text-gray-500">
                    Application ID: <span className="font-mono">{application.id}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
