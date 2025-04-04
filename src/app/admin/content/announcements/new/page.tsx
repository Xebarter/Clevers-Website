"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Megaphone, Save, ArrowLeft, AlertCircle } from "lucide-react";
import { useCms, Announcement } from '../../../cmsService';

export default function NewAnnouncementPage() {
  const router = useRouter();
  const { createAnnouncement } = useCms();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [status, setStatus] = useState<Announcement['status']>('draft');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().substring(0, 10));
  const [expiryDate, setExpiryDate] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Validate form fields
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!publishDate) {
      newErrors.publishDate = 'Publish date is required';
    }

    // Validate expiry date is after publish date if provided
    if (expiryDate && new Date(expiryDate) <= new Date(publishDate)) {
      newErrors.expiryDate = 'Expiry date must be after publish date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create announcement
    createAnnouncement({
      title,
      content,
      isImportant,
      status,
      publishDate: new Date(publishDate).toISOString(),
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
    });

    // Redirect to announcements list
    router.push('/admin/content/announcements');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2"
            onClick={() => router.push('/admin/content/announcements')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold font-heading text-kinder-blue flex items-center">
            <Megaphone className="mr-2 h-6 w-6" />
            New Announcement
          </h1>
        </div>
        <p className="text-gray-600 font-body mt-2">
          Create a new announcement to share important information with parents and visitors.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Announcement Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter announcement title"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">
                  Content <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter announcement content"
                  className={`min-h-[120px] ${errors.content ? "border-red-500" : ""}`}
                />
                {errors.content && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.content}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="publishDate">
                    Publish Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    id="publishDate"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className={errors.publishDate ? "border-red-500" : ""}
                  />
                  {errors.publishDate && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.publishDate}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">
                    Expiry Date <span className="text-gray-500 font-normal">(Optional)</span>
                  </Label>
                  <Input
                    type="date"
                    id="expiryDate"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className={errors.expiryDate ? "border-red-500" : ""}
                  />
                  {errors.expiryDate && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.expiryDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={status}
                    onValueChange={(value: Announcement['status']) => setStatus(value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    {status === 'draft' && "Save as draft to edit later before publishing."}
                    {status === 'published' && "Publishing will make this visible on the website."}
                    {status === 'archived' && "Archived announcements are not visible but can be restored later."}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isImportant"
                    checked={isImportant}
                    onCheckedChange={(checked) => setIsImportant(checked === true)}
                  />
                  <Label htmlFor="isImportant" className="font-normal cursor-pointer">
                    Mark as important
                  </Label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/content/announcements')}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {status === 'published' ? 'Publish' : 'Save'} Announcement
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
