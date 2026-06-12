"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  Image as ImageIcon, 
  FileText, 
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Trophy,
  Bell,
  Megaphone,
} from "lucide-react";
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
  updateEvent,
  getHallOfFameEntries,
  deleteHallOfFame
} from "@/lib/admin/services";
import { generateApplicationPDF } from "@/lib/pdf";
import ApplicationDetailModal from "@/components/admin/ApplicationDetailModal";
import AnnouncementForm from "@/components/admin/AnnouncementForm";
import EventForm from "@/components/admin/EventForm";
import Messages from "@/components/admin/Messages";
import ApplicationFormModal from "@/components/admin/ApplicationFormModal";
import ResourceForm from "@/components/admin/ResourceForm";
import GalleryForm from "@/components/admin/GalleryForm";
import MultiImageGalleryForm from "@/components/admin/MultiImageGalleryForm";
import JobApplicationsManager from "@/components/admin/JobApplicationsManager";
import HallOfFameForm from "@/components/admin/HallOfFameForm";
import AdminShell from "@/components/admin/AdminShell";
import AdminConfirmDialog, { type AdminConfirmState } from "@/components/admin/AdminConfirmDialog";
import {
  AdminEmptyState,
  AdminFilterSelect,
  AdminIconButton,
  AdminLoadingState,
  AdminMobileCard,
  AdminNoResults,
  AdminOverviewRow,
  AdminOverviewSection,
  AdminPageHeader,
  AdminPanel,
  AdminQuickAction,
  AdminRefreshButton,
  AdminSearchInput,
  AdminStatCard,
  AdminStatusBadge,
  AdminTableWrapper,
  AdminToolbar,
  adminTdClassName,
  adminThClassName,
  adminTrClassName,
} from "@/components/admin/admin-ui";
import { adminToast } from "@/lib/admin/notify";

function paymentTone(status: string): "success" | "warning" | "danger" | "neutral" {
  if (status === "completed") return "success";
  if (status === "pending") return "warning";
  return "danger";
}

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

interface HallOfFameEntry {
  id: string;
  title: string;
  learner_names: string;
  achievement: string;
  achievement_date: string;
  image_url: string;
  category?: string;
  campus?: string;
  is_featured?: boolean;
  is_published?: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const { isAuthenticated, isLoading: authLoading, logout } = useAdminAuth();
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
  const [hallOfFameEntries, setHallOfFameEntries] = useState<HallOfFameEntry[]>([]);
  const [showHallOfFameForm, setShowHallOfFameForm] = useState(false);
  const [editingHallOfFame, setEditingHallOfFame] = useState<HallOfFameEntry | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<AdminConfirmState | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [applicationSearch, setApplicationSearch] = useState("");
  const [applicationCampus, setApplicationCampus] = useState("all");
  const [applicationPayment, setApplicationPayment] = useState("all");
  const [announcementSearch, setAnnouncementSearch] = useState("");
  const [announcementCategory, setAnnouncementCategory] = useState("all");
  const [eventSearch, setEventSearch] = useState("");
  const [resourceSearch, setResourceSearch] = useState("");
  const [resourceCategory, setResourceCategory] = useState("all");

  const requestConfirm = (config: Omit<AdminConfirmState, "open">) => {
    setConfirmDialog({ ...config, open: true });
  };

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
          const [apps, anns, evts, imgs, res, msgs, hofEntries] = await Promise.all([
            getApplications(),
            getAnnouncements(),
            getEvents(),
            getGalleryImages(),
            getResources(),
            getMessages(),
            getHallOfFameEntries()
          ]);
          setApplications(apps);
          setAnnouncements(anns);
          setEvents(evts);
          setGalleryImages(imgs);
          setResources(res);
          setMessages(msgs);
          setHallOfFameEntries(hofEntries);
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
        case "hall-of-fame":
          const hofData = await getHallOfFameEntries();
          setHallOfFameEntries(hofData);
          break;
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to login if not authenticated (after loading check completes)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Load data when component mounts or tab changes
  useEffect(() => {
    loadData();
  }, [activeTab, isAuthenticated]);

  const handleDeleteApplication = (id: string) => {
    requestConfirm({
      title: "Delete application",
      description: "This application will be permanently removed. This action cannot be undone.",
      onConfirm: async () => {
        try {
          setConfirmLoading(true);
          setDeletingId(id);
          await deleteApplication(id);
          setApplications(applications.filter((app) => app._id !== id));
          adminToast.success("Application deleted");
        } catch (error) {
          console.error("Error deleting application:", error);
          adminToast.error("Failed to delete application");
        } finally {
          setDeletingId(null);
          setConfirmLoading(false);
        }
      },
    });
  };

  const handleDeleteAnnouncement = (id: string) => {
    requestConfirm({
      title: "Delete announcement",
      description: "This announcement will be permanently removed from the website.",
      onConfirm: async () => {
        try {
          setConfirmLoading(true);
          setDeletingId(id);
          await deleteAnnouncement(id);
          setAnnouncements(announcements.filter((ann) => ann._id !== id));
          adminToast.success("Announcement deleted");
        } catch (error) {
          console.error("Error deleting announcement:", error);
          adminToast.error("Failed to delete announcement");
        } finally {
          setDeletingId(null);
          setConfirmLoading(false);
        }
      },
    });
  };

  const handleDeleteEvent = (id: string) => {
    requestConfirm({
      title: "Delete event",
      description: "This event will be permanently removed from the calendar.",
      onConfirm: async () => {
        try {
          setConfirmLoading(true);
          setDeletingId(id);
          await deleteEvent(id);
          setEvents(events.filter((event) => event._id !== id));
          adminToast.success("Event deleted");
        } catch (error) {
          console.error("Error deleting event:", error);
          adminToast.error("Failed to delete event");
        } finally {
          setDeletingId(null);
          setConfirmLoading(false);
        }
      },
    });
  };

  const handleDeleteGalleryImage = (id: string) => {
    requestConfirm({
      title: "Delete gallery image",
      description: "This image will be permanently removed from the gallery.",
      onConfirm: async () => {
        try {
          setConfirmLoading(true);
          setDeletingId(id);
          await deleteGalleryImage(id);
          setGalleryImages(galleryImages.filter((img) => img._id !== id));
          adminToast.success("Gallery image deleted");
        } catch (error) {
          console.error("Error deleting gallery image:", error);
          adminToast.error("Failed to delete gallery image");
        } finally {
          setDeletingId(null);
          setConfirmLoading(false);
        }
      },
    });
  };

  const handleDeleteResource = (id: string) => {
    requestConfirm({
      title: "Delete resource",
      description: "This resource will be permanently removed from the website.",
      onConfirm: async () => {
        try {
          setConfirmLoading(true);
          setDeletingId(id);
          await deleteResource(id);
          setResources(resources.filter((res) => res._id !== id));
          adminToast.success("Resource deleted");
        } catch (error) {
          console.error("Error deleting resource:", error);
          adminToast.error("Failed to delete resource");
        } finally {
          setDeletingId(null);
          setConfirmLoading(false);
        }
      },
    });
  };

  const handleDeleteHallOfFame = (id: string) => {
    requestConfirm({
      title: "Delete Hall of Fame entry",
      description: "This achievement entry will be permanently removed from the Hall of Fame.",
      onConfirm: async () => {
        try {
          setConfirmLoading(true);
          setDeletingId(id);
          await deleteHallOfFame(id);
          setHallOfFameEntries(hallOfFameEntries.filter((entry) => entry.id !== id));
          adminToast.success("Hall of Fame entry deleted");
        } catch (error) {
          console.error("Error deleting Hall of Fame entry:", error);
          adminToast.error("Failed to delete Hall of Fame entry");
        } finally {
          setDeletingId(null);
          setConfirmLoading(false);
        }
      },
    });
  };

  const handleEditHallOfFame = (entry: HallOfFameEntry) => {
    setEditingHallOfFame(entry);
    setShowHallOfFameForm(true);
  };

  const handleCreateHallOfFame = () => {
    setEditingHallOfFame(null);
    setShowHallOfFameForm(true);
  };

  const handleHallOfFameSave = () => {
    setShowHallOfFameForm(false);
    setEditingHallOfFame(null);
    loadData();
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
      adminToast.error("Failed to download application");
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
      adminToast.success("Announcement created");
    } catch (error) {
      console.error("Error creating announcement:", error);
      adminToast.error("Failed to create announcement");
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
        adminToast.success("Announcement updated");
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
        adminToast.success("Announcement created");
      }
      
      // Close the form and refresh data
      setShowAnnouncementForm(false);
      setEditingAnnouncement(null);
      loadData();
    } catch (error) {
      console.error("Error saving announcement:", error);
      adminToast.error("Failed to save announcement");
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
      
      adminToast.success(
        `Gallery ${dataArray.length > 1 ? "images" : "image"} ${editingGalleryImage ? "updated" : "created"}`
      );
      
      // Close the form and refresh data
      setShowGalleryForm(false);
      setEditingGalleryImage(null);
      loadData();
    } catch (error) {
      console.error("Error saving gallery image:", error);
      adminToast.error("Failed to save gallery image");
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
        adminToast.success("Event updated");
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
        adminToast.success("Event created");
      }
      
      // Close the form and refresh data
      setShowEventForm(false);
      setEditingEvent(null);
      loadData();
    } catch (error) {
      console.error("Error saving event:", error);
      adminToast.error("Failed to save event");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-UG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const unreadMessageCount = useMemo(
    () => messages.filter((m) => !m.read).length,
    [messages]
  );

  const campusOptions = useMemo(() => {
    const campuses = [...new Set(applications.map((a) => a.campus).filter(Boolean))];
    return [
      { value: "all", label: "All campuses" },
      ...campuses.map((c) => ({ value: c, label: c })),
    ];
  }, [applications]);

  const resourceCategoryOptions = useMemo(() => {
    const cats = [...new Set(resources.map((r) => r.category).filter(Boolean))];
    return [
      { value: "all", label: "All categories" },
      ...cats.map((c) => ({ value: c, label: c })),
    ];
  }, [resources]);

  const announcementCategoryOptions = useMemo(() => {
    const cats = [...new Set(announcements.map((a) => a.category).filter(Boolean))];
    return [
      { value: "all", label: "All categories" },
      ...cats.map((c) => ({ value: c, label: c })),
    ];
  }, [announcements]);

  const filteredApplications = useMemo(() => {
    const q = applicationSearch.trim().toLowerCase();
    return applications.filter((app) => {
      const matchesSearch =
        !q ||
        app.studentName.toLowerCase().includes(q) ||
        app.parentName.toLowerCase().includes(q) ||
        app.email?.toLowerCase().includes(q) ||
        app.applicationId?.toLowerCase().includes(q);
      const matchesCampus = applicationCampus === "all" || app.campus === applicationCampus;
      const matchesPayment =
        applicationPayment === "all" || app.paymentStatus === applicationPayment;
      return matchesSearch && matchesCampus && matchesPayment;
    });
  }, [applications, applicationSearch, applicationCampus, applicationPayment]);

  const filteredAnnouncements = useMemo(() => {
    const q = announcementSearch.trim().toLowerCase();
    return announcements.filter((ann) => {
      const matchesSearch =
        !q ||
        ann.title.toLowerCase().includes(q) ||
        ann.content.toLowerCase().includes(q);
      const matchesCategory =
        announcementCategory === "all" || ann.category === announcementCategory;
      return matchesSearch && matchesCategory;
    });
  }, [announcements, announcementSearch, announcementCategory]);

  const filteredEvents = useMemo(() => {
    const q = eventSearch.trim().toLowerCase();
    return events.filter(
      (event) =>
        !q ||
        event.title.toLowerCase().includes(q) ||
        event.description?.toLowerCase().includes(q) ||
        event.location?.toLowerCase().includes(q)
    );
  }, [events, eventSearch]);

  const filteredResources = useMemo(() => {
    const q = resourceSearch.trim().toLowerCase();
    return resources.filter((res) => {
      const matchesSearch =
        !q ||
        res.title.toLowerCase().includes(q) ||
        res.description?.toLowerCase().includes(q);
      const matchesCategory = resourceCategory === "all" || res.category === resourceCategory;
      return matchesSearch && matchesCategory;
    });
  }, [resources, resourceSearch, resourceCategory]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return [...events]
      .filter((e) => new Date(e.start_date || e.date) >= now)
      .sort(
        (a, b) =>
          new Date(a.start_date || a.date).getTime() -
          new Date(b.start_date || b.date).getTime()
      )
      .slice(0, 4);
  }, [events]);

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <AdminLoadingState message="Checking authentication..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <AdminShell activeTab={activeTab} onTabChange={setActiveTab} onLogout={logout}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

          <TabsContent value="overview" className="space-y-6 mt-0">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
              <AdminStatCard title="Applications" value={applications.length} subtitle="Student submissions" icon={Users} loading={loading} accent="emerald" onClick={() => setActiveTab("applications")} />
              <AdminStatCard title="Announcements" value={announcements.length} subtitle="Published updates" icon={Bell} loading={loading} accent="violet" onClick={() => setActiveTab("announcements")} />
              <AdminStatCard title="Events" value={events.length} subtitle="Calendar entries" icon={Calendar} loading={loading} accent="blue" onClick={() => setActiveTab("events")} />
              <AdminStatCard title="Resources" value={resources.length} subtitle="Downloadable files" icon={FileText} loading={loading} accent="amber" onClick={() => setActiveTab("resources")} />
              <AdminStatCard title="Messages" value={messages.length} subtitle={unreadMessageCount > 0 ? `${unreadMessageCount} unread` : "Contact inquiries"} icon={MessageSquare} loading={loading} accent="rose" onClick={() => setActiveTab("messages")} />
              <AdminStatCard title="Gallery" value={galleryImages.length} subtitle="Photos uploaded" icon={ImageIcon} loading={loading} accent="slate" onClick={() => setActiveTab("gallery")} />
            </div>

            <div className="flex flex-wrap gap-2">
              <AdminQuickAction label="New announcement" icon={Megaphone} onClick={() => { setEditingAnnouncement(null); setShowAnnouncementForm(true); setActiveTab("announcements"); }} />
              <AdminQuickAction label="Add event" icon={Calendar} onClick={() => { setEditingEvent(null); setShowEventForm(true); setActiveTab("events"); }} />
              <AdminQuickAction label="Add resource" icon={FileText} onClick={() => { setEditingResource(null); setShowResourceForm(true); setActiveTab("resources"); }} />
              <AdminRefreshButton onClick={loadData} loading={loading} />
            </div>
            
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              <AdminOverviewSection
                title="Recent Applications"
                action={
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("applications")} className="text-amber-700 hover:text-amber-800">
                    View all
                  </Button>
                }
              >
                {loading ? (
                  <AdminLoadingState message="Loading..." />
                ) : applications.length > 0 ? (
                  <div>
                    {applications.slice(0, 5).map((app) => (
                      <AdminOverviewRow
                        key={app._id}
                        primary={app.studentName}
                        secondary={`${app.gradeLevel} · ${app.campus}`}
                        meta={formatDate(app._createdAt)}
                        badge={<AdminStatusBadge label={app.paymentStatus} tone={paymentTone(app.paymentStatus)} />}
                        onClick={() => { setActiveTab("applications"); handleViewApplication(app); }}
                      />
                    ))}
                  </div>
                ) : (
                  <AdminEmptyState title="No applications yet" description="New student applications will appear here." icon={Users} />
                )}
              </AdminOverviewSection>

              <AdminOverviewSection
                title="Recent Messages"
                action={
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("messages")} className="text-amber-700 hover:text-amber-800">
                    View all
                  </Button>
                }
              >
                {loading ? (
                  <AdminLoadingState message="Loading..." />
                ) : messages.length > 0 ? (
                  <div>
                    {messages.slice(0, 5).map((msg) => (
                      <AdminOverviewRow
                        key={msg.id}
                        primary={msg.name}
                        secondary={msg.subject}
                        meta={formatDate(msg.created_at)}
                        badge={
                          <AdminStatusBadge
                            label={msg.read ? "Read" : "Unread"}
                            tone={msg.read ? "success" : "warning"}
                          />
                        }
                        onClick={() => setActiveTab("messages")}
                      />
                    ))}
                  </div>
                ) : (
                  <AdminEmptyState title="No messages yet" description="Contact form submissions will appear here." icon={MessageSquare} />
                )}
              </AdminOverviewSection>

              <AdminOverviewSection
                title="Upcoming Events"
                action={
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("events")} className="text-amber-700 hover:text-amber-800">
                    View all
                  </Button>
                }
              >
                {loading ? (
                  <AdminLoadingState message="Loading..." />
                ) : upcomingEvents.length > 0 ? (
                  <div>
                    {upcomingEvents.map((event) => (
                      <AdminOverviewRow
                        key={event._id}
                        primary={event.title}
                        secondary={event.location}
                        meta={formatDate(event.start_date || event.date)}
                        onClick={() => setActiveTab("events")}
                      />
                    ))}
                  </div>
                ) : (
                  <AdminEmptyState title="No upcoming events" description="Scheduled events will appear here." icon={Calendar} />
                )}
              </AdminOverviewSection>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4 mt-0">
            <AdminPageHeader
              title="Applications"
              description="Review and manage student admission applications."
              action={
                <Button onClick={handleCreateApplication}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Application
                </Button>
              }
            />
            <AdminToolbar resultCount={filteredApplications.length} totalCount={applications.length}>
              <AdminSearchInput
                value={applicationSearch}
                onChange={setApplicationSearch}
                placeholder="Search by student, parent, or email..."
              />
              <AdminFilterSelect
                value={applicationCampus}
                onChange={setApplicationCampus}
                placeholder="Campus"
                options={campusOptions}
              />
              <AdminFilterSelect
                value={applicationPayment}
                onChange={setApplicationPayment}
                placeholder="Payment"
                options={[
                  { value: "all", label: "All payments" },
                  { value: "completed", label: "Completed" },
                  { value: "pending", label: "Pending" },
                  { value: "failed", label: "Failed" },
                ]}
              />
              <AdminRefreshButton onClick={loadData} loading={loading} />
            </AdminToolbar>
            <AdminPanel>
              <div className="p-4 sm:p-6">
                {loading ? (
                  <AdminLoadingState message="Loading applications..." />
                ) : applications.length === 0 ? (
                  <AdminEmptyState
                    title="No applications found"
                    description="Applications submitted through the website will appear here."
                    icon={Users}
                    action={
                      <Button onClick={handleCreateApplication}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add application
                      </Button>
                    }
                  />
                ) : filteredApplications.length === 0 ? (
                  <AdminNoResults
                    onClear={() => {
                      setApplicationSearch("");
                      setApplicationCampus("all");
                      setApplicationPayment("all");
                    }}
                  />
                ) : (
                  <>
                    <div className="hidden lg:block">
                      <AdminTableWrapper>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50/80">
                            <th className={adminThClassName()}>Student Name</th>
                            <th className={adminThClassName()}>Grade Level</th>
                            <th className={adminThClassName()}>Parent Name</th>
                            <th className={adminThClassName()}>Campus</th>
                            <th className={adminThClassName()}>Payment Status</th>
                            <th className={adminThClassName()}>Submitted</th>
                            <th className={adminThClassName()}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredApplications.map((application) => (
                            <tr key={application._id} className={adminTrClassName()}>
                              <td className={adminTdClassName()}>{application.studentName}</td>
                              <td className={adminTdClassName()}>{application.gradeLevel}</td>
                              <td className={adminTdClassName()}>{application.parentName}</td>
                              <td className={adminTdClassName()}>{application.campus}</td>
                              <td className={adminTdClassName()}>
                                <AdminStatusBadge label={application.paymentStatus} tone={paymentTone(application.paymentStatus)} />
                              </td>
                              <td className={adminTdClassName()}>
                                {new Date(application._createdAt).toLocaleDateString()}
                              </td>
                              <td className={adminTdClassName()}>
                                <div className="flex gap-1">
                                  <AdminIconButton label="View application" onClick={() => handleViewApplication(application)}>
                                    <Eye className="h-4 w-4" />
                                  </AdminIconButton>
                                  <AdminIconButton label="Download PDF" onClick={() => handleDownloadApplication(application)}>
                                    <Download className="h-4 w-4" />
                                  </AdminIconButton>
                                  <AdminIconButton label="Edit application" onClick={() => handleEditApplication(application)}>
                                    <Edit className="h-4 w-4" />
                                  </AdminIconButton>
                                  <AdminIconButton
                                    label="Delete application"
                                    variant="danger"
                                    disabled={deletingId === application._id}
                                    onClick={() => handleDeleteApplication(application._id)}
                                  >
                                    {deletingId === application._id ? (
                                      <div className="h-4 w-4 animate-spin rounded-full border border-slate-400 border-t-transparent" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </AdminIconButton>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </AdminTableWrapper>
                    </div>
                    
                    <div className="lg:hidden space-y-3">
                      {filteredApplications.map((application) => (
                        <AdminMobileCard
                          key={application._id}
                          title={application.studentName}
                          subtitle={`${application.gradeLevel} · ${application.campus}`}
                          meta={`Submitted ${formatDate(application._createdAt)} · Parent: ${application.parentName}`}
                          badge={
                            <AdminStatusBadge
                              label={application.paymentStatus}
                              tone={paymentTone(application.paymentStatus)}
                            />
                          }
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewApplication(application)}>
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDownloadApplication(application)}>
                              <Download className="h-4 w-4 mr-1" /> PDF
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEditApplication(application)}>
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteApplication(application._id)}
                              disabled={deletingId === application._id}
                              className="hover:border-red-200 hover:text-red-600"
                            >
                              {deletingId === application._id ? (
                                <div className="h-4 w-4 animate-spin rounded-full border border-slate-400 border-t-transparent" />
                              ) : (
                                <><Trash2 className="h-4 w-4 mr-1" /> Delete</>
                              )}
                            </Button>
                          </div>
                        </AdminMobileCard>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </AdminPanel>
          </TabsContent>

          <TabsContent value="job-applications" className="space-y-4 mt-0">
            <JobApplicationsManager />
          </TabsContent>

          <TabsContent value="resources" className="space-y-4 mt-0">
            <AdminPageHeader
              title="Resources"
              description="Manage downloadable files and documents for the website."
              action={
                <Button onClick={handleCreateResource}>
                  <Plus className="mr-2 h-4 w-4" /> Add Resource
                </Button>
              }
            />
            <AdminToolbar resultCount={filteredResources.length} totalCount={resources.length}>
              <AdminSearchInput
                value={resourceSearch}
                onChange={setResourceSearch}
                placeholder="Search resources..."
              />
              <AdminFilterSelect
                value={resourceCategory}
                onChange={setResourceCategory}
                placeholder="Category"
                options={resourceCategoryOptions}
              />
              <AdminRefreshButton onClick={loadData} loading={loading} />
            </AdminToolbar>
            <AdminPanel>
              <div className="p-4 sm:p-6">
                {loading ? (
                  <AdminLoadingState message="Loading resources..." />
                ) : resources.length === 0 ? (
                  <AdminEmptyState title="No resources found" description="Upload documents and files for visitors to download." icon={FileText} />
                ) : filteredResources.length === 0 ? (
                  <AdminNoResults onClear={() => { setResourceSearch(""); setResourceCategory("all"); }} />
                ) : (
                  <AdminTableWrapper>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80">
                          <th className={adminThClassName()}>Title</th>
                          <th className={adminThClassName()}>Category</th>
                          <th className={adminThClassName()}>Type</th>
                          <th className={adminThClassName()}>Size</th>
                          <th className={adminThClassName()}>Date</th>
                          <th className={adminThClassName()}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResources.map((resource) => (
                          <tr key={resource._id} className={adminTrClassName()}>
                            <td className={adminTdClassName()}>
                              <div className="font-medium">{resource.title}</div>
                              <div className="line-clamp-1 text-sm text-slate-500">{resource.description}</div>
                            </td>
                            <td className={adminTdClassName()}>
                              <AdminStatusBadge label={resource.category} tone="info" />
                            </td>
                            <td className={adminTdClassName()}>{resource.type}</td>
                            <td className={adminTdClassName()}>{resource.fileSize}</td>
                            <td className={adminTdClassName()}>{formatDate(resource.uploadDate)}</td>
                            <td className={adminTdClassName()}>
                              <div className="flex gap-1">
                                <AdminIconButton label="View resource" onClick={() => handleViewResource(resource)}>
                                  <Eye className="h-4 w-4" />
                                </AdminIconButton>
                                <AdminIconButton label="Edit resource" onClick={() => handleEditResource(resource)}>
                                  <Edit className="h-4 w-4" />
                                </AdminIconButton>
                                <AdminIconButton
                                  label="Delete resource"
                                  variant="danger"
                                  disabled={deletingId === resource._id}
                                  onClick={() => handleDeleteResource(resource._id)}
                                >
                                  {deletingId === resource._id ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border border-slate-400 border-t-transparent" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </AdminIconButton>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </AdminTableWrapper>
                )}
              </div>
            </AdminPanel>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4 mt-0">
            <Messages />
          </TabsContent>

          <TabsContent value="announcements" className="space-y-4 mt-0">
            <AdminPageHeader
              title="Announcements"
              description="Publish news and updates for the school community."
              action={
                <Button onClick={() => {
                  setEditingAnnouncement(null);
                  setShowAnnouncementForm(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" /> Add Announcement
                </Button>
              }
            />
            
            {!showAnnouncementForm && (
              <AdminToolbar resultCount={filteredAnnouncements.length} totalCount={announcements.length}>
                <AdminSearchInput
                  value={announcementSearch}
                  onChange={setAnnouncementSearch}
                  placeholder="Search announcements..."
                />
                <AdminFilterSelect
                  value={announcementCategory}
                  onChange={setAnnouncementCategory}
                  placeholder="Category"
                  options={announcementCategoryOptions}
                />
                <AdminRefreshButton onClick={loadData} loading={loading} />
              </AdminToolbar>
            )}

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
              <AdminPanel>
              <div className="p-4 sm:p-6">
                {loading ? (
                  <AdminLoadingState message="Loading announcements..." />
                ) : announcements.length === 0 ? (
                  <AdminEmptyState title="No announcements found" description="Create your first announcement to share news with visitors." />
                ) : filteredAnnouncements.length === 0 ? (
                  <AdminNoResults onClear={() => { setAnnouncementSearch(""); setAnnouncementCategory("all"); }} />
                ) : (
                  <AdminTableWrapper>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80">
                          <th className={adminThClassName()}>Title</th>
                          <th className={adminThClassName()}>Content</th>
                          <th className={adminThClassName()}>Category</th>
                          <th className={adminThClassName()}>Date</th>
                          <th className={adminThClassName()}>Pinned</th>
                          <th className={adminThClassName()}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAnnouncements.map((announcement) => (
                          <tr key={announcement._id} className={adminTrClassName()}>
                            <td className={`${adminTdClassName()} font-medium`}>{announcement.title}</td>
                            <td className={`${adminTdClassName()} line-clamp-2 max-w-xs`}>{announcement.content}</td>
                            <td className={adminTdClassName()}>
                              <AdminStatusBadge label={announcement.category} tone="purple" />
                            </td>
                            <td className={adminTdClassName()}>{formatDate(announcement.date)}</td>
                            <td className={adminTdClassName()}>
                              <AdminStatusBadge
                                label={announcement.pinned ? "Pinned" : "No"}
                                tone={announcement.pinned ? "success" : "neutral"}
                              />
                            </td>
                            <td className={adminTdClassName()}>
                              <div className="flex gap-1">
                                <AdminIconButton label="Edit announcement" onClick={() => handleEditAnnouncement(announcement)}>
                                  <Edit className="h-4 w-4" />
                                </AdminIconButton>
                                <AdminIconButton
                                  label="Delete announcement"
                                  variant="danger"
                                  disabled={deletingId === announcement._id}
                                  onClick={() => handleDeleteAnnouncement(announcement._id)}
                                >
                                  {deletingId === announcement._id ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border border-slate-400 border-t-transparent" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </AdminIconButton>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </AdminTableWrapper>
                )}
              </div>
              </AdminPanel>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-4 mt-0">
            <AdminPageHeader
              title="Events"
              description="Manage school calendar events and activities."
              action={
                <Button onClick={handleCreateEvent}>
                  <Plus className="mr-2 h-4 w-4" /> Add Event
                </Button>
              }
            />
            
            {!showEventForm && (
              <AdminToolbar resultCount={filteredEvents.length} totalCount={events.length}>
                <AdminSearchInput
                  value={eventSearch}
                  onChange={setEventSearch}
                  placeholder="Search events..."
                />
                <AdminRefreshButton onClick={loadData} loading={loading} />
              </AdminToolbar>
            )}

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
              <AdminPanel>
                <div className="p-4 sm:p-6">
                  {loading ? (
                    <AdminLoadingState message="Loading events..." />
                  ) : events.length === 0 ? (
                    <AdminEmptyState title="No events found" description="Add events to keep the school calendar up to date." icon={Calendar} />
                  ) : filteredEvents.length === 0 ? (
                    <AdminNoResults onClear={() => setEventSearch("")} />
                  ) : (
                    <AdminTableWrapper>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50/80">
                            <th className={adminThClassName()}>Title</th>
                            <th className={adminThClassName()}>Description</th>
                            <th className={adminThClassName()}>Date & Time</th>
                            <th className={adminThClassName()}>Location</th>
                            <th className={adminThClassName()}>Type</th>
                            <th className={adminThClassName()}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredEvents.map((event) => (
                            <tr key={event._id} className={adminTrClassName()}>
                              <td className={`${adminTdClassName()} font-medium`}>{event.title}</td>
                              <td className={`${adminTdClassName()} line-clamp-2 max-w-xs`}>{event.description}</td>
                              <td className={adminTdClassName()}>
                                <div>{formatDate(event.date)}</div>
                                <div className="text-sm text-slate-500">{event.time}</div>
                              </td>
                              <td className={adminTdClassName()}>{event.location}</td>
                              <td className={adminTdClassName()}>
                                <AdminStatusBadge label={event.type} tone="purple" />
                              </td>
                              <td className={adminTdClassName()}>
                                <div className="flex gap-1">
                                  <AdminIconButton label="Edit event" onClick={() => handleEditEvent(event)}>
                                    <Edit className="h-4 w-4" />
                                  </AdminIconButton>
                                  <AdminIconButton
                                    label="Delete event"
                                    variant="danger"
                                    disabled={deletingId === event._id}
                                    onClick={() => handleDeleteEvent(event._id)}
                                  >
                                    {deletingId === event._id ? (
                                      <div className="h-4 w-4 animate-spin rounded-full border border-slate-400 border-t-transparent" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </AdminIconButton>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </AdminTableWrapper>
                  )}
                </div>
              </AdminPanel>
            )}
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4 mt-0">
            <AdminPageHeader
              title="Gallery"
              description="Upload and organize photos displayed on the website."
              action={
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={() => {
                    setUseMultiImageForm(false);
                    setEditingGalleryImage(null);
                    setShowGalleryForm(true);
                  }} 
                  variant="outline"
                  className="flex-1 sm:flex-initial"
                >
                  <Plus className="mr-2 h-4 w-4" /> 
                  <span className="hidden sm:inline">Single Image</span>
                  <span className="sm:hidden">Single</span>
                </Button>
                <Button 
                  onClick={() => {
                    setUseMultiImageForm(true);
                    setEditingGalleryImage(null);
                    setShowGalleryForm(true);
                  }}
                  className="flex-1 sm:flex-initial"
                >
                  <Plus className="mr-2 h-4 w-4" /> 
                  <span className="hidden sm:inline">Multiple Images</span>
                  <span className="sm:hidden">Multiple</span>
                </Button>
              </div>
              }
            />
            
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
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="pt-6">
                  {loading ? (
                    <AdminLoadingState message="Loading gallery images..." />
                  ) : galleryImages.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {galleryImages.map((image) => (
                        <div key={image._id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                          <div className="flex h-48 w-full items-center justify-center bg-slate-100">
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
                    <AdminEmptyState title="No images found" description="Upload photos to build the school gallery." icon={ImageIcon} />
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="hall-of-fame" className="space-y-4 mt-0">
            <AdminPageHeader
              title="Hall of Fame"
              description="Highlight outstanding student achievements on the homepage."
              action={
                <Button onClick={handleCreateHallOfFame}>
                  <Plus className="mr-2 h-4 w-4" /> Add Entry
                </Button>
              }
            />
            
            {loading ? (
              <Card className="border-slate-200 shadow-sm">
                <CardContent><AdminLoadingState message="Loading Hall of Fame entries..." /></CardContent>
              </Card>
            ) : (
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  {hallOfFameEntries.length > 0 ? (
                    <div className="space-y-4">
                      {hallOfFameEntries.map((entry) => (
                        <div 
                          key={entry.id} 
                          className="flex flex-col gap-4 rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md sm:flex-row"
                        >
                          <div className="flex-shrink-0">
                            <img 
                              src={entry.image_url} 
                              alt={entry.title}
                              className="w-full sm:w-32 h-32 object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                              <div>
                                <h3 className="font-semibold text-lg">{entry.title}</h3>
                                <p className="text-sm text-gray-600">{entry.learner_names}</p>
                              </div>
                              <div className="flex gap-2">
                                {entry.is_featured && (
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                    Featured
                                  </span>
                                )}
                                {!entry.is_published && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                    Unpublished
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{entry.achievement}</p>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                              {entry.category && (
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                                  {entry.category}
                                </span>
                              )}
                              {entry.campus && (
                                <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
                                  {entry.campus}
                                </span>
                              )}
                              <span>{new Date(entry.achievement_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditHallOfFame(entry)}
                              >
                                <Edit className="h-4 w-4 mr-1" /> Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteHallOfFame(entry.id)}
                                disabled={deletingId === entry.id}
                              >
                                {deletingId === entry.id ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-900" />
                                ) : (
                                  <>
                                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <AdminEmptyState
                      title="No Hall of Fame entries yet"
                      description="Celebrate student achievements by adding your first entry."
                      icon={Trophy}
                      action={
                        <Button onClick={handleCreateHallOfFame}>
                          <Plus className="mr-2 h-4 w-4" /> Add Entry
                        </Button>
                      }
                    />
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

      <AdminConfirmDialog
        state={confirmDialog}
        onOpenChange={(open) => !open && setConfirmDialog(null)}
        isLoading={confirmLoading}
      />
      
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

      {showHallOfFameForm && (
        <HallOfFameForm
          entry={editingHallOfFame}
          onClose={() => {
            setShowHallOfFameForm(false);
            setEditingHallOfFame(null);
          }}
          onSave={handleHallOfFameSave}
        />
      )}
    </AdminShell>
  );
}