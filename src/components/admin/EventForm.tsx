"use client";

import { useState } from "react";
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

interface EventFormProps {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    start_date: string;
    end_date?: string;
    location?: string;
    is_all_day?: boolean;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function EventForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading 
}: EventFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [startDate, setStartDate] = useState(initialData?.start_date || new Date().toISOString().slice(0, 16));
  const [endDate, setEndDate] = useState(initialData?.end_date || new Date(Date.now() + 3600000).toISOString().slice(0, 16)); // Default to 1 hour later
  const [location, setLocation] = useState(initialData?.location || "");
  const [isAllDay, setIsAllDay] = useState(initialData?.is_all_day || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the dates properly
    const formattedStartDate = isAllDay 
      ? new Date(startDate).toISOString().split('T')[0] + 'T00:00:00'
      : new Date(startDate).toISOString();
    
    const formattedEndDate = isAllDay 
      ? new Date(endDate).toISOString().split('T')[0] + 'T23:59:59'
      : new Date(endDate).toISOString();

    onSubmit({
      id: initialData?.id,
      title,
      description,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      location,
      is_all_day: isAllDay
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData?.id ? "Edit Event" : "Create Event"}</CardTitle>
        <CardDescription>
          {initialData?.id 
            ? "Edit the event details" 
            : "Create a new event to share with your community"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event description"
              rows={3}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date & Time *</Label>
              <Input
                id="startDate"
                type={isAllDay ? "date" : "datetime-local"}
                value={isAllDay ? startDate.split('T')[0] : startDate}
                onChange={(e) => setStartDate(isAllDay ? e.target.value + 'T00:00' : e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date & Time *</Label>
              <Input
                id="endDate"
                type={isAllDay ? "date" : "datetime-local"}
                value={isAllDay ? endDate.split('T')[0] : endDate}
                onChange={(e) => setEndDate(isAllDay ? e.target.value + 'T23:59' : e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Event location"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isAllDay" 
              checked={isAllDay}
              onCheckedChange={(checked) => setIsAllDay(checked as boolean)}
              disabled={isLoading}
            />
            <Label htmlFor="isAllDay">All Day Event</Label>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : (initialData?.id ? "Update" : "Create")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}