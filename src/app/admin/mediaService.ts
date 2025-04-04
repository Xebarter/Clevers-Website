"use client";

import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy as firestoreOrderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
  updateMetadata
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { AppUser } from '@/lib/permissions';
import { trackContentEngagement, AnalyticsEventType } from '@/lib/analytics';

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'document' | 'other';
  size: number; // in bytes
  createdAt: string;
  tags: string[];
  storagePath?: string; // Firebase Storage path
  createdBy?: string; // User ID who created the item
}

// Mock data for the media library
const MOCK_MEDIA: MediaItem[] = [
  {
    id: 'img-001',
    url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1000',
    name: 'kindergarten-playground.jpg',
    type: 'image',
    size: 1024 * 1024 * 2.3, // 2.3MB
    createdAt: '2024-01-15T10:30:00Z',
    tags: ['playground', 'outdoor', 'children'],
  },
  {
    id: 'img-002',
    url: 'https://images.unsplash.com/photo-1580894906475-403276d3942d?q=80&w=1000',
    name: 'classroom.jpg',
    type: 'image',
    size: 1024 * 1024 * 1.8, // 1.8MB
    createdAt: '2024-01-20T14:45:00Z',
    tags: ['classroom', 'indoor', 'learning'],
  },
  {
    id: 'img-003',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000',
    name: 'students-playing.jpg',
    type: 'image',
    size: 1024 * 1024 * 3.1, // 3.1MB
    createdAt: '2024-02-05T09:15:00Z',
    tags: ['students', 'play', 'activity'],
  },
  {
    id: 'img-004',
    url: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1000',
    name: 'art-class.jpg',
    type: 'image',
    size: 1024 * 1024 * 2.5, // 2.5MB
    createdAt: '2024-02-10T11:20:00Z',
    tags: ['art', 'creativity', 'classroom'],
  },
  {
    id: 'img-005',
    url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000',
    name: 'school-building.jpg',
    type: 'image',
    size: 1024 * 1024 * 2.9, // 2.9MB
    createdAt: '2024-02-15T13:40:00Z',
    tags: ['building', 'exterior', 'school'],
  },
];

export function useMediaLibrary() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load media from Firebase
    const loadMediaData = async () => {
      try {
        // Fetch from Firestore
        const mediaCollection = collection(db, 'media');
        const querySnapshot = await getDocs(
          query(mediaCollection, firestoreOrderBy('createdAt', 'desc'))
        );

        const loadedMedia: MediaItem[] = [];

        querySnapshot.forEach(doc => {
          const data = doc.data();
          loadedMedia.push({
            ...data,
            id: doc.id,
            createdAt: data.createdAt instanceof Timestamp
              ? data.createdAt.toDate().toISOString()
              : data.createdAt
          } as MediaItem);
        });

        // If no media found, initialize with mock data
        if (loadedMedia.length === 0 && MOCK_MEDIA.length > 0) {
          // Upload mock media to Firebase
          for (const mockItem of MOCK_MEDIA) {
            await addMediaItemToFirebase(mockItem, mockItem.url);
          }

          setMediaItems(MOCK_MEDIA);
        } else {
          setMediaItems(loadedMedia);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading media from Firebase:", error);

        // Fallback to mock data if Firebase fails
        setMediaItems(MOCK_MEDIA);
        setIsLoading(false);
      }
    };

    loadMediaData();
  }, []);

  // Add media item to Firestore and update the state
  const addMediaItemToFirebase = async (item: Omit<MediaItem, 'id' | 'createdAt'>, sourceUrl: string, currentUser?: AppUser) => {
    try {
      // Create a new media document in Firestore
      const docRef = await addDoc(collection(db, 'media'), {
        ...item,
        createdAt: serverTimestamp(),
        createdBy: currentUser?.id
      });

      // Add the generated ID and current time to the media item
      const createdAt = new Date().toISOString();
      const newItem: MediaItem = {
        ...item,
        id: docRef.id,
        createdAt
      };

      // Update state
      setMediaItems(prev => [newItem, ...prev]);

      // Track for analytics
      if (currentUser) {
        trackContentEngagement(
          newItem.id,
          'media' as any, // Cast as ContentType is not exported
          AnalyticsEventType.CLICK,
          currentUser.id,
          currentUser.role,
          { action: 'create', mediaType: item.type }
        );
      }

      return newItem;
    } catch (error) {
      console.error("Error adding media item to Firebase:", error);
      throw error;
    }
  };

  // Function to add a new media item
  const addMediaItem = async (item: Omit<MediaItem, 'id' | 'createdAt'>, currentUser?: AppUser) => {
    return await addMediaItemToFirebase(item, item.url, currentUser);
  };

  // Function to delete a media item
  const deleteMediaItem = async (id: string, currentUser?: AppUser) => {
    try {
      const item = mediaItems.find(item => item.id === id);
      if (!item) return false;

      // If the item has a storage path, delete from Firebase Storage
      if (item.storagePath) {
        const storageRef = ref(storage, item.storagePath);
        await deleteObject(storageRef);
      }

      // Delete from Firestore
      await deleteDoc(doc(db, 'media', id));

      // Update state
      setMediaItems(prev => prev.filter(item => item.id !== id));

      // Track for analytics
      if (currentUser) {
        trackContentEngagement(
          id,
          'media' as any,
          AnalyticsEventType.CLICK,
          currentUser.id,
          currentUser.role,
          { action: 'delete', mediaType: item.type }
        );
      }

      return true;
    } catch (error) {
      console.error("Error deleting media item:", error);
      return false;
    }
  };

  // Function to update a media item
  const updateMediaItem = async (id: string, data: Partial<Omit<MediaItem, 'id' | 'createdAt'>>, currentUser?: AppUser) => {
    try {
      // Update in Firestore
      await updateDoc(doc(db, 'media', id), data);

      // If this is updating tags and the item has a storagePath, also update metadata in storage
      const item = mediaItems.find(item => item.id === id);
      if (item?.storagePath && data.tags) {
        const storageRef = ref(storage, item.storagePath);

        try {
          const metadata = await getMetadata(storageRef);
          await updateMetadata(storageRef, {
            ...metadata,
            customMetadata: {
              ...metadata.customMetadata,
              tags: data.tags.join(',')
            }
          });
        } catch (err) {
          console.error("Error updating storage metadata:", err);
          // Continue even if metadata update fails
        }
      }

      // Update state
      setMediaItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, ...data } : item
        )
      );

      // Track for analytics
      if (currentUser) {
        trackContentEngagement(
          id,
          'media' as any,
          AnalyticsEventType.CLICK,
          currentUser.id,
          currentUser.role,
          { action: 'update' }
        );
      }

      return true;
    } catch (error) {
      console.error("Error updating media item:", error);
      return false;
    }
  };

  // Function to search media items
  const searchMediaItems = (query: string, filter?: 'image' | 'document' | 'other') => {
    const q = query.toLowerCase();
    return mediaItems.filter(item => {
      // Filter by type if specified
      if (filter && item.type !== filter) return false;

      // Search in name and tags
      return (
        item.name.toLowerCase().includes(q) ||
        item.tags.some(tag => tag.toLowerCase().includes(q))
      );
    });
  };

  // Function to handle file uploads to Firebase Storage
  const uploadMediaFile = async (file: File, currentUser?: AppUser): Promise<MediaItem | null> => {
    try {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size exceeds 10MB');
      }

      // Generate a unique file name to avoid collisions
      const fileExtension = file.name.split('.').pop() || '';
      const uniqueFileName = `${uuidv4()}.${fileExtension}`;

      // Create a storage path based on file type
      let filePath: string;
      let type: 'image' | 'document' | 'other' = 'other';

      if (file.type.startsWith('image/')) {
        filePath = `images/${uniqueFileName}`;
        type = 'image';
      } else if (file.type.includes('pdf') || file.type.includes('doc') || file.type.includes('sheet')) {
        filePath = `documents/${uniqueFileName}`;
        type = 'document';
      } else {
        filePath = `other/${uniqueFileName}`;
      }

      // Create a storage reference
      const storageRef = ref(storage, filePath);

      // Add custom metadata, including original file name and tags
      const metadata = {
        contentType: file.type,
        customMetadata: {
          originalFileName: file.name,
          tags: ''
        }
      };

      // Upload the file
      const snapshot = await uploadBytes(storageRef, file, metadata);

      // Get the download URL
      const url = await getDownloadURL(snapshot.ref);

      // Create the media item
      const newItem: Omit<MediaItem, 'id' | 'createdAt'> = {
        url,
        name: file.name,
        type,
        size: file.size,
        tags: [],
        storagePath: filePath,
        createdBy: currentUser?.id
      };

      // Add to Firestore and state
      return await addMediaItemToFirebase(newItem, url, currentUser);
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  return {
    mediaItems,
    isLoading,
    addMediaItem,
    deleteMediaItem,
    updateMediaItem,
    searchMediaItems,
    uploadMediaFile
  };
}
