"use client";

import { useState, useEffect } from 'react';

// Define the content types for our CMS
export interface Announcement {
  id: string;
  title: string;
  content: string;
  isImportant: boolean;
  publishDate: string;
  expiryDate?: string;
  status: 'draft' | 'published' | 'archived';
  author: string;
  scheduledPublish?: boolean; // Added for scheduling
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  category: 'academic' | 'sports' | 'arts' | 'holiday' | 'other';
  status: 'upcoming' | 'ongoing' | 'past' | 'cancelled';
  scheduledPublish?: boolean; // Added for scheduling
  publishDate?: string; // Added for scheduling
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  lastUpdated: string;
  metaDescription?: string;
  isPublished: boolean;
  sections: PageSection[];
  scheduledPublish?: boolean; // Added for scheduling
  publishDate?: string; // Added for scheduling
}

export interface PageSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'gallery' | 'video' | 'callToAction';
  order: number;
  settings?: {
    backgroundColor?: string;
    textColor?: string;
    layout?: 'full' | 'left' | 'right' | 'centered';
    [key: string]: any;
  };
}

// Sample mock data for CMS
const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-001',
    title: 'Kindergarten Open Day',
    content: 'We are excited to invite parents and guardians to our Open Day event where you can explore our facilities, meet our teachers, and learn about our curriculum.',
    isImportant: true,
    publishDate: '2024-03-15T09:00:00Z',
    expiryDate: '2024-04-15T18:00:00Z',
    status: 'published',
    author: 'admin',
  },
  {
    id: 'ann-002',
    title: 'Curriculum Changes for Next Term',
    content: 'We are enhancing our kindergarten curriculum to include more creative learning activities and outdoor experiences. Details will be shared in the upcoming parent meeting.',
    isImportant: false,
    publishDate: '2024-03-20T10:30:00Z',
    status: 'published',
    author: 'admin',
  },
  {
    id: 'ann-003',
    title: 'End of Term Celebration',
    content: 'Join us for our end of term celebration featuring performances by our talented kindergarten students. Refreshments will be provided.',
    isImportant: false,
    publishDate: '2024-03-22T14:00:00Z',
    expiryDate: '2024-03-30T18:00:00Z',
    status: 'published',
    author: 'admin',
  },
];

const MOCK_EVENTS: Event[] = [
  {
    id: 'evt-001',
    title: 'Kindergarten Sports Day',
    description: 'A fun-filled day of sports activities designed for our youngest students. Parents are encouraged to attend and cheer for their little ones!',
    location: 'School Sports Ground, Kitintale Campus',
    startDate: '2024-04-20T09:00:00Z',
    endDate: '2024-04-20T13:00:00Z',
    category: 'sports',
    status: 'upcoming',
  },
  {
    id: 'evt-002',
    title: 'Parent-Teacher Conference',
    description: 'Individual meetings with teachers to discuss your child\'s progress and development. Please book your slot in advance.',
    location: 'All Campuses',
    startDate: '2024-04-25T08:00:00Z',
    endDate: '2024-04-26T16:00:00Z',
    category: 'academic',
    status: 'upcoming',
  },
  {
    id: 'evt-003',
    title: 'Children\'s Art Exhibition',
    description: 'An exhibition showcasing the creative artwork of our kindergarten students. Come and admire their masterpieces!',
    location: 'Main Hall, Maganjo Campus',
    startDate: '2024-04-15T10:00:00Z',
    endDate: '2024-04-17T15:00:00Z',
    category: 'arts',
    status: 'upcoming',
  },
  {
    id: 'evt-004',
    title: 'Easter Holiday',
    description: 'School will be closed for Easter break. Classes will resume on the date specified.',
    location: 'All Campuses',
    startDate: '2024-04-05T00:00:00Z',
    endDate: '2024-04-12T23:59:59Z',
    category: 'holiday',
    status: 'upcoming',
  },
];

const MOCK_PAGES: Page[] = [
  {
    id: 'page-001',
    title: 'About Our Kindergarten',
    slug: 'about-kindergarten',
    content: 'Learn about our approach to early childhood education and the special features of our kindergarten program.',
    lastUpdated: '2024-03-10T14:30:00Z',
    metaDescription: 'Discover Clevers\' Origin Schools kindergarten program and our approach to early childhood education.',
    isPublished: true,
    sections: [
      {
        id: 'sec-001',
        title: 'Our Philosophy',
        content: 'At Clevers\' Origin Kindergarten, we believe that every child is unique and has the potential to be creative, knowledgeable, and confident. Our curriculum is designed to nurture these qualities through play-based learning, exploration, and discovery.',
        type: 'text',
        order: 1,
      },
      {
        id: 'sec-002',
        title: 'Our Facilities',
        content: 'Our kindergarten facilities are designed to be safe, stimulating, and child-friendly. We have spacious classrooms, outdoor play areas, a reading corner, art stations, and sensory play zones.',
        type: 'text',
        order: 2,
      },
    ],
  },
  {
    id: 'page-002',
    title: 'Admission Process',
    slug: 'admission-process',
    content: 'Information about how to apply for admission to our kindergarten program.',
    lastUpdated: '2024-03-12T09:45:00Z',
    metaDescription: 'Learn about the admission process for Clevers\' Origin Schools kindergarten program.',
    isPublished: true,
    sections: [
      {
        id: 'sec-003',
        title: 'Application Steps',
        content: '1. Submit an online application form\n2. Pay the application fee\n3. Schedule a visit to the campus\n4. Attend an interview/assessment\n5. Receive admission decision',
        type: 'text',
        order: 1,
      },
      {
        id: 'sec-004',
        title: 'Required Documents',
        content: '- Birth certificate\n- Immunization records\n- Previous school records (if applicable)\n- Passport-sized photographs\n- Parent/guardian ID',
        type: 'text',
        order: 2,
      },
    ],
  },
];

// Add Firebase imports
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ContentType, AnalyticsEventType, trackContentEngagement } from '@/lib/analytics';
import { AppUser } from '@/lib/permissions';

// Updated useCms hook to use Firestore instead of localStorage
export function useCms() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check for scheduled items and publish if necessary
  const checkScheduledPublishing = async () => {
    const now = new Date();

    // Check announcements
    const updatedAnnouncements = await Promise.all(announcements.map(async announcement => {
      if (announcement.scheduledPublish && announcement.status === 'draft') {
        const publishDate = new Date(announcement.publishDate);
        if (publishDate <= now) {
          const updated = {
            ...announcement,
            status: 'published',
            scheduledPublish: false
          };

          // Update in Firestore
          const docRef = doc(db, 'announcements', announcement.id);
          await updateDoc(docRef, {
            status: 'published',
            scheduledPublish: false
          });

          return updated;
        }
      }
      return announcement;
    }));

    if (JSON.stringify(updatedAnnouncements) !== JSON.stringify(announcements)) {
      setAnnouncements(updatedAnnouncements);
    }

    // Check events with publishDate
    const updatedEvents = await Promise.all(events.map(async event => {
      let needsUpdate = false;
      const updatedEvent = { ...event };

      if (event.scheduledPublish && event.publishDate) {
        const publishDate = new Date(event.publishDate);
        if (publishDate <= now) {
          updatedEvent.scheduledPublish = false;
          needsUpdate = true;
        }
      }

      // Also automatically update event status based on date
      if (event.status !== 'cancelled') {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);

        if (now > endDate && event.status !== 'past') {
          updatedEvent.status = 'past';
          needsUpdate = true;
        } else if (now >= startDate && now <= endDate && event.status !== 'ongoing') {
          updatedEvent.status = 'ongoing';
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        // Update in Firestore
        const docRef = doc(db, 'events', event.id);
        await updateDoc(docRef, {
          status: updatedEvent.status,
          scheduledPublish: updatedEvent.scheduledPublish
        });

        return updatedEvent;
      }

      return event;
    }));

    if (JSON.stringify(updatedEvents) !== JSON.stringify(events)) {
      setEvents(updatedEvents);
    }

    // Check pages
    const updatedPages = await Promise.all(pages.map(async page => {
      if (page.scheduledPublish && !page.isPublished && page.publishDate) {
        const publishDate = new Date(page.publishDate);
        if (publishDate <= now) {
          const updated = {
            ...page,
            isPublished: true,
            scheduledPublish: false
          };

          // Update in Firestore
          const docRef = doc(db, 'pages', page.id);
          await updateDoc(docRef, {
            isPublished: true,
            scheduledPublish: false
          });

          return updated;
        }
      }
      return page;
    }));

    if (JSON.stringify(updatedPages) !== JSON.stringify(pages)) {
      setPages(updatedPages);
    }
  };

  useEffect(() => {
    // Load CMS data from Firestore
    const loadCmsData = async () => {
      try {
        // Load announcements
        const announcementsSnapshot = await getDocs(collection(db, 'announcements'));
        const loadedAnnouncements: Announcement[] = [];

        announcementsSnapshot.forEach(doc => {
          const data = doc.data();
          loadedAnnouncements.push({
            ...data,
            id: doc.id,
            publishDate: data.publishDate instanceof Timestamp
              ? data.publishDate.toDate().toISOString()
              : data.publishDate,
            expiryDate: data.expiryDate instanceof Timestamp
              ? data.expiryDate.toDate().toISOString()
              : data.expiryDate
          } as Announcement);
        });

        // If no announcements found, initialize with mock data
        if (loadedAnnouncements.length === 0) {
          await Promise.all(MOCK_ANNOUNCEMENTS.map(async announcement => {
            await addDoc(collection(db, 'announcements'), {
              ...announcement,
              publishDate: new Date(announcement.publishDate),
              expiryDate: announcement.expiryDate ? new Date(announcement.expiryDate) : null
            });
          }));

          setAnnouncements(MOCK_ANNOUNCEMENTS);
        } else {
          setAnnouncements(loadedAnnouncements);
        }

        // Load events
        const eventsSnapshot = await getDocs(collection(db, 'events'));
        const loadedEvents: Event[] = [];

        eventsSnapshot.forEach(doc => {
          const data = doc.data();
          loadedEvents.push({
            ...data,
            id: doc.id,
            startDate: data.startDate instanceof Timestamp
              ? data.startDate.toDate().toISOString()
              : data.startDate,
            endDate: data.endDate instanceof Timestamp
              ? data.endDate.toDate().toISOString()
              : data.endDate,
            publishDate: data.publishDate instanceof Timestamp
              ? data.publishDate.toDate().toISOString()
              : data.publishDate
          } as Event);
        });

        // If no events found, initialize with mock data
        if (loadedEvents.length === 0) {
          await Promise.all(MOCK_EVENTS.map(async event => {
            await addDoc(collection(db, 'events'), {
              ...event,
              startDate: new Date(event.startDate),
              endDate: new Date(event.endDate),
              publishDate: event.publishDate ? new Date(event.publishDate) : null
            });
          }));

          setEvents(MOCK_EVENTS);
        } else {
          setEvents(loadedEvents);
        }

        // Load pages
        const pagesSnapshot = await getDocs(collection(db, 'pages'));
        const loadedPages: Page[] = [];

        pagesSnapshot.forEach(doc => {
          const data = doc.data();
          loadedPages.push({
            ...data,
            id: doc.id,
            lastUpdated: data.lastUpdated instanceof Timestamp
              ? data.lastUpdated.toDate().toISOString()
              : data.lastUpdated,
            publishDate: data.publishDate instanceof Timestamp
              ? data.publishDate.toDate().toISOString()
              : data.publishDate
          } as Page);
        });

        // If no pages found, initialize with mock data
        if (loadedPages.length === 0) {
          await Promise.all(MOCK_PAGES.map(async page => {
            await addDoc(collection(db, 'pages'), {
              ...page,
              lastUpdated: new Date(page.lastUpdated),
              publishDate: page.publishDate ? new Date(page.publishDate) : null
            });
          }));

          setPages(MOCK_PAGES);
        } else {
          setPages(loadedPages);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading CMS data from Firestore:", error);

        // Fallback to mock data if Firestore fails
        setAnnouncements(MOCK_ANNOUNCEMENTS);
        setEvents(MOCK_EVENTS);
        setPages(MOCK_PAGES);
        setIsLoading(false);
      }
    };

    loadCmsData();

    // Set up an interval to check for scheduled publishing
    const intervalId = setInterval(() => {
      checkScheduledPublishing();
    }, 60000); // Check every minute

    // Run once on mount
    checkScheduledPublishing();

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Functions to manage announcements
  const createAnnouncement = async (announcement: Omit<Announcement, 'id' | 'author'>, currentUser?: AppUser) => {
    try {
      const newAnnouncement: Omit<Announcement, 'id'> = {
        ...announcement,
        author: currentUser?.displayName || 'admin'
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'announcements'), {
        ...newAnnouncement,
        publishDate: new Date(newAnnouncement.publishDate),
        expiryDate: newAnnouncement.expiryDate ? new Date(newAnnouncement.expiryDate) : null
      });

      // Add ID to the announcement
      const createdAnnouncement: Announcement = {
        ...newAnnouncement,
        id: docRef.id
      };

      // Update state
      const updatedAnnouncements = [...announcements, createdAnnouncement];
      setAnnouncements(updatedAnnouncements);

      // Track creation event for analytics
      trackContentEngagement(
        createdAnnouncement.id,
        ContentType.ANNOUNCEMENT,
        AnalyticsEventType.CLICK,
        currentUser?.id,
        currentUser?.role,
        { action: 'create' }
      );

      return createdAnnouncement;
    } catch (error) {
      console.error("Error creating announcement:", error);
      throw error;
    }
  };

  const updateAnnouncement = async (id: string, data: Partial<Announcement>, currentUser?: AppUser) => {
    try {
      const docRef = doc(db, 'announcements', id);

      // Prepare data for Firestore
      const firestoreData: any = { ...data };
      if (data.publishDate) {
        firestoreData.publishDate = new Date(data.publishDate);
      }
      if (data.expiryDate) {
        firestoreData.expiryDate = new Date(data.expiryDate);
      }

      // Update in Firestore
      await updateDoc(docRef, firestoreData);

      // Update in state
      const updatedAnnouncements = announcements.map(announcement => {
        if (announcement.id === id) {
          return { ...announcement, ...data };
        }
        return announcement;
      });

      setAnnouncements(updatedAnnouncements);

      // Track update event for analytics
      trackContentEngagement(
        id,
        ContentType.ANNOUNCEMENT,
        AnalyticsEventType.CLICK,
        currentUser?.id,
        currentUser?.role,
        { action: 'update' }
      );

      return true;
    } catch (error) {
      console.error("Error updating announcement:", error);
      return false;
    }
  };

  const deleteAnnouncement = async (id: string, currentUser?: AppUser) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'announcements', id));

      // Delete from state
      const updatedAnnouncements = announcements.filter(announcement => announcement.id !== id);
      setAnnouncements(updatedAnnouncements);

      // Track deletion event for analytics
      trackContentEngagement(
        id,
        ContentType.ANNOUNCEMENT,
        AnalyticsEventType.CLICK,
        currentUser?.id,
        currentUser?.role,
        { action: 'delete' }
      );

      return true;
    } catch (error) {
      console.error("Error deleting announcement:", error);
      return false;
    }
  };

  // Functions to manage events
  const createEvent = async (event: Omit<Event, 'id'>, currentUser?: AppUser) => {
    try {
      // Add to Firestore
      const docRef = await addDoc(collection(db, 'events'), {
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        publishDate: event.publishDate ? new Date(event.publishDate) : null
      });

      // Add ID to the event
      const createdEvent: Event = {
        ...event,
        id: docRef.id
      };

      // Update state
      const updatedEvents = [...events, createdEvent];
      setEvents(updatedEvents);

      // Track creation event for analytics
      trackContentEngagement(
        createdEvent.id,
        ContentType.EVENT,
        AnalyticsEventType.CLICK,
        currentUser?.id,
        currentUser?.role,
        { action: 'create' }
      );

      return createdEvent;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  };

  const updateEvent = async (id: string, data: Partial<Event>, currentUser?: AppUser) => {
    try {
      const docRef = doc(db, 'events', id);

      // Prepare data for Firestore
      const firestoreData: any = { ...data };
      if (data.startDate) {
        firestoreData.startDate = new Date(data.startDate);
      }
      if (data.endDate) {
        firestoreData.endDate = new Date(data.endDate);
      }
      if (data.publishDate) {
        firestoreData.publishDate = new Date(data.publishDate);
      }

      // Update in Firestore
      await updateDoc(docRef, firestoreData);

      // Update in state
      const updatedEvents = events.map(event => {
        if (event.id === id) {
          return { ...event, ...data };
        }
        return event;
      });

      setEvents(updatedEvents);

      // Track update event for analytics
      trackContentEngagement(
        id,
        ContentType.EVENT,
        AnalyticsEventType.CLICK,
        currentUser?.id,
        currentUser?.role,
        { action: 'update' }
      );

      return true;
    } catch (error) {
      console.error("Error updating event:", error);
      return false;
    }
  };

  const deleteEvent = async (id: string, currentUser?: AppUser) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'events', id));

      // Delete from state
      const updatedEvents = events.filter(event => event.id !== id);
      setEvents(updatedEvents);

      // Track deletion event for analytics
      trackContentEngagement(
        id,
        ContentType.EVENT,
        AnalyticsEventType.CLICK,
        currentUser?.id,
        currentUser?.role,
        { action: 'delete' }
      );

      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      return false;
    }
  };

  // Functions to manage pages
  const createPage = async (page: Omit<Page, 'id' | 'lastUpdated'>, currentUser?: AppUser) => {
    try {
      const newPage: Omit<Page, 'id'> = {
        ...page,
        lastUpdated: new Date().toISOString()
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'pages'), {
        ...newPage,
        lastUpdated: serverTimestamp(),
        publishDate: page.publishDate ? new Date(page.publishDate) : null
      });

      // Add ID to the page
      const createdPage: Page = {
        ...newPage,
        id: docRef.id
      };

      // Update state
      const updatedPages = [...pages, createdPage];
      setPages(updatedPages);

      // Track creation event for analytics
      trackContentEngagement(
        createdPage.id,
        ContentType.PAGE,
        AnalyticsEventType.CLICK,
        currentUser?.id,
        currentUser?.role,
        { action: 'create' }
      );

      return createdPage;
    } catch (error) {
      console.error("Error creating page:", error);
      throw error;
    }
  };

  const updatePage = async (id: string, data: Partial<Omit<Page, 'lastUpdated'>>, currentUser?: AppUser) => {
    try {
      const docRef = doc(db, 'pages', id);

      // Prepare data for Firestore
      const firestoreData: any = {
        ...data,
        lastUpdated: serverTimestamp()
      };

      if (data.publishDate) {
        firestoreData.publishDate = new Date(data.publishDate);
      }

      // Update in Firestore
      await updateDoc(docRef, firestoreData);

      // Update in state
      const updatedPages = pages.map(page => {
        if (page.id === id) {
          return {
            ...page,
            ...data,
            lastUpdated: new Date().toISOString()
          };
        }
        return page;
      });

      setPages(updatedPages);

      // Track update event for analytics
      trackContentEngagement(
        id,
        ContentType.PAGE,
        AnalyticsEventType.CLICK,
        currentUser?.id,
        currentUser?.role,
        { action: 'update' }
      );

      return true;
    } catch (error) {
      console.error("Error updating page:", error);
      return false;
    }
  };

  const deletePage = async (id: string, currentUser?: AppUser) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'pages', id));

      // Delete from state
      const updatedPages = pages.filter(page => page.id !== id);
      setPages(updatedPages);

      // Track deletion event for analytics
      trackContentEngagement(
        id,
        ContentType.PAGE,
        AnalyticsEventType.CLICK,
        currentUser?.id,
        currentUser?.role,
        { action: 'delete' }
      );

      return true;
    } catch (error) {
      console.error("Error deleting page:", error);
      return false;
    }
  };

  // Functions to manage page sections
  const addPageSection = async (pageId: string, section: Omit<PageSection, 'id'>, currentUser?: AppUser) => {
    try {
      const pageToUpdate = pages.find(page => page.id === pageId);
      if (!pageToUpdate) return false;

      const newSection: PageSection = {
        ...section,
        id: `sec-${Date.now().toString(36)}`,
      };

      const updatedPage = {
        ...pageToUpdate,
        sections: [...pageToUpdate.sections, newSection],
        lastUpdated: new Date().toISOString()
      };

      // Update in Firestore
      const docRef = doc(db, 'pages', pageId);
      await updateDoc(docRef, {
        sections: updatedPage.sections,
        lastUpdated: serverTimestamp()
      });

      // Update in state
      const updatedPages = pages.map(page =>
        page.id === pageId ? updatedPage : page
      );

      setPages(updatedPages);

      return true;
    } catch (error) {
      console.error("Error adding page section:", error);
      return false;
    }
  };

  const updatePageSection = async (pageId: string, sectionId: string, data: Partial<PageSection>, currentUser?: AppUser) => {
    try {
      const pageToUpdate = pages.find(page => page.id === pageId);
      if (!pageToUpdate) return false;

      const updatedSections = pageToUpdate.sections.map(section => {
        if (section.id === sectionId) {
          return { ...section, ...data };
        }
        return section;
      });

      const updatedPage = {
        ...pageToUpdate,
        sections: updatedSections,
        lastUpdated: new Date().toISOString()
      };

      // Update in Firestore
      const docRef = doc(db, 'pages', pageId);
      await updateDoc(docRef, {
        sections: updatedSections,
        lastUpdated: serverTimestamp()
      });

      // Update in state
      const updatedPages = pages.map(page =>
        page.id === pageId ? updatedPage : page
      );

      setPages(updatedPages);

      return true;
    } catch (error) {
      console.error("Error updating page section:", error);
      return false;
    }
  };

  const deletePageSection = async (pageId: string, sectionId: string, currentUser?: AppUser) => {
    try {
      const pageToUpdate = pages.find(page => page.id === pageId);
      if (!pageToUpdate) return false;

      const updatedSections = pageToUpdate.sections.filter(section => section.id !== sectionId);

      const updatedPage = {
        ...pageToUpdate,
        sections: updatedSections,
        lastUpdated: new Date().toISOString()
      };

      // Update in Firestore
      const docRef = doc(db, 'pages', pageId);
      await updateDoc(docRef, {
        sections: updatedSections,
        lastUpdated: serverTimestamp()
      });

      // Update in state
      const updatedPages = pages.map(page =>
        page.id === pageId ? updatedPage : page
      );

      setPages(updatedPages);

      return true;
    } catch (error) {
      console.error("Error deleting page section:", error);
      return false;
    }
  };

  return {
    // Data
    announcements,
    events,
    pages,
    isLoading,

    // Announcement methods
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,

    // Event methods
    createEvent,
    updateEvent,
    deleteEvent,

    // Page methods
    createPage,
    updatePage,
    deletePage,

    // Page section methods
    addPageSection,
    updatePageSection,
    deletePageSection,

    // Scheduling helpers
    checkScheduledPublishing
  };
}
