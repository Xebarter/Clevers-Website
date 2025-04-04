"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Save, ArrowLeft, AlertCircle } from "lucide-react";
import { useCms, Event } from '../../../cmsService';
import { MediaLibrary } from '@/components/ui/media-library';
import { WysiwygEditor } from '@/components/ui/wysiwyg-editor';

export default function NewEventPage() {
  const router = useRouter();
  const { createEvent } = useCms();

  // Event form state
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<Event['category']>('academic');
  const [status, setStatus] = useState<Event['status']>('upcoming');

  // Date and time state - using separate fields for better UX
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Validate form fields
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!endTime) {
      newErrors.endTime = 'End time is required';
    }

    // Validate end date/time is after start date/time
    if (startDate && endDate && startTime && endTime) {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${endDate}T${endTime}`);

      if (endDateTime <= startDateTime) {
        newErrors.endDate = 'End date/time must be after start date/time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Combine date and time fields into ISO strings
  const formatDateTimeForSubmission = (date: string, time: string) => {
    return new Date(`${date}T${time}`).toISOString();
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create event
    createEvent({
      title,
      description,
      location,
      category,
      status,
      startDate: formatDateTimeForSubmission(startDate, startTime),
      endDate: formatDateTimeForSubmission(endDate, endTime),
      imageUrl: imageUrl || undefined,
    });

    // Redirect to events list
    router.push('/admin/content/events');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2"
            onClick={() => router.push('/admin/content/events')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold font-heading text-kinder-blue flex items-center">
            <Calendar className="mr-2 h-6 w-6" />
            New Event
          </h1>
        </div>
        <p className="text-gray-600 font-body mt-2">
          Create a new event for the school calendar and website.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">
                  Event Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter event title"
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
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <WysiwygEditor
                  initialContent={description}
                  onChange={setDescription}
                  placeholder="Describe the event details..."
                  className="min-h-[200px]"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Date and Time */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Date and Time</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={errors.startDate ? "border-red-500" : ""}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime">
                    Start Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="time"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={errors.startTime ? "border-red-500" : ""}
                  />
                  {errors.startTime && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.startTime}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endDate">
                    End Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={errors.endDate ? "border-red-500" : ""}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.endDate}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">
                    End Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="time"
                    id="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className={errors.endTime ? "border-red-500" : ""}
                  />
                  {errors.endTime && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.endTime}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Location & Category */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Location & Category</h3>

              <div className="grid gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="location">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where will the event take place?"
                    className={errors.location ? "border-red-500" : ""}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={category}
                    onValueChange={(value: Event['category']) => setCategory(value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="arts">Arts</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Categorize the event to help visitors find it easily
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={status}
                    onValueChange={(value: Event['status']) => setStatus(value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="past">Past</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Image URL - Optional */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl">
                Event Image <span className="text-gray-500 font-normal">(Optional)</span>
              </Label>
              <div>
                {imageUrl && (
                  <div className="mb-2 rounded-md overflow-hidden border">
                    <img
                      src={imageUrl}
                      alt="Event preview"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}
                <MediaLibrary
                  onSelect={setImageUrl}
                  selectedUrl={imageUrl}
                  buttonLabel={imageUrl ? "Change Image" : "Select Image"}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Choose an image to represent this event.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/content/events')}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
