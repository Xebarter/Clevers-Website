"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Badge } from './badge';
import { Card, CardContent } from './card';
import { ScrollArea } from './scroll-area';
import { Checkbox } from './checkbox';
import { Label } from './label';
import {
  Search, ImageIcon, FolderIcon, X, UploadCloud, Check, Tag, Trash2
} from 'lucide-react';
import { ImageUpload } from './image-upload';
import { MediaItem, useMediaLibrary } from '@/app/admin/mediaService';
import { cn } from '@/lib/utils';

interface MediaLibraryProps {
  onSelect: (url: string) => void;
  buttonLabel?: string;
  selectedUrl?: string;
}

export function MediaLibrary({
  onSelect,
  buttonLabel = "Choose Image",
  selectedUrl
}: MediaLibraryProps) {
  const {
    mediaItems,
    isLoading,
    uploadMediaFile,
    deleteMediaItem,
    updateMediaItem,
    searchMediaItems
  } = useMediaLibrary();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'browse' | 'upload'>('browse');
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [tagInput, setTagInput] = useState('');

  // Filter media items when search query changes
  useEffect(() => {
    if (searchQuery) {
      setFilteredItems(searchMediaItems(searchQuery, 'image'));
    } else {
      setFilteredItems(mediaItems.filter(item => item.type === 'image'));
    }
  }, [searchQuery, mediaItems, searchMediaItems]);

  // Set selected item based on URL if provided
  useEffect(() => {
    if (selectedUrl && mediaItems.length > 0) {
      const item = mediaItems.find(item => item.url === selectedUrl);
      if (item) {
        setSelectedItem(item);
      }
    }
  }, [selectedUrl, mediaItems]);

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

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    const newItem = await uploadMediaFile(file);
    if (newItem) {
      setSelectedItem(newItem);
      setActiveTab('browse');
    }
  };

  // Handle image selection
  const handleImageSelect = (item: MediaItem) => {
    setSelectedItem(item);
  };

  // Handle confirmation of selection
  const handleConfirmSelection = () => {
    if (selectedItem) {
      onSelect(selectedItem.url);
      setIsOpen(false);
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
    if (selectedItem) {
      deleteMediaItem(selectedItem.id);
      setSelectedItem(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
          type="button"
        >
          <ImageIcon className="h-4 w-4" />
          {buttonLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[900px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 h-[600px] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 flex-1">
            {/* Main content area - 5 columns */}
            <div className="md:col-span-5 flex flex-col h-full">
              {/* Tabs for browse/upload */}
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'browse' | 'upload')} className="flex-1 flex flex-col">
                <div className="flex items-center justify-between border-b pb-2">
                  <TabsList>
                    <TabsTrigger value="browse">Browse</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                  </TabsList>

                  {activeTab === 'browse' && (
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search images..."
                        className="pl-8 w-[200px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <TabsContent value="browse" className="flex-1 overflow-hidden">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <FolderIcon className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No images found</h3>
                      <p className="text-gray-500 max-w-md">
                        {searchQuery
                          ? `No images match your search for "${searchQuery}". Try different keywords or upload a new image.`
                          : "Your media library is empty. Upload some images to get started."}
                      </p>
                      {searchQuery && (
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => setSearchQuery('')}
                        >
                          Clear Search
                        </Button>
                      )}
                    </div>
                  ) : (
                    <ScrollArea className="h-full pr-3">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-2">
                        {filteredItems.map((item) => (
                          <Card
                            key={item.id}
                            className={cn(
                              "cursor-pointer overflow-hidden transition-all",
                              selectedItem?.id === item.id ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/50"
                            )}
                            onClick={() => handleImageSelect(item)}
                          >
                            <div className="aspect-square relative bg-gray-100 flex items-center justify-center">
                              <img
                                src={item.url}
                                alt={item.name}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <CardContent className="p-2">
                              <p className="text-xs truncate" title={item.name}>{item.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </TabsContent>

                <TabsContent value="upload" className="flex-1">
                  <div className="h-full flex flex-col">
                    <p className="text-sm text-gray-500 mb-4">
                      Upload an image to add it to your media library. The image will be available for use across the site.
                    </p>
                    <div className="flex-1">
                      <ImageUpload
                        onImageSelect={(file) => {
                          if (file && file.startsWith('blob:')) {
                            // Convert from blob URL to File object
                            fetch(file)
                              .then(res => res.blob())
                              .then(blob => {
                                const newFile = new File([blob], "uploaded-image.jpg", { type: "image/jpeg" });
                                handleFileUpload(newFile);
                              });
                          }
                        }}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - 2 columns */}
            <div className="md:col-span-2 border-l pl-4 flex flex-col">
              <h3 className="font-medium mb-2">Image Details</h3>

              {selectedItem ? (
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="aspect-video bg-gray-100 rounded-md overflow-hidden relative">
                    <img
                      src={selectedItem.url}
                      alt={selectedItem.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="space-y-3 flex-1">
                    <div>
                      <Label className="text-xs text-gray-500">Name</Label>
                      <p className="text-sm truncate" title={selectedItem.name}>{selectedItem.name}</p>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-500">Size</Label>
                      <p className="text-sm">{formatFileSize(selectedItem.size)}</p>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-500">Date Added</Label>
                      <p className="text-sm">{formatDate(selectedItem.createdAt)}</p>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-500">Tags</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedItem.tags.length > 0 ? (
                          selectedItem.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs gap-1">
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
                          type="button"
                        >
                          <Tag className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2 border-t mt-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive gap-1 h-8"
                      onClick={handleDeleteItem}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4 text-gray-500">
                  <ImageIcon className="h-10 w-10 text-gray-300 mb-2" />
                  <p className="text-sm">Select an image to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            type="button"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSelection}
            disabled={!selectedItem}
            type="button"
          >
            <Check className="mr-2 h-4 w-4" />
            Select Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MediaLibrary;
