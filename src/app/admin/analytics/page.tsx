"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  BarChart,
  BarChart3,
  Eye,
  Share2,
  Clock,
  MousePointerClick,
  FileText,
  Calendar,
  Megaphone,
  Search
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useRequireAuth } from '@/app/admin/auth';
import { hasPermission, ResourceType, PermissionType } from '@/lib/permissions';
import { collection, query, where, orderBy, getDocs, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ContentType, AnalyticsEventType } from '@/lib/analytics';

// Interface for content engagement events from Firestore
interface EngagementEvent {
  id: string;
  contentId: string;
  contentType: ContentType;
  eventType: AnalyticsEventType;
  userId?: string;
  userRole?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Interface for content item with engagement metrics
interface ContentWithEngagement {
  id: string;
  title: string;
  type: ContentType;
  views: number;
  clicks: number;
  shares: number;
  avgTimeSpent?: number;
}

// Interface for aggregated analytics data
interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  totalShares: number;
  popularContent: ContentWithEngagement[];
  recentEvents: EngagementEvent[];
  eventsByType: Record<string, number>;
  contentTypeDistribution: Record<string, number>;
}

export default function AnalyticsPage() {
  const { user, loading } = useRequireAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalViews: 0,
    totalClicks: 0,
    totalShares: 0,
    popularContent: [],
    recentEvents: [],
    eventsByType: {},
    contentTypeDistribution: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!loading && user) {
      // Check if user has permission to view analytics
      if (!hasPermission(user, ResourceType.ANALYTICS, PermissionType.READ)) {
        return;
      }

      fetchAnalyticsData();
    }
  }, [loading, user, timeRange, contentTypeFilter]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);

    try {
      // Calculate date range based on selected time range
      const now = new Date();
      let startDate: Date | null = null;

      if (timeRange === '7d') {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
      } else if (timeRange === '30d') {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
      } else if (timeRange === '90d') {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 90);
      }

      // Build query for engagement events
      const eventsQuery = collection(db, 'contentEngagement');
      const constraints = [];

      // Add date constraint if not 'all'
      if (startDate) {
        constraints.push(where('timestamp', '>=', Timestamp.fromDate(startDate)));
      }

      // Add content type constraint if not 'all'
      if (contentTypeFilter !== 'all') {
        constraints.push(where('contentType', '==', contentTypeFilter));
      }

      // Execute query with constraints
      const eventsSnapshot = await getDocs(
        query(
          eventsQuery,
          ...constraints,
          orderBy('timestamp', 'desc')
        )
      );

      // Process engagement events
      const events: EngagementEvent[] = [];
      const contentMap = new Map<string, ContentWithEngagement>();
      let views = 0;
      let clicks = 0;
      let shares = 0;
      let completes = 0;
      const eventsByType: Record<string, number> = {};
      const contentTypeDistribution: Record<string, number> = {};

      // Helper to get content title from ID (simplified - in a real app, you'd fetch from your content collections)
      const getContentTitle = (id: string, type: ContentType): string => {
        return `${type.charAt(0).toUpperCase() + type.slice(1)} #${id.substring(0, 6)}`;
      };

      // Process each event
      eventsSnapshot.forEach(doc => {
        const data = doc.data();
        const event: EngagementEvent = {
          id: doc.id,
          contentId: data.contentId,
          contentType: data.contentType,
          eventType: data.eventType,
          userId: data.userId,
          userRole: data.userRole,
          timestamp: data.timestamp.toDate(),
          metadata: data.metadata
        };

        events.push(event);

        // Increment counters based on event type
        if (event.eventType === AnalyticsEventType.VIEW) {
          views++;
          eventsByType['views'] = (eventsByType['views'] || 0) + 1;
        } else if (event.eventType === AnalyticsEventType.CLICK) {
          clicks++;
          eventsByType['clicks'] = (eventsByType['clicks'] || 0) + 1;
        } else if (event.eventType === AnalyticsEventType.SHARE) {
          shares++;
          eventsByType['shares'] = (eventsByType['shares'] || 0) + 1;
        } else if (event.eventType === AnalyticsEventType.COMPLETE) {
          completes++;
          eventsByType['completes'] = (eventsByType['completes'] || 0) + 1;
        }

        // Increment content type distribution
        contentTypeDistribution[event.contentType] = (contentTypeDistribution[event.contentType] || 0) + 1;

        // Aggregate content item metrics
        const contentKey = `${event.contentType}:${event.contentId}`;

        if (!contentMap.has(contentKey)) {
          contentMap.set(contentKey, {
            id: event.contentId,
            title: getContentTitle(event.contentId, event.contentType),
            type: event.contentType,
            views: 0,
            clicks: 0,
            shares: 0,
            avgTimeSpent: 0
          });
        }

        const content = contentMap.get(contentKey)!;

        if (event.eventType === AnalyticsEventType.VIEW) {
          content.views++;
        } else if (event.eventType === AnalyticsEventType.CLICK) {
          content.clicks++;
        } else if (event.eventType === AnalyticsEventType.SHARE) {
          content.shares++;
        } else if (event.eventType === AnalyticsEventType.COMPLETE && event.metadata?.timeSpentSeconds) {
          // Calculate average time spent
          const currentTotal = (content.avgTimeSpent || 0) * content.views;
          const newTotal = currentTotal + event.metadata.timeSpentSeconds;
          content.avgTimeSpent = content.views > 0 ? newTotal / content.views : 0;
        }
      });

      // Sort content by views
      const popularContent = Array.from(contentMap.values())
        .sort((a, b) => b.views - a.views)
        .slice(0, 10); // Top 10 items

      // Sort recent events by date
      const recentEvents = events.slice(0, 50); // Last 50 events

      // Update analytics data
      setAnalyticsData({
        totalViews: views,
        totalClicks: clicks,
        totalShares: shares,
        popularContent,
        recentEvents,
        eventsByType,
        contentTypeDistribution
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get icon for content type
  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case ContentType.ANNOUNCEMENT:
        return <Megaphone className="h-4 w-4" />;
      case ContentType.EVENT:
        return <Calendar className="h-4 w-4" />;
      case ContentType.PAGE:
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Get badge color for content type
  const getContentTypeBadge = (type: ContentType) => {
    switch (type) {
      case ContentType.ANNOUNCEMENT:
        return <Badge className="bg-blue-100 text-blue-800">Announcement</Badge>;
      case ContentType.EVENT:
        return <Badge className="bg-green-100 text-green-800">Event</Badge>;
      case ContentType.PAGE:
        return <Badge className="bg-purple-100 text-purple-800">Page</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  // Get icon for event type
  const getEventTypeIcon = (type: AnalyticsEventType) => {
    switch (type) {
      case AnalyticsEventType.VIEW:
        return <Eye className="h-4 w-4 text-blue-500" />;
      case AnalyticsEventType.CLICK:
        return <MousePointerClick className="h-4 w-4 text-green-500" />;
      case AnalyticsEventType.SHARE:
        return <Share2 className="h-4 w-4 text-purple-500" />;
      case AnalyticsEventType.COMPLETE:
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  // Format seconds to readable time
  const formatTimeSpent = (seconds?: number) => {
    if (!seconds) return 'N/A';

    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.round(seconds % 60);
      return `${minutes}m ${remainingSeconds}s`;
    }
  };

  // If still loading auth state, show loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user doesn't have permission, show access denied
  if (!user || !hasPermission(user, ResourceType.ANALYTICS, PermissionType.READ)) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto h-12 w-12 text-red-500 mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-500">
              You don't have permission to view analytics data.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Analytics</h1>

        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>

          <Select value={contentTypeFilter} onValueChange={(value) => setContentTypeFilter(value as any)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All content</SelectItem>
              <SelectItem value={ContentType.ANNOUNCEMENT}>Announcements</SelectItem>
              <SelectItem value={ContentType.EVENT}>Events</SelectItem>
              <SelectItem value={ContentType.PAGE}>Pages</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => fetchAnalyticsData()}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <h3 className="text-2xl font-bold">{analyticsData.totalViews}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                <h3 className="text-2xl font-bold">{analyticsData.totalClicks}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <MousePointerClick className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Shares</p>
                <h3 className="text-2xl font-bold">{analyticsData.totalShares}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Share2 className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Popular Content
            </CardTitle>
            <CardDescription>
              Most viewed content items in the selected time period
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : analyticsData.popularContent.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No content engagement data available for the selected filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Content</th>
                      <th className="text-left py-2 font-medium">Type</th>
                      <th className="text-center py-2 font-medium">Views</th>
                      <th className="text-center py-2 font-medium">Clicks</th>
                      <th className="text-center py-2 font-medium">Time Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.popularContent.map(item => (
                      <tr key={`${item.type}:${item.id}`} className="border-b hover:bg-gray-50">
                        <td className="py-2">
                          <div className="flex items-center">
                            {getContentTypeIcon(item.type)}
                            <span className="ml-2 truncate max-w-[200px]">{item.title}</span>
                          </div>
                        </td>
                        <td className="py-2">{getContentTypeBadge(item.type)}</td>
                        <td className="py-2 text-center">{item.views}</td>
                        <td className="py-2 text-center">{item.clicks}</td>
                        <td className="py-2 text-center">{formatTimeSpent(item.avgTimeSpent)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Content Distribution
            </CardTitle>
            <CardDescription>
              Engagement by content type
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : Object.keys(analyticsData.contentTypeDistribution).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No content distribution data available.
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(analyticsData.contentTypeDistribution).map(([type, count]) => {
                  const percentage = analyticsData.totalViews > 0
                    ? Math.round((count / analyticsData.totalViews) * 100)
                    : 0;

                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {getContentTypeIcon(type as ContentType)}
                          <span className="ml-2 text-sm font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}s</span>
                        </div>
                        <span className="text-sm font-medium">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search events..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>
            Latest user interactions with content
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : analyticsData.recentEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No recent activity data available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Time</th>
                    <th className="text-left py-2 font-medium">Event</th>
                    <th className="text-left py-2 font-medium">Content</th>
                    <th className="text-left py-2 font-medium">User</th>
                    <th className="text-left py-2 font-medium">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.recentEvents
                    .filter(event => {
                      if (!searchQuery) return true;
                      const query = searchQuery.toLowerCase();
                      return (
                        event.contentId.toLowerCase().includes(query) ||
                        event.eventType.toLowerCase().includes(query) ||
                        event.contentType.toLowerCase().includes(query) ||
                        (event.userId || '').toLowerCase().includes(query)
                      );
                    })
                    .map(event => (
                      <tr key={event.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 text-sm">{formatDate(event.timestamp)}</td>
                        <td className="py-2">
                          <div className="flex items-center">
                            {getEventTypeIcon(event.eventType)}
                            <span className="ml-2 capitalize">{event.eventType}</span>
                          </div>
                        </td>
                        <td className="py-2">
                          <div className="flex items-center">
                            {getContentTypeIcon(event.contentType)}
                            <span className="ml-2 truncate max-w-[180px]">
                              {event.contentType.charAt(0).toUpperCase() + event.contentType.slice(1)} {event.contentId.substring(0, 6)}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 text-sm">
                          {event.userId ?
                            <span>{event.userId.substring(0, 8)}...</span> :
                            <span className="text-gray-400">Anonymous</span>
                          }
                          {event.userRole && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {event.userRole}
                            </Badge>
                          )}
                        </td>
                        <td className="py-2 text-sm">
                          {event.eventType === AnalyticsEventType.COMPLETE && event.metadata?.timeSpentSeconds && (
                            <span>Time: {formatTimeSpent(event.metadata.timeSpentSeconds)}</span>
                          )}
                          {event.metadata?.action && (
                            <span>Action: {event.metadata.action}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
