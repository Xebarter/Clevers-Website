"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X } from "lucide-react";

interface AnnouncementFormProps {
  initialData?: {
    title: string;
    content: string;
    date: string;
    category: string;
    pinned: boolean;
    imageUrl?: string;
    ctaText?: string;
    ctaLink?: string;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function AnnouncementForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading
}: AnnouncementFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(initialData?.category || "general");
  const [pinned, setPinned] = useState(initialData?.pinned || false);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [ctaText, setCtaText] = useState(initialData?.ctaText || "");
  const [ctaLink, setCtaLink] = useState(initialData?.ctaLink || "");
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [uploading, setUploading] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      date,
      category,
      pinned,
      imageUrl: imageUrl || undefined,
      ctaText: ctaText || undefined,
      ctaLink: ctaLink || undefined
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);

      try {
        // Upload using XHR to show progress
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'announcements');
        formData.append('folder', 'images');

        await new Promise<void>((resolve, reject) => {
          const xhr: any = new XMLHttpRequest();
          xhr.open('POST', '/api/upload');
          xhr.upload.onprogress = (e: ProgressEvent) => {
            if (e.lengthComputable) setUploadingProgress(Math.floor((e.loaded / e.total) * 100));
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve(); else reject(new Error(`HTTP ${xhr.status}`));
          };
          xhr.onerror = () => reject(new Error('Network error'));
          xhr.send(formData);
        });

        // fetch json result
        const resp = await fetch('/api/upload', { method: 'POST', body: formData });
        const json = await resp.json();
        if (!resp.ok) {
          const errMsg = json?.error || `HTTP ${resp.status}`;
          console.error('Upload error:', errMsg);
          alert(`Upload failed: ${errMsg}`);
          return;
        }

        const fileResult = Array.isArray(json.results) ? json.results[0] : json.results;
        if (!fileResult || fileResult.error) {
          const errMsg = fileResult?.error || 'No result returned';
          console.error('Upload error:', errMsg);
          alert(`Upload failed: ${errMsg}`);
          return;
        }

        setImageUrl(fileResult.url);
        setImagePreview(fileResult.url);
      } catch (error) {
        console.error('Upload error:', error);
        alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      } finally {
        setUploading(false);
        setUploadingProgress(null);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Announcement" : "Create Announcement"} </CardTitle>
        <CardDescription>
          {initialData
            ? "Edit the announcement details"
            : "Create a new announcement to share with your community"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Announcement content"
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Image (Optional)</Label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                  disabled={uploading || isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  disabled={uploading || isLoading}
                />
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center gap-2">
                    {uploading ? (
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-600">
                      {uploading ? "Uploading..." : "Click to upload an image"}
                    </span>
                  </div>
                </Label>
              </div>
            )}
            {uploadingProgress !== null && (
              <div className="mt-2 w-full bg-gray-200 rounded overflow-hidden">
                <div className="h-2 bg-blue-500" style={{ width: `${uploadingProgress}%` }} />
                <div className="text-xs text-gray-600 mt-1">{uploadingProgress}%</div>
              </div>
            )}
            <div className="text-sm text-gray-500">
              You can also enter an image URL directly below
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImagePreview(e.target.value);
              }}
              placeholder="https://example.com/image.jpg"
              disabled={uploading || isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ctaText">CTA Button Text (Optional)</Label>
              <Input
                id="ctaText"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="Learn More"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaLink">CTA Button Link (Optional)</Label>
              <Input
                id="ctaLink"
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                placeholder="https://example.com"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="pinned"
              checked={pinned}
              onCheckedChange={(checked) => setPinned(checked as boolean)}
              disabled={isLoading}
            />
            <Label htmlFor="pinned">Pin this announcement</Label>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading || uploading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || uploading}>
            {isLoading ? "Saving..." : (initialData ? "Update" : "Create")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}