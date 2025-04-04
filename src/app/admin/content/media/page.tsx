"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/ui/image-upload';
import { useMediaLibrary, MediaItem } from '../../mediaService';
import {
  Search, ImageIcon, FolderIcon, FileText, FileQuestion,
  Plus, Tag, Trash2, X, Check, Upload, Filter
} from 'lucide-react';

export default function MediaLibraryPage() {
  const {
    mediaItems,
    isLoading,
    uploadMediaFile,
    deleteMediaItem,
    updateMediaItem
  } = useMediaLibrary();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'document' | 'other'>('all');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [uploadImage, setUploadImage] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');

  // Filter media items based on search and type filter
  useEffect(() => {
    let filtered = [...mediaItems];

    // Apply type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === activeFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort by most recent first
    filtered = filtered.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setFilteredItems(filtered);
  }, [mediaItems, searchQuery, activeFilter]);

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get icon for file type
  const getFileIcon = (type: 'image' | 'document' | 'other') => {
    switch(type) {
      case 'image': return <ImageIcon className="h-6 w-6" />;
      case 'document': return <FileText className="h-6 w-6" />;
      default: return <FileQuestion className="h-6 w-6" />;
    }
  };

  // Handle image upload from ImageUpload component
  const handleImageUpload = (imageUrl: string) => {
    setUploadImage(imageUrl);
  };

  // Process upload to media library
  const processUpload = async () => {
    if (!uploadImage || !uploadFileName.trim()) return;

    try {
      // For blob URLs, convert to File object
      if (uploadImage.startsWith('blob:')) {
        const response = await fetch(uploadImage);
        const blob = await response.blob();
        const file = new File([blob], uploadFileName, { type: blob.type });
        await uploadMediaFile(file);
      } else {
        // For external URLs, create media item directly
        const newItem = {
          url: uploadImage,
          name: uploadFileName,
          type: 'image' as const,
          size: 0, // Size unknown for external URLs
          tags: []
        };
        await updateMediaItem(newItem.url, newItem);
      }

      // Reset upload form
      setUploadImage('');
      setUploadFileName('');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  // Handle adding a tag
  const handleAddTag = () => {
    if (selectedItem && tagInput.trim()) {
      const newTags = [...selectedItem.tags, tagInput.trim()];
      updateMediaItem(selectedItem.id, { tags: newTags });
      setTagInput('');
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    if (selectedItem) {
      const newTags = selectedItem.tags.filter(tag => tag !== tagToRemove);
      updateMediaItem(selectedItem.id, { tags: newTags });
    }
  };

  // Handle deleting a media item
  const handleDeleteItem = () => {
    if (selectedItem && confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      deleteMediaItem(selectedItem.id);
      setSelectedItem(null);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Media Library</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Main content - 3 columns */}
        <div className="md:col-span-3">
          <Tabs defaultValue="browse">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="browse">Browse</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search media..."
                    className="pl-8 w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-1 border rounded-md p-1">
                  <Button
                    variant={activeFilter === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveFilter('all')}
                    className="h-8"
                  >
                    All
                  </Button>
                  <Button
                    variant={activeFilter === 'image' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveFilter('image')}
                    className="h-8"
                  >
                    <ImageIcon className="h-4 w-4 mr-1" />
                    Images
                  </Button>
                  <Button
                    variant={activeFilter === 'document' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveFilter('document')}
                    className="h-8"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Documents
                  </Button>
                </div>
              </div>
            </div>

            <TabsContent value="browse" className="mt-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center border border-dashed rounded-lg p-12">
                  <FolderIcon className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No media found</h3>
                  <p className="text-gray-500 max-w-md text-center">
                    {searchQuery
                      ? `No media matches your search for "${searchQuery}". Try different keywords or upload new media.`
                      : activeFilter !== 'all'
                        ? `No ${activeFilter} files found. Upload some or change the filter.`
                        : "Your media library is empty. Upload some media to get started."}
                  </p>
                  {(searchQuery || activeFilter !== 'all') && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilter('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filteredItems.map(item => (
                      <Card
                        key={item.id}
                        className={`cursor-pointer transition-all ${selectedItem?.id === item.id ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className="aspect-square relative bg-gray-100 flex items-center justify-center">
                          {item.type === 'image' ? (
                            <img
                              src={item.url}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center">
                              {getFileIcon(item.type)}
                              <span className="text-xs mt-2 text-gray-500 uppercase">{item.type}</span>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-sm truncate" title={item.name}>
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(item.size)}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            <TabsContent value="upload" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Upload New Media</h3>
                      <p className="text-sm text-gray-500">
                        Upload images and documents to your media library for use throughout the site.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fileName">File Name</Label>
                        <Input
                          id="fileName"
                          value={uploadFileName}
                          onChange={(e) => setUploadFileName(e.target.value)}
                          placeholder="Enter a name for this file"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="block mb-2">Image</Label>
                        <ImageUpload
                          onImageSelect={handleImageUpload}
                          initialImage={uploadImage}
                        />
                      </div>

                      <Button
                        className="w-full"
                        disabled={!uploadImage || !uploadFileName.trim()}
                        onClick={processUpload}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload to Library
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - 1 column */}
        <div className="border-l pl-4 flex flex-col">
          <h3 className="font-medium mb-2">File Details</h3>

          {selectedItem ? (
            <div className="space-y-4">
              {selectedItem.type === 'image' && (
                <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.name}
                    className="h-full w-full object-contain"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-500">Name</Label>
                  <p className="font-medium truncate" title={selectedItem.name}>
                    {selectedItem.name}
                  </p>
                </div>

                <div>
                  <Label className="text-xs text-gray-500">Type</Label>
                  <div className="flex items-center gap-1">
                    {getFileIcon(selectedItem.type)}
                    <span className="text-sm capitalize">{selectedItem.type}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-500">Size</Label>
                  <p>{formatFileSize(selectedItem.size)}</p>
                </div>

                <div>
                  <Label className="text-xs text-gray-500">Date Added</Label>
                  <p>{formatDate(selectedItem.createdAt)}</p>
                </div>

                <div>
                  <Label className="text-xs text-gray-500">URL</Label>
                  <div className="flex items-center gap-1 mt-1">
                    <Input
                      value={selectedItem.url}
                      readOnly
                      className="text-xs"
                      onClick={(e) => e.currentTarget.select()}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedItem.url);
                        alert('URL copied to clipboard!');
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-500">Tags</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedItem.tags.length > 0 ? (
                      selectedItem.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs py-0 h-5 gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveTag(tag);
                            }}
                            className="h-3 w-3 rounded-full hover:bg-gray-200 flex items-center justify-center"
                          >
                            <X className="h-2 w-2" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">No tags</p>
                    )}
                  </div>

                  <div className="flex mt-2 gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag"
                      className="h-7 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={handleAddTag}
                      disabled={!tagInput.trim()}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-auto border-t">
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full gap-1"
                  onClick={handleDeleteItem}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete File
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <FolderIcon className="h-16 w-16 text-gray-200 mb-3" />
              <h3 className="text-gray-500 font-medium mb-1">No file selected</h3>
              <p className="text-gray-400 text-sm">
                Select a file to view its details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
