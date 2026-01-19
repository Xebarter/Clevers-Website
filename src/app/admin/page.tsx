"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  Image, 
  FileText, 
  Bell, 
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  LogOut,
  Download
} from "lucide-react";
import Link from "next/link";
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useRouter } from 'next/navigation';
import {
  getApplications,
  getAnnouncements,
  getEvents,
  getGalleryImages,
  getResources,
  getMessages,
  deleteApplication,
  deleteAnnouncement,
  deleteEvent,
  deleteGalleryImage,
  deleteResource,
  createAnnouncement,
  createGalleryImage,
  updateGalleryImage,
  updateAnnouncement,
  createEvent,
  updateEvent
} from "@/lib/admin/services";
import { generateApplicationPDF } from "@/lib/pdf";
import ApplicationDetailModal from "@/components/admin/ApplicationDetailModal";
import AnnouncementForm from "@/components/admin/AnnouncementForm";
import EventForm from "@/components/admin/EventForm";
import Messages from "@/components/admin/Messages";
import JotformMessages from "@/components/admin/JotformMessages";
import ApplicationFormModal from "@/components/admin/ApplicationFormModal";
import ResourceForm from "@/components/admin/ResourceForm";
import GalleryForm from "@/components/admin/GalleryForm";
import MultiImageGalleryForm from "@/components/admin/MultiImageGalleryForm";

// Types
interface Application {
  _id: string;
  applicationId: string;
  studentName: string;
  dateOfBirth: string;
  gender: string;
  gradeLevel: string;
  parentName: string;
  relationship: string;
  phone: string;
  email: string;
  campus: string;
  boarding: string;
  howHeard: string;
  paymentStatus: string;
  _createdAt: string;
}

interface Announcement {
  _id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  pinned: boolean;
  _createdAt: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
}

interface EventItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  _createdAt: string;
  start_date: string;
  end_date?: string;
  is_all_day?: boolean;
}

interface GalleryImage {
  _id: string;
  title: string;
  file_url: string;
  file_name: string;
  alt_text?: string;
  caption?: string;
  category?: string;
  _createdAt: string;
}

interface Resource {
  _id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  fileSize: string;
  uploadDate: string;
  fileUrl: string;
  _createdAt: string;
}

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAdminAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [applications, setApplications] = useState<Application[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [creatingAnnouncement, setCreatingAnnouncement] = useState(false);
  const [showApplicationFormModal, setShowApplicationFormModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [useMultiImageForm, setUseMultiImageForm] = useState(false);
  const [editingGalleryImage, setEditingGalleryImage] = useState<GalleryImage | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router]);

  // Handle edit application
  const handleEditApplication = (application: Application) => {
    setEditingApplication(application);
    setShowApplicationFormModal(true);
  };

  // Handle create new application
  const handleCreateApplication = () => {
    setEditingApplication(null);
    setShowApplicationFormModal(true);
  };

  // Handle application save (create or update)
  const handleApplicationSave = () => {
    // Refresh the applications list
    loadData();
  };

  // Load data function
  const loadData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      switch (activeTab) {
        case "overview":
          // Load all data for overview
          const [apps, anns, evts, imgs, res, msgs] = await Promise.all([
            getApplications(),
            getAnnouncements(),
            getEvents(),
            getGalleryImages(),
            getResources(),
            getMessages()
          ]);
          setApplications(apps);
          setAnnouncements(anns);
          setEvents(evts);
          setGalleryImages(imgs);
          setResources(res);
          setMessages(msgs);
          break;
        case "applications":
          const appsData = await getApplications();
          setApplications(appsData);
          break;
        case "announcements":
          const annData = await getAnnouncements();
          setAnnouncements(annData);
          break;
        case "events":
          const eventsData = await getEvents();
          setEvents(eventsData);
          break;
        case "gallery":
          const galleryData = await getGalleryImages();
          setGalleryImages(galleryData);
          break;
        case "resources":
          const resourcesData = await getResources();
          setResources(resourcesData);
          break;
        case "messages":
          const messagesData = await getMessages();
          setMessages(messagesData);
          break;
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router]);

  // Load data when component mounts or tab changes
  useEffect(() => {
    loadData();
  }, [activeTab, isAuthenticated]);

  const handleDeleteApplication = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    
    try {
      setDeletingId(id);
      await deleteApplication(id);
      setApplications(applications.filter(app => app._id !== id));
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    
    try {
      setDeletingId(id);
      await deleteAnnouncement(id);
      setAnnouncements(announcements.filter(ann => ann._id !== id));
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert("Failed to delete announcement");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    try {
      setDeletingId(id);
      await deleteEvent(id);
      setEvents(events.filter(event => event._id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteGalleryImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery image?")) return;
    
    try {
      setDeletingId(id);
      await deleteGalleryImage(id);
      setGalleryImages(galleryImages.filter(img => img._id !== id));
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      alert("Failed to delete gallery image");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    
    try {
      setDeletingId(id);
      await deleteResource(id);
      setResources(resources.filter(res => res._id !== id));
    } catch (error) {
      console.error("Error deleting resource:", error);
      alert("Failed to delete resource");
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setShowApplicationModal(true);
  };

  const handleDownloadApplication = (application: Application) => {
    try {
      generateApplicationPDF({
        id: application.applicationId,
        student_name: application.studentName,
        date_of_birth: application.dateOfBirth,
        gender: application.gender,
        grade_level: application.gradeLevel,
        parent_name: application.parentName,
        relationship: application.relationship,
        phone: application.phone,
        email: application.email,
        campus: application.campus,
        boarding: application.boarding,
        how_heard: application.howHeard,
        payment_status: application.paymentStatus,
        application_status: "SUBMITTED",
        created_at: application._createdAt
      });
    } catch (error) {
      console.error("Error downloading application:", error);
      alert("Failed to download application");
    }
  };

  const handleCreateAnnouncement = async (data: any) => {
    try {
      setCreatingAnnouncement(true);
      await createAnnouncement({
        title: data.title,
        content: data.content,
        published_at: data.date,
        image_url: data.imageUrl,
        cta_text: data.ctaText,
        cta_link: data.ctaLink
      });
      const annData = await getAnnouncements();
      setAnnouncements(annData);
      setShowAnnouncementForm(false);
      alert("Announcement created successfully!");
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert("Failed to create announcement");
    } finally {
      setCreatingAnnouncement(false);
    }
  };

  // Handle edit announcement
  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setShowAnnouncementForm(true);
  };

  // Handle announcement save (create or update)
  const handleAnnouncementSave = async (data: any) => {
    try {
      if (editingAnnouncement) {
        // Update existing announcement
        await updateAnnouncement(editingAnnouncement._id, {
          title: data.title,
          content: data.content,
          published_at: data.date,
          image_url: data.imageUrl,
          cta_text: data.ctaText,
          cta_link: data.ctaLink
        });
        alert("Announcement updated successfully!");
      } else {
        // Create new announcement
        await createAnnouncement({
          title: data.title,
          content: data.content,
          published_at: data.date,
          image_url: data.imageUrl,
          cta_text: data.ctaText,
          cta_link: data.ctaLink
        });
        alert("Announcement created successfully!");
      }
      
      // Close the form and refresh data
      setShowAnnouncementForm(false);
      setEditingAnnouncement(null);
      loadData();
    } catch (error) {
      console.error("Error saving announcement:", error);
      alert("Failed to save announcement");
    }
  };

  // Handle edit resource
  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setShowResourceForm(true);
  };

  // Handle create new resource
  const handleCreateResource = () => {
    setEditingResource(null);
    setShowResourceForm(true);
  };

  // Handle resource save (create or update)
  const handleResourceSave = () => {
    // Refresh the resources list
    loadData();
  };

  const handleViewResource = (resource: Resource) => {
    window.open(resource.fileUrl, '_blank');
  };

  // Handle edit gallery image
  const handleEditGalleryImage = (image: GalleryImage) => {
    setEditingGalleryImage(image);
    setUseMultiImageForm(false);
    setShowGalleryForm(true);
  };

  // Handle create new gallery image
  const handleCreateGalleryImage = () => {
    setEditingGalleryImage(null);
    setShowGalleryForm(true);
  };

  // Handle gallery image save (create or update)
  const handleGalleryImageSave = async (data: Omit<GalleryImage, '_id'> | Omit<GalleryImage, '_id'>[]) => {
    try {
      const dataArray = Array.isArray(data) ? data : [data];
      
      for (const item of dataArray) {
        if (editingGalleryImage) {
          // Update existing gallery image
          await updateGalleryImage(editingGalleryImage._id, {
            title: item.title,
            file_url: item.file_url,
            file_name: item.file_name,
            alt_text: item.alt_text,
            caption: item.caption,
            category: item.category
          });
        } else {
          // Create new gallery image
          await createGalleryImage({
            title: item.title,
            file_url: item.file_url,
            file_name: item.file_name,
            alt_text: item.alt_text,
            caption: item.caption,
            category: item.category
          });
        }
      }
      
      alert(`Gallery ${dataArray.length > 1 ? 'images' : 'image'} ${editingGalleryImage ? 'updated' : 'created'} successfully!`);
      
      // Close the form and refresh data
      setShowGalleryForm(false);
      setEditingGalleryImage(null);
      loadData();
    } catch (error) {
      console.error("Error saving gallery image:", error);
      alert("Failed to save gallery image");
    }
  };

  // Handle edit event
  const handleEditEvent = (event: EventItem) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  // Handle create new event
  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  // Handle event save (create or update)
  const handleEventSave = async (data: any) => {
    try {
      if (editingEvent) {
        // Update existing event
        await updateEvent(editingEvent._id, {
          title: data.title,
          description: data.description,
          start_date: data.start_date,
          end_date: data.end_date,
          location: data.location,
          is_all_day: data.is_all_day
        });
        alert("Event updated successfully!");
      } else {
        // Create new event
        await createEvent({
          title: data.title,
          description: data.description,
          start_date: data.start_date,
          end_date: data.end_date,
          location: data.location,
          is_all_day: data.is_all_day
        });
        alert("Event created successfully!");
      }
      
      // Close the form and refresh data
      setShowEventForm(false);
      setEditingEvent(null);
      loadData();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event");
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Format date time for display
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Back to Website</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{applications.length}</div>
                  <p className="text-xs text-muted-foreground">Applications received</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resources</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{resources.length}</div>
                  <p className="text-xs text-muted-foreground">Resources available</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{messages.length}</div>
                  <p className="text-xs text-muted-foreground">Messages received</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{events.length}</div>
                  <p className="text-xs text-muted-foreground">Events scheduled</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-4">Loading...</div>
                  ) : applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.slice(0, 5).map((app) => (
                        <div key={app._id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                          <div>
                            <p className="font-medium">{app.studentName}</p>
                            <p className="text-sm text-muted-foreground">{app.gradeLevel} - {app.campus}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{formatDate(app._createdAt)}</p>
                            <p className="text-xs text-muted-foreground">{app.paymentStatus}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No recent applications
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-4">Loading...</div>
                  ) : messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.slice(0, 5).map((msg) => (
                        <div key={msg.id} className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0">
                          <div>
                            <p className="font-medium">{msg.name}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-xs">{msg.subject}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{formatDate(msg.created_at)}</p>
                            <p className="text-xs text-muted-foreground">
                              {msg.read ? "Read" : "Unread"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No recent messages
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Applications</CardTitle>
                  <Button onClick={handleCreateApplication}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Application
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading applications...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Student Name</th>
                          <th className="text-left py-3 px-4">Grade Level</th>
                          <th className="text-left py-3 px-4">Parent Name</th>
                          <th className="text-left py-3 px-4">Campus</th>
                          <th className="text-left py-3 px-4">Payment Status</th>
                          <th className="text-left py-3 px-4">Submitted</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((application) => (
                          <tr key={application._id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{application.studentName}</td>
                            <td className="py-3 px-4">{application.gradeLevel}</td>
                            <td className="py-3 px-4">{application.parentName}</td>
                            <td className="py-3 px-4">{application.campus}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                application.paymentStatus === "completed" 
                                  ? "bg-green-100 text-green-800" 
                                  : application.paymentStatus === "pending" 
                                    ? "bg-yellow-100 text-yellow-800" 
                                    : "bg-red-100 text-red-800"
                              }`}>
                                {application.paymentStatus}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {new Date(application._createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewApplication(application)}
                                  title="View application details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownloadApplication(application)}
                                  title="Download as PDF"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditApplication(application)}
                                  title="Edit application"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteApplication(application._id)}
                                  disabled={deletingId === application._id}
                                  title="Delete application"
                                >
                                  {deletingId === application._id ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border border-gray-500 border-t-transparent" />
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
                    
                    {applications.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No applications found
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Resources</h2>
              <Button onClick={handleCreateResource}>
                <Plus className="mr-2 h-4 w-4" /> Add Resource
              </Button>
            </div>
            
            <Card>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading resources...</div>
                ) : resources.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">Title</th>
                          <th className="text-left py-3 px-2">Category</th>
                          <th className="text-left py-3 px-2">Type</th>
                          <th className="text-left py-3 px-2">Size</th>
                          <th className="text-left py-3 px-2">Date</th>
                          <th className="text-left py-3 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resources.map((resource) => (
                          <tr key={resource._id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-2">
                              <div className="font-medium">{resource.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">{resource.description}</div>
                            </td>
                            <td className="py-3 px-2">
                              <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                {resource.category}
                              </span>
                            </td>
                            <td className="py-3 px-2">{resource.type}</td>
                            <td className="py-3 px-2">{resource.fileSize}</td>
                            <td className="py-3 px-2">{formatDate(resource.uploadDate)}</td>
                            <td className="py-3 px-2">
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleViewResource(resource)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditResource(resource)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDeleteResource(resource._id)}
                                  disabled={deletingId === resource._id}
                                >
                                  {deletingId === resource._id ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-900" />
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
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No resources found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Messages />
          </TabsContent>

          <TabsContent value="announcements" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Announcements</h2>
              <Button onClick={() => {
                setEditingAnnouncement(null);
                setShowAnnouncementForm(true);
              }}>
                <Plus className="mr-2 h-4 w-4" /> Add Announcement
              </Button>
            </div>
            
            {showAnnouncementForm ? (
              <AnnouncementForm
                initialData={editingAnnouncement ? {
                  title: editingAnnouncement.title,
                  content: editingAnnouncement.content,
                  date: editingAnnouncement.date,
                  category: editingAnnouncement.category,
                  pinned: editingAnnouncement.pinned,
                  imageUrl: editingAnnouncement.imageUrl,
                  ctaText: editingAnnouncement.ctaText,
                  ctaLink: editingAnnouncement.ctaLink
                } : undefined}
                onSubmit={handleAnnouncementSave}
                onCancel={() => {
                  setShowAnnouncementForm(false);
                  setEditingAnnouncement(null);
                }}
                isLoading={creatingAnnouncement}
              />
            ) : (
              <Card>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading announcements...</div>
                ) : announcements.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">Title</th>
                          <th className="text-left py-3 px-2">Content</th>
                          <th className="text-left py-3 px-2">Category</th>
                          <th className="text-left py-3 px-2">Date</th>
                          <th className="text-left py-3 px-2">Pinned</th>
                          <th className="text-left py-3 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {announcements.map((announcement) => (
                          <tr key={announcement._id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-2 font-medium">{announcement.title}</td>
                            <td className="py-3 px-2 line-clamp-2 max-w-xs">{announcement.content}</td>
                            <td className="py-3 px-2">
                              <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                {announcement.category}
                              </span>
                            </td>
                            <td className="py-3 px-2">{formatDate(announcement.date)}</td>
                            <td className="py-3 px-2">
                              {announcement.pinned ? (
                                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                  Pinned
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                  No
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditAnnouncement(announcement)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDeleteAnnouncement(announcement._id)}
                                  disabled={deletingId === announcement._id}
                                >
                                  {deletingId === announcement._id ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-900" />
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
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No announcements found
                  </div>
                )}
              </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Events</h2>
              <Button onClick={handleCreateEvent}>
                <Plus className="mr-2 h-4 w-4" /> Add Event
              </Button>
            </div>
            
            {showEventForm ? (
              <EventForm
                initialData={editingEvent ? {
                  id: editingEvent._id,
                  title: editingEvent.title,
                  description: editingEvent.description,
                  start_date: editingEvent.start_date,
                  end_date: editingEvent.end_date,
                  location: editingEvent.location,
                  is_all_day: editingEvent.is_all_day
                } : undefined}
                onSubmit={handleEventSave}
                onCancel={() => {
                  setShowEventForm(false);
                  setEditingEvent(null);
                }}
                isLoading={loading}
              />
            ) : (
              <Card>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">Loading events...</div>
                  ) : events.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2">Title</th>
                            <th className="text-left py-3 px-2">Description</th>
                            <th className="text-left py-3 px-2">Date & Time</th>
                            <th className="text-left py-3 px-2">Location</th>
                            <th className="text-left py-3 px-2">Type</th>
                            <th className="text-left py-3 px-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {events.map((event) => (
                            <tr key={event._id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-2 font-medium">{event.title}</td>
                              <td className="py-3 px-2 line-clamp-2 max-w-xs">{event.description}</td>
                              <td className="py-3 px-2">
                                <div>{formatDate(event.date)}</div>
                                <div className="text-sm text-muted-foreground">{event.time}</div>
                              </td>
                              <td className="py-3 px-2">{event.location}</td>
                              <td className="py-3 px-2">
                                <span className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                                  {event.type}
                                </span>
                              </td>
                              <td className="py-3 px-2">
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEditEvent(event)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDeleteEvent(event._id)}
                                    disabled={deletingId === event._id}
                                  >
                                    {deletingId === event._id ? (
                                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-900" />
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
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No events found
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gallery Images</h2>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => {
                    setUseMultiImageForm(false);
                    setEditingGalleryImage(null);
                    setShowGalleryForm(true);
                  }} 
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" /> Single Image
                </Button>
                <Button 
                  onClick={() => {
                    setUseMultiImageForm(true);
                    setEditingGalleryImage(null);
                    setShowGalleryForm(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Multiple Images
                </Button>
              </div>
            </div>
            
            {showGalleryForm ? (
              useMultiImageForm ? (
                <MultiImageGalleryForm
                  onSubmit={handleGalleryImageSave}
                  onCancel={() => {
                    setShowGalleryForm(false);
                    setUseMultiImageForm(false);
                    setEditingGalleryImage(null);
                  }}
                  isLoading={loading}
                />
              ) : (
                <GalleryForm
                  initialData={editingGalleryImage}
                  onSubmit={handleGalleryImageSave}
                  onCancel={() => {
                    setShowGalleryForm(false);
                    setEditingGalleryImage(null);
                  }}
                  isLoading={loading}
                />
              )
            ) : (
              <Card>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">Loading gallery images...</div>
                  ) : galleryImages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {galleryImages.map((image) => (
                        <div key={image._id} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-200 border-2 border-dashed rounded-t-lg w-full h-48 flex items-center justify-center">
                            {image.file_url ? (
                              <img 
                                src={image.file_url} 
                                alt={image.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-500">No image</span>
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium truncate">{image.title}</h3>
                            <div className="flex justify-between items-center mt-2">
                              {image.category && (
                                <span className="px-2 py-1 rounded-full text-xs bg-pink-100 text-pink-800">
                                  {image.category}
                                </span>
                              )}
                              <div className="flex space-x-1">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setUseMultiImageForm(false);
                                    handleEditGalleryImage(image);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDeleteGalleryImage(image._id)}
                                  disabled={deletingId === image._id}
                                >
                                  {deletingId === image._id ? (
                                    <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-gray-900" />
                                  ) : (
                                    <Trash2 className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No images found
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <ApplicationDetailModal 
        application={selectedApplication} 
        open={showApplicationModal} 
        onClose={() => setShowApplicationModal(false)} 
      />
      
      <ApplicationFormModal
        open={showApplicationFormModal}
        onOpenChange={setShowApplicationFormModal}
        application={editingApplication}
        onSave={handleApplicationSave}
      />
      
      <ResourceForm
        open={showResourceForm}
        onOpenChange={setShowResourceForm}
        resource={editingResource}
        onSave={handleResourceSave}
      />
    </div>
  );
}