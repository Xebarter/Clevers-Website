"use client";

import {
  logEvent,
  setUserId,
  setUserProperties,
  setAnalyticsCollectionEnabled
} from 'firebase/analytics';
import { Timestamp, addDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { analytics, db } from './firebase';

// Enum for content types
export enum ContentType {
  ANNOUNCEMENT = 'announcement',
  EVENT = 'event',
  PAGE = 'page'
}

// Enum for event types
export enum AnalyticsEventType {
  VIEW = 'view',
  CLICK = 'click',
  SHARE = 'share',
  DOWNLOAD = 'download',
  COMPLETE = 'complete'
}

// Interface for content engagement events
export interface ContentEngagementEvent {
  id?: string;
  contentId: string;
  contentType: ContentType;
  eventType: AnalyticsEventType;
  userId?: string;
  userRole?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Function to initialize analytics
export function initAnalytics(enableCollection = true) {
  // Only run on client side
  if (typeof window === 'undefined' || !analytics) return;

  // Enable or disable analytics collection
  setAnalyticsCollectionEnabled(analytics, enableCollection);
}

// Function to set current user for analytics
export function setAnalyticsUser(userId: string, userProperties?: Record<string, any>) {
  if (typeof window === 'undefined' || !analytics) return;

  // Set user ID for analytics
  setUserId(analytics, userId);

  // Set additional user properties if provided
  if (userProperties) {
    setUserProperties(analytics, userProperties);
  }
}

// Track content engagement in both Firebase Analytics and Firestore
export async function trackContentEngagement(
  contentId: string,
  contentType: ContentType,
  eventType: AnalyticsEventType,
  userId?: string,
  userRole?: string,
  metadata?: Record<string, any>
) {
  try {
    // Track in Firebase Analytics
    if (typeof window !== 'undefined' && analytics) {
      logEvent(analytics, `content_${eventType}`, {
        content_id: contentId,
        content_type: contentType,
        ...metadata
      });
    }

    // Store detailed event in Firestore
    const event: ContentEngagementEvent = {
      contentId,
      contentType,
      eventType,
      userId,
      userRole,
      timestamp: new Date(),
      metadata
    };

    await addDoc(collection(db, 'contentEngagement'), {
      ...event,
      timestamp: Timestamp.fromDate(event.timestamp)
    });

    return true;
  } catch (error) {
    console.error('Error tracking content engagement:', error);
    return false;
  }
}

// Get content engagement stats
export async function getContentEngagementStats(
  contentId: string,
  contentType: ContentType
) {
  try {
    // Query Firestore for events related to this content
    const eventsRef = collection(db, 'contentEngagement');
    const q = query(
      eventsRef,
      where('contentId', '==', contentId),
      where('contentType', '==', contentType),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);

    // Count events by type
    const stats = {
      totalEvents: snapshot.size,
      views: 0,
      clicks: 0,
      shares: 0,
      downloads: 0,
      completes: 0,
      recentEvents: [] as ContentEngagementEvent[]
    };

    // Process event data
    snapshot.forEach(doc => {
      const event = doc.data() as ContentEngagementEvent & { timestamp: Timestamp };
      const eventWithDate = {
        ...event,
        id: doc.id,
        timestamp: event.timestamp.toDate(),
      };

      // Count by event type
      switch (event.eventType) {
        case AnalyticsEventType.VIEW:
          stats.views++;
          break;
        case AnalyticsEventType.CLICK:
          stats.clicks++;
          break;
        case AnalyticsEventType.SHARE:
          stats.shares++;
          break;
        case AnalyticsEventType.DOWNLOAD:
          stats.downloads++;
          break;
        case AnalyticsEventType.COMPLETE:
          stats.completes++;
          break;
      }

      // Add to recent events (limited to first 10)
      if (stats.recentEvents.length < 10) {
        stats.recentEvents.push(eventWithDate);
      }
    });

    return stats;
  } catch (error) {
    console.error('Error fetching content engagement stats:', error);
    throw error;
  }
}

// Get most popular content based on views
export async function getPopularContent(
  contentType?: ContentType,
  limit = 10
) {
  try {
    // Query Firestore for view events
    const eventsRef = collection(db, 'contentEngagement');
    let q = query(
      eventsRef,
      where('eventType', '==', AnalyticsEventType.VIEW),
      orderBy('timestamp', 'desc')
    );

    // Add content type filter if specified
    if (contentType) {
      q = query(q, where('contentType', '==', contentType));
    }

    const snapshot = await getDocs(q);

    // Count views for each content item
    const contentViewsMap = new Map<string, { contentId: string, contentType: ContentType, views: number }>();

    snapshot.forEach(doc => {
      const event = doc.data() as ContentEngagementEvent;
      const key = `${event.contentType}:${event.contentId}`;

      if (contentViewsMap.has(key)) {
        contentViewsMap.get(key)!.views++;
      } else {
        contentViewsMap.set(key, {
          contentId: event.contentId,
          contentType: event.contentType,
          views: 1
        });
      }
    });

    // Convert to array and sort by views
    const popularContent = Array.from(contentViewsMap.values())
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);

    return popularContent;
  } catch (error) {
    console.error('Error fetching popular content:', error);
    throw error;
  }
}

// Track page views with time spent
export let pageViewStartTime: number | null = null;

export function trackPageView(pageId: string, userId?: string, userRole?: string) {
  // Record start time
  pageViewStartTime = Date.now();

  // Track the view event
  trackContentEngagement(
    pageId,
    ContentType.PAGE,
    AnalyticsEventType.VIEW,
    userId,
    userRole
  );
}

export function trackPageExit(pageId: string, userId?: string, userRole?: string) {
  // Calculate time spent if we have a start time
  if (pageViewStartTime) {
    const timeSpentMs = Date.now() - pageViewStartTime;
    const timeSpentSeconds = Math.round(timeSpentMs / 1000);

    // Track as metadata with the complete event
    trackContentEngagement(
      pageId,
      ContentType.PAGE,
      AnalyticsEventType.COMPLETE,
      userId,
      userRole,
      { timeSpentSeconds }
    );

    // Reset start time
    pageViewStartTime = null;
  }
}
