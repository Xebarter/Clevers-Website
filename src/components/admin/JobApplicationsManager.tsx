"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Eye, Download, Trash2, ExternalLink, FileText } from "lucide-react";
import {
  getJobApplications,
  updateJobApplication,
  deleteJobApplication,
  type JobApplication,
} from "@/lib/admin/services";
import { generateJobApplicationPDF } from "@/lib/pdf";

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-gray-100 text-gray-800" },
  { value: "reviewing", label: "Reviewing", color: "bg-blue-100 text-blue-800" },
  { value: "shortlisted", label: "Shortlisted", color: "bg-yellow-100 text-yellow-800" },
  { value: "interviewed", label: "Interviewed", color: "bg-purple-100 text-purple-800" },
  { value: "hired", label: "Hired", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
];

export default function JobApplicationsManager() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const [error, setError] = useState<string | null>(null);

  const loadApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJobApplications();
      console.log("Loaded job applications:", data);
      setApplications(data);
    } catch (err) {
      console.error("Error loading job applications:", err);
      setError(err instanceof Error ? err.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (application: JobApplication) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  const handleDownloadPDF = (application: JobApplication) => {
    try {
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
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await updateJobApplication(id, { application_status: newStatus });
      setApplications(applications.map(app => 
        app.id === id ? { ...app, application_status: newStatus } : app
      ));
      if (selectedApplication?.id === id) {
        setSelectedApplication({ ...selectedApplication, application_status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleNotesChange = async (id: string, notes: string) => {
    try {
      await updateJobApplication(id, { notes });
      setApplications(applications.map(app => 
        app.id === id ? { ...app, notes } : app
      ));
      if (selectedApplication?.id === id) {
        setSelectedApplication({ ...selectedApplication, notes });
      }
    } catch (error) {
      console.error("Error updating notes:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job application?")) return;
    
    setDeletingId(id);
    try {
      await deleteJobApplication(id);
      setApplications(applications.filter(app => app.id !== id));
      if (selectedApplication?.id === id) {
        setShowDetailModal(false);
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete application";
      
      // Check if it's a database/table not found error
      if (errorMessage.includes("not found") || errorMessage.includes("does not exist")) {
        alert(`Delete failed: ${errorMessage}\n\nPlease ensure the 'job_applications' table exists in your Supabase database.`);
      } else {
        alert(`Delete failed: ${errorMessage}`);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status) || statusOptions[0];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${option.color}`}>
        {option.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Helper function to download files from external URLs
  const handleDownloadDocument = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading document:', error);
      // Fallback: open in new tab
      window.open(url, '_blank');
    }
  };

  // Extract filename from URL or generate one
  const getFilenameFromUrl = (url: string, defaultName: string) => {
    try {
      const urlPath = new URL(url).pathname;
      const filename = urlPath.split('/').pop();
      return filename || defaultName;
    } catch {
      return defaultName;
    }
  };

  const getExperienceText = (years: number) => {
    if (years === 0) return "Fresh Graduate";
    if (years <= 2) return "1-2 Years";
    if (years <= 5) return "3-5 Years";
    if (years <= 10) return "5-10 Years";
    return "10+ Years";
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Job Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading job applications...</div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={loadApplications} variant="outline">
                Try Again
              </Button>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No job applications found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Position</th>
                    <th className="text-left py-3 px-4">Experience</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Documents</th>
                    <th className="text-left py-3 px-4">Applied</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr key={application.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{application.full_name}</div>
                        <div className="text-sm text-gray-500">{application.email}</div>
                      </td>
                      <td className="py-3 px-4">{application.position_applied}</td>
                      <td className="py-3 px-4">{getExperienceText(application.experience_years)}</td>
                      <td className="py-3 px-4">
                        <Select
                          value={application.application_status}
                          onValueChange={(value) => handleStatusChange(application.id, value)}
                          disabled={updatingId === application.id}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1.5 min-w-[180px]">
                          {application.cv_url && (
                            <div className="flex items-center justify-between gap-2 p-1.5 bg-pink-50 border border-pink-200 rounded">
                              <div className="flex items-center gap-1.5">
                                <FileText className="h-4 w-4 text-pink-500 flex-shrink-0" />
                                <span className="text-xs font-medium text-pink-700">Resume/CV</span>
                              </div>
                              <button
                                onClick={() => handleDownloadDocument(
                                  application.cv_url!,
                                  getFilenameFromUrl(application.cv_url!, `${application.full_name}_Resume.pdf`)
                                )}
                                className="flex items-center gap-1 px-2 py-0.5 text-xs bg-pink-500 hover:bg-pink-600 text-white rounded transition-colors"
                                title="Download Resume/CV"
                              >
                                <Download className="h-3 w-3" />
                                Download
                              </button>
                            </div>
                          )}
                          {application.certificates_url && (
                            <div className="flex items-center justify-between gap-2 p-1.5 bg-yellow-50 border border-yellow-200 rounded">
                              <div className="flex items-center gap-1.5">
                                <FileText className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                                <span className="text-xs font-medium text-yellow-700">Certificates</span>
                              </div>
                              <button
                                onClick={() => handleDownloadDocument(
                                  application.certificates_url!,
                                  getFilenameFromUrl(application.certificates_url!, `${application.full_name}_Certificates.pdf`)
                                )}
                                className="flex items-center gap-1 px-2 py-0.5 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors"
                                title="Download Certificates"
                              >
                                <Download className="h-3 w-3" />
                                Download
                              </button>
                            </div>
                          )}
                          {application.other_documents_url && (
                            <div className="flex items-center justify-between gap-2 p-1.5 bg-blue-50 border border-blue-200 rounded">
                              <div className="flex items-center gap-1.5">
                                <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                <span className="text-xs font-medium text-blue-700">Other Docs</span>
                              </div>
                              <button
                                onClick={() => handleDownloadDocument(
                                  application.other_documents_url!,
                                  getFilenameFromUrl(application.other_documents_url!, `${application.full_name}_OtherDocs.pdf`)
                                )}
                                className="flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                                title="Download Other Documents"
                              >
                                <Download className="h-3 w-3" />
                                Download
                              </button>
                            </div>
                          )}
                          {!application.cv_url && !application.certificates_url && !application.other_documents_url && (
                            <span className="text-xs text-gray-400 italic">No documents uploaded</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">{formatDate(application.created_at)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewApplication(application)}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadPDF(application)}
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(application.id)}
                            disabled={deletingId === application.id}
                            title="Delete application"
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            {deletingId === application.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border border-white border-t-transparent" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Application Details</DialogTitle>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              {/* Status and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Label>Status:</Label>
                  <Select
                    value={selectedApplication.application_status}
                    onValueChange={(value) => handleStatusChange(selectedApplication.id, value)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => handleDownloadPDF(selectedApplication)}>
                    <Download className="h-4 w-4 mr-2" /> Download PDF
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDelete(selectedApplication.id)}
                    disabled={deletingId === selectedApplication.id}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {deletingId === selectedApplication.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border border-white border-t-transparent mr-2" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Full Name</Label>
                    <p className="font-medium">{selectedApplication.full_name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Email</Label>
                    <p className="font-medium">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Phone</Label>
                    <p className="font-medium">{selectedApplication.phone}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Address</Label>
                    <p className="font-medium">{selectedApplication.address || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Professional Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Position Applied</Label>
                    <p className="font-medium">{selectedApplication.position_applied}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Experience</Label>
                    <p className="font-medium">{getExperienceText(selectedApplication.experience_years)}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Education</Label>
                    <p className="font-medium">{selectedApplication.qualifications}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Applied On</Label>
                    <p className="font-medium">{formatDate(selectedApplication.created_at)}</p>
                  </div>
                </div>
                {selectedApplication.skills && (
                  <div className="mt-4">
                    <Label className="text-gray-500">Skills</Label>
                    <p className="font-medium">{selectedApplication.skills}</p>
                  </div>
                )}
              </div>

              {/* Documents */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Submitted Documents</h3>
                {!selectedApplication.cv_url && !selectedApplication.certificates_url && !selectedApplication.other_documents_url ? (
                  <p className="text-gray-500">No documents uploaded</p>
                ) : (
                  <div className="space-y-3">
                    {selectedApplication.cv_url && (
                      <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-pink-500" />
                          <div>
                            <p className="font-medium">Resume/CV</p>
                            <p className="text-sm text-gray-500">Applicant's resume or curriculum vitae</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={selectedApplication.cv_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            View
                          </a>
                          <button
                            onClick={() => handleDownloadDocument(
                              selectedApplication.cv_url!,
                              getFilenameFromUrl(selectedApplication.cv_url!, `${selectedApplication.full_name}_Resume.pdf`)
                            )}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-pink-500 hover:bg-pink-600 text-white rounded transition-colors"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </button>
                        </div>
                      </div>
                    )}
                    {selectedApplication.certificates_url && (
                      <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-yellow-500" />
                          <div>
                            <p className="font-medium">Certificates</p>
                            <p className="text-sm text-gray-500">Academic and professional certificates</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={selectedApplication.certificates_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            View
                          </a>
                          <button
                            onClick={() => handleDownloadDocument(
                              selectedApplication.certificates_url!,
                              getFilenameFromUrl(selectedApplication.certificates_url!, `${selectedApplication.full_name}_Certificates.pdf`)
                            )}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </button>
                        </div>
                      </div>
                    )}
                    {selectedApplication.other_documents_url && (
                      <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">Other Documents</p>
                            <p className="text-sm text-gray-500">Additional supporting documents</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={selectedApplication.other_documents_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            View
                          </a>
                          <button
                            onClick={() => handleDownloadDocument(
                              selectedApplication.other_documents_url!,
                              getFilenameFromUrl(selectedApplication.other_documents_url!, `${selectedApplication.full_name}_OtherDocs.pdf`)
                            )}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              {selectedApplication.cover_letter && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Cover Letter</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.cover_letter}</p>
                </div>
              )}

              {/* References */}
              {selectedApplication.references_info && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Professional References</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.references_info}</p>
                </div>
              )}

              {/* Admin Notes */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Admin Notes</h3>
                <Textarea
                  placeholder="Add notes about this application..."
                  value={selectedApplication.notes || ""}
                  onChange={(e) => setSelectedApplication({ ...selectedApplication, notes: e.target.value })}
                  onBlur={() => handleNotesChange(selectedApplication.id, selectedApplication.notes || "")}
                  rows={3}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
