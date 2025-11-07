import { client } from "@/lib/sanity/client";

// Application services
export async function getApplications() {
  const query = `*[_type == "application"] | order(_createdAt desc) {
    _id,
    applicationId,
    studentName,
    dateOfBirth,
    gender,
    gradeLevel,
    parentName,
    relationship,
    phone,
    email,
    campus,
    boarding,
    howHeard,
    paymentStatus,
    previousSchool,
    specialNeeds,
    _createdAt
  }`;
  
  return await client.fetch(query);
}

export async function createApplication(data: any) {
  return await client.create({
    _type: "application",
    ...data
  });
}

export async function deleteApplication(id: string) {
  return await client.delete(id);
}

export async function updateApplication(id: string, data: any) {
  return await client.patch(id).set(data).commit();
}

// Announcement services
export async function getAnnouncements() {
  const query = `*[_type == "announcement"] | order(date desc) {
    _id,
    title,
    content,
    date,
    category,
    pinned,
    _createdAt
  }`;
  
  return await client.fetch(query);
}

export async function createAnnouncement(data: any) {
  return await client.create({
    _type: "announcement",
    ...data
  });
}

export async function updateAnnouncement(id: string, data: any) {
  return await client.patch(id).set(data).commit();
}

export async function deleteAnnouncement(id: string) {
  return await client.delete(id);
}

// Event services
export async function getEvents() {
  const query = `*[_type == "event"] | order(date asc) {
    _id,
    title,
    description,
    date,
    time,
    location,
    type,
    _createdAt
  }`;
  
  return await client.fetch(query);
}

export async function createEvent(data: any) {
  return await client.create({
    _type: "event",
    ...data
  });
}

export async function updateEvent(id: string, data: any) {
  return await client.patch(id).set(data).commit();
}

export async function deleteEvent(id: string) {
  return await client.delete(id);
}

// Gallery services
export async function getGalleryImages() {
  const query = `*[_type == "galleryImage"] | order(_createdAt desc) {
    _id,
    title,
    images,
    category,
    location,
    _createdAt
  }`;
  
  return await client.fetch(query);
}

export async function createGalleryImage(data: any) {
  return await client.create({
    _type: "galleryImage",
    ...data
  });
}

export async function updateGalleryImage(id: string, data: any) {
  return await client.patch(id).set(data).commit();
}

export async function deleteGalleryImage(id: string) {
  return await client.delete(id);
}

// Resource services
export async function getResources() {
  const query = `*[_type == "resource"] | order(_createdAt desc) {
    _id,
    title,
    description,
    category,
    type,
    fileSize,
    uploadDate,
    fileUrl,
    _createdAt
  }`;
  
  return await client.fetch(query);
}

export async function createResource(data: any) {
  return await client.create({
    _type: "resource",
    ...data
  });
}

export async function updateResource(id: string, data: any) {
  return await client.patch(id).set(data).commit();
}

export async function deleteResource(id: string) {
  return await client.delete(id);
}

// Message services (from contact form)
// Note: Based on the Jotform integration, messages are not stored in Sanity
// but in Jotform. This is a placeholder for future implementation.
export async function getMessages() {
  // This would need to be implemented to fetch from Jotform API
  // For now, returning empty array
  return [];
}