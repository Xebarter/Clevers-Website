"use client";

import React, { useState, useRef } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import {
  Upload, X, Image as ImageIcon, Link as LinkIcon, Check
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageSelect: (image: string) => void;
  initialImage?: string;
  className?: string;
}

export function ImageUpload({
  onImageSelect,
  initialImage = '',
  className
}: ImageUploadProps) {
  const [image, setImage] = useState<string>(initialImage);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isUrlPopoverOpen, setIsUrlPopoverOpen] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('https://');
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle file changes - either from input or drag and drop
  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];

      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB. Please upload a smaller image.');
        return;
      }

      // Create a URL for the image
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      onImageSelect(imageUrl);
    }
  };

  // Handle URL input
  const handleUrlSubmit = () => {
    if (imageUrl && imageUrl !== 'https://') {
      // Simple URL validation
      try {
        new URL(imageUrl);
        setImage(imageUrl);
        onImageSelect(imageUrl);
        setIsUrlPopoverOpen(false);
        setImageUrl('https://');
      } catch (e) {
        alert('Please enter a valid URL');
      }
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  // Trigger file input click
  const onButtonClick = () => {
    inputRef.current?.click();
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImage('');
    onImageSelect('');
    // Reset file input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Image Preview */}
      {image ? (
        <div className="relative rounded-md border overflow-hidden">
          <img
            src={image}
            alt="Preview"
            className="w-full h-auto max-h-[300px] object-contain bg-gray-50"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={handleRemoveImage}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        // Drop zone
        <div
          className={`border-2 border-dashed rounded-md p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer ${
            dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-10 w-10 text-gray-400" />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Drag and drop your image, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or GIF (Max 5MB)
              </p>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files)}
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {!image && (
          <>
            <Button
              variant="outline"
              type="button"
              onClick={onButtonClick}
              className="gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              Upload Image
            </Button>

            <Popover open={isUrlPopoverOpen} onOpenChange={setIsUrlPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="gap-2"
                >
                  <LinkIcon className="h-4 w-4" />
                  From URL
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Image URL</h4>
                    <p className="text-sm text-muted-foreground">
                      Enter the URL of an image to use
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="imageUrl" className="text-right">
                        URL
                      </Label>
                      <Input
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsUrlPopoverOpen(false)}
                      type="button"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleUrlSubmit}>
                      <Check className="mr-2 h-4 w-4" />
                      Add Image
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </>
        )}

        {image && (
          <Button
            variant="outline"
            type="button"
            onClick={handleRemoveImage}
            className="gap-2 text-destructive"
          >
            <X className="h-4 w-4" />
            Remove Image
          </Button>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
