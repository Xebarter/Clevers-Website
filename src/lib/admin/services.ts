import { client } from "@/lib/sanity/client";
import {
  applicationsService,
  announcementsService,
  eventsService,
  galleryService,
  resourcesService,
  messagesService,
  hallOfFameService,
  type Application,
  type Announcement,
  type Event,
  type GalleryImage,
  type Resource,
  type Message,
  type HallOfFame
} from "../../../lib/supabase/services";

interface ParsedApplicationMetadata {
  applicationId?: string;
  relationship?: string;
  previousSchool?: string | null;
  specialNeeds?: string | null;
  howHeard?: string;
  paymentStatus?: "pending" | "completed" | "failed";
  submittedAt?: string;
}

const parseApplicationMetadata = (message?: string | null): ParsedApplicationMetadata => {
  if (!message) return {};

  try {
    const parsed = JSON.parse(message) as ParsedApplicationMetadata;
    return parsed ?? {};
  } catch (error) {
    console.warn("Failed to parse application metadata", error);
    return {};
  }
};

// Application services
export async function getApplications() {
  // Use the admin API route so server-side (service role) client is used
  const res = await fetch('/api/admin/applications');
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch applications');
  }

  const applications = await res.json();

  return applications.map((application: any) => {
    const metadata = parseApplicationMetadata(application.message);

    // Always use the actual database ID for _id to ensure delete operations work correctly
    const dbId = application.id;
    const applicationId = metadata.applicationId ?? dbId ?? `application-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    return {
      _id: dbId,
      applicationId,
      studentName: application.name ?? "",
      dateOfBirth: application.date_of_birth ?? "",
      gender: application.gender ?? "",
      gradeLevel: application.grade_level ?? "",
      parentName: application.parent_name ?? "",
      relationship: metadata.relationship ?? "",
      phone: application.phone ?? "",
      email: application.email ?? "",
      campus: application.campus ?? "",
      boarding: application.boarding ?? "",
      howHeard: metadata.howHeard ?? "",
      paymentStatus: metadata.paymentStatus ?? "pending",
      previousSchool: metadata.previousSchool ?? "",
      specialNeeds: metadata.specialNeeds ?? "",
      submittedAt: metadata.submittedAt ?? application.created_at ?? new Date().toISOString(),
      _createdAt: application.created_at ?? new Date().toISOString(),
    };
  });
}

export async function createApplication(data: Omit<Application, 'id' | 'created_at'>) {
  // Extract the metadata from the message field
  const metadata = parseApplicationMetadata(data.message);

  // Prepare the application data with all required fields
  const applicationData: Omit<Application, 'id' | 'created_at'> = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    date_of_birth: data.date_of_birth,
    gender: data.gender,
    address: data.address || "",
    grade_level: data.grade_level,
    parent_name: data.parent_name,
    parent_email: data.parent_email,
    parent_phone: data.parent_phone,
    campus: data.campus,
    boarding: data.boarding,
    status: data.status || "pending",
    relationship: data.relationship,
    student_name: data.student_name,
    previous_school: data.previous_school,
    special_needs: data.special_needs,
    how_heard: data.how_heard,
    application_status: data.application_status || "SUBMITTED",
    payment_status: data.payment_status || "PENDING",
    payment_confirmation_code: data.payment_confirmation_code,
    payment_amount: data.payment_amount,
    payment_currency: data.payment_currency,
    payment_date: data.payment_date,
    message: data.message || JSON.stringify({
      howHeard: data.how_heard || "",
      previousSchool: data.previous_school || null,
      specialNeeds: data.special_needs || null,
      paymentStatus: data.status || "PENDING",
      submittedAt: new Date().toISOString(),
    }),
  };

  const res = await fetch('/api/admin/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(applicationData),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to create application')
  }

  return await res.json()
}

export async function deleteApplication(id: string) {
  const res = await fetch(`/api/admin/applications/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to delete application')
  }

  // DELETE requests typically return 204 No Content, so only parse JSON if there's content
  if (res.status === 204) {
    return { id }; // Return a simple confirmation object
  }
  
  return await res.json()
}

export async function updateApplication(id: string, data: Partial<Application>) {
  // Extract the metadata from the existing message field
  const existingApplication = await applicationsService.getById(id);
  const metadata = parseApplicationMetadata(existingApplication?.message);

  // Update the application with the new data, preserving existing metadata
  // but updating the payment status if it was changed
  const updatedMessage = JSON.stringify({
    ...metadata,
    howHeard: data.how_heard || metadata.howHeard,
    paymentStatus: data.status || metadata.paymentStatus,
  });

  // Map the admin form fields to the Supabase schema
  const applicationData: Partial<Application> = {
    name: data.name,
    date_of_birth: data.date_of_birth,
    gender: data.gender,
    grade_level: data.grade_level,
    parent_name: data.parent_name,
    parent_email: data.parent_email,
    parent_phone: data.parent_phone,
    campus: data.campus,
    boarding: data.boarding,
    status: data.status,
    relationship: data.relationship,
    student_name: data.student_name,
    previous_school: data.previous_school,
    special_needs: data.special_needs,
    how_heard: data.how_heard,
    application_status: data.application_status,
    payment_status: data.payment_status,
    payment_confirmation_code: data.payment_confirmation_code,
    payment_amount: data.payment_amount,
    payment_currency: data.payment_currency,
    payment_date: data.payment_date,
    message: updatedMessage,
  };

  // Remove undefined fields
  Object.keys(applicationData).forEach(key => {
    const typedKey = key as keyof Application;
    if (applicationData[typedKey] === undefined) {
      delete applicationData[typedKey];
    }
  });

  const res = await fetch(`/api/admin/applications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(applicationData),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to update application')
  }

  return await res.json()
}

// Announcement services
export async function getAnnouncements() {
  const announcements = await announcementsService.getAll();

  // Map Supabase announcement fields to the format expected by the admin panel
  return announcements.map(announcement => ({
    _id: announcement.id || `announcement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: announcement.title,
    content: announcement.content,
    date: announcement.published_at || announcement.created_at || new Date().toISOString(),
    category: announcement.category || "general",
    pinned: announcement.pinned || false, // Use the actual pinned value from the announcement
    _createdAt: announcement.created_at || new Date().toISOString(),
    imageUrl: announcement.image_url,
    ctaText: announcement.cta_text,
    ctaLink: announcement.cta_link
  }));
}

export async function createAnnouncement(data: Omit<Announcement, 'id' | 'created_at'>) {
  const res = await fetch('/api/admin/announcements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to create announcement')
  }

  return await res.json()
}

export async function updateAnnouncement(id: string, data: Partial<Announcement>) {
  const announcementData: Partial<Announcement> = {
    title: data.title,
    content: data.content,
    published_at: data.published_at,
    category: data.category,
    pinned: data.pinned,
    image_url: data.image_url,
    cta_text: data.cta_text,
    cta_link: data.cta_link
  };

  // Remove undefined fields
  Object.keys(announcementData).forEach(key => {
    const typedKey = key as keyof Partial<Announcement>;
    if (announcementData[typedKey] === undefined) {
      delete announcementData[typedKey];
    }
  });

  const res = await fetch(`/api/admin/announcements/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(announcementData),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to update announcement')
  }

  return await res.json()
}

export async function deleteAnnouncement(id: string) {
  const res = await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to delete announcement')
  }

  return await res.json()
}

// Event services
export async function getEvents() {
  const events = await eventsService.getAll();

  // Map Supabase event fields to the format expected by the admin panel
  return events.map(event => ({
    _id: event.id || `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: event.title,
    description: event.description,
    date: event.start_date.split('T')[0], // Extract date part
    time: event.is_all_day ? 'All Day' : new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    location: event.location || '',
    type: 'event', // Default type
    _createdAt: event.created_at || new Date().toISOString(),
    start_date: event.start_date,
    end_date: event.end_date,
    is_all_day: event.is_all_day || false
  }));
}

export async function createEvent(data: Omit<Event, 'id' | 'created_at'>) {
  const res = await fetch('/api/admin/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to create event')
  }

  return await res.json()
}

export async function updateEvent(id: string, data: Partial<Event>) {
  const res = await fetch(`/api/admin/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to update event')
  }

  return await res.json()
}

export async function deleteEvent(id: string) {
  const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to delete event')
  }

  return await res.json()
}

// Gallery services
export async function getGalleryImages() {
  const images = await galleryService.getAll();

  // Map Supabase gallery image fields to the format expected by the admin panel
  return images.map(image => ({
    _id: image.id || `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: image.title,
    file_url: image.file_url,
    file_name: image.file_name,
    alt_text: image.alt_text || '',
    caption: image.caption || '',
    category: image.category || '',
    _createdAt: image.created_at || new Date().toISOString(),
  }));
}

export async function createGalleryImage(data: Omit<GalleryImage, 'id' | 'created_at'>) {
  const res = await fetch('/api/admin/gallery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to create gallery image')
  }

  return await res.json()
}

export async function updateGalleryImage(id: string, data: Partial<GalleryImage>) {
  const res = await fetch(`/api/admin/gallery/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to update gallery image')
  }

  return await res.json()
}

export async function deleteGalleryImage(id: string) {
  const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to delete gallery image')
  }

  return await res.json()
}

// Resource services
export async function getResources() {
  // Use the admin API route so server-side (service role) client is used
  const res = await fetch('/api/admin/resources');
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch resources');
  }

  const resources = await res.json();

  // Map Supabase resource fields to the format expected by the admin panel
  return resources.map((resource: any) => ({
    _id: resource.id || `resource-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: resource.title,
    description: resource.description,
    category: resource.category || '',
    type: resource.file_name?.split('.').pop()?.toUpperCase() || 'N/A',
    fileSize: resource.file_size ? `${Math.round(resource.file_size / 1024)} KB` : 'N/A',
    uploadDate: resource.created_at || new Date().toISOString(),
    fileUrl: resource.file_url || '',
    _createdAt: resource.created_at || new Date().toISOString(),
    file_url: resource.file_url,
    file_name: resource.file_name,
    file_size: resource.file_size,
  }));
}

export async function createResource(data: Omit<Resource, 'id' | 'created_at'>) {
  // Ensure the data includes file metadata which is expected by the backend
  const resourceData = {
    title: data.title,
    description: data.description,
    category: data.category,
    file_url: data.file_url,
    file_name: data.file_name,
    file_size: data.file_size,
  };

  const res = await fetch('/api/admin/resources', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resourceData),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to create resource')
  }

  return await res.json()
}

export async function updateResource(id: string, data: Partial<Resource>) {
  // Prepare the data object, including only defined fields and proper file metadata
  const resourceData: Partial<Resource> = {};
  
  if (data.title !== undefined) resourceData.title = data.title;
  if (data.description !== undefined) resourceData.description = data.description;
  if (data.category !== undefined) resourceData.category = data.category;
  if (data.file_url !== undefined) resourceData.file_url = data.file_url;
  if (data.file_name !== undefined) resourceData.file_name = data.file_name;
  if (data.file_size !== undefined) resourceData.file_size = data.file_size;

  const res = await fetch(`/api/admin/resources/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resourceData),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to update resource')
  }

  return await res.json()
}

export async function deleteResource(id: string) {
  // Ensure we have a valid ID
  if (!id) {
    throw new Error("Invalid resource ID");
  }

  const res = await fetch(`/api/admin/resources/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to delete resource')
  }

  return await res.json()
}

// Message services
export async function getMessages() {
  // Use the admin API route so server-side (service role) client is used
  const res = await fetch('/api/admin/messages');
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch messages');
  }

  const messages = await res.json();

  return messages.map((message: any) => ({
    id: message.id || `message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: message.created_at || new Date().toISOString(),
    name: message.name,
    email: message.email,
    subject: message.subject,
    message: message.message,
    read: message.read || false,
  }));
}

export async function createMessage(data: Omit<Message, 'id' | 'created_at' | 'read'>) {
  const res = await fetch('/api/admin/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to create message')
  }

  return await res.json()
}

export async function updateMessage(id: string, data: Partial<Message>) {
  const res = await fetch(`/api/admin/messages/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to update message')
  }

  return await res.json()
}

export async function deleteMessage(id: string) {
  const res = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to delete message')
  }

  return await res.json()
}

// Job Application services
export interface JobApplication {
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
  reviewed_by?: string;
  reviewed_at?: string;
  notes?: string;
}

export async function getJobApplications(): Promise<JobApplication[]> {
  const res = await fetch('/api/admin/job-applications');
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch job applications');
  }

  return await res.json();
}

export async function getJobApplicationById(id: string): Promise<JobApplication | null> {
  const res = await fetch(`/api/admin/job-applications/${id}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    const text = await res.text();
    throw new Error(text || 'Failed to fetch job application');
  }

  return await res.json();
}

export async function updateJobApplication(id: string, data: Partial<JobApplication>) {
  const res = await fetch(`/api/admin/job-applications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to update job application');
  }

  return await res.json();
}

export async function deleteJobApplication(id: string) {
  const res = await fetch(`/api/admin/job-applications/${id}`, { method: 'DELETE' });
  
  // Clone the response so we can read the body multiple times if needed
  const responseText = await res.text();
  
  if (!res.ok) {
    let errorMessage = 'Failed to delete job application';
    try {
      const errorData = JSON.parse(responseText);
      errorMessage = errorData.error || errorMessage;
    } catch {
      errorMessage = responseText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // Parse the successful response
  try {
    return JSON.parse(responseText);
  } catch {
    return { success: true, deletedId: id };
  }
}

// Hall of Fame services
export async function getHallOfFameEntries() {
  const res = await fetch('/api/admin/hall-of-fame');
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch hall of fame entries');
  }

  return await res.json();
}

export async function createHallOfFame(data: Omit<HallOfFame, 'id' | 'created_at' | 'updated_at'>) {
  const res = await fetch('/api/admin/hall-of-fame', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to create hall of fame entry');
  }

  return await res.json();
}

export async function updateHallOfFame(id: string, data: Partial<HallOfFame>) {
  const res = await fetch(`/api/admin/hall-of-fame/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to update hall of fame entry');
  }

  return await res.json();
}

export async function deleteHallOfFame(id: string) {
  const res = await fetch(`/api/admin/hall-of-fame/${id}`, { method: 'DELETE' });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to delete hall of fame entry');
  }

  return { success: true };
}