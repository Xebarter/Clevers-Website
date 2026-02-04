"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Upload, Loader2 } from "lucide-react";
import type { HallOfFame } from "../../../lib/supabase/services";

interface HallOfFameFormProps {
  entry?: HallOfFame | null;
  onClose: () => void;
  onSave: () => void;
}

export default function HallOfFameForm({ entry, onClose, onSave }: HallOfFameFormProps) {
  const [formData, setFormData] = useState({
    title: entry?.title || "",
    learner_names: entry?.learner_names || "",
    achievement: entry?.achievement || "",
    achievement_date: entry?.achievement_date || "",
    image_url: entry?.image_url || "",
    image_alt_text: entry?.image_alt_text || "",
    is_featured: entry?.is_featured || false,
    is_published: entry?.is_published !== undefined ? entry.is_published : true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      setError("");

      // Upload via API endpoint (server-side with service role key)
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/admin/hall-of-fame/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const { url } = await response.json();
      setFormData({ ...formData, image_url: url });
    } catch (err: any) {
      console.error("Error uploading image:", err);
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      handleImageUpload(file);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.learner_names || !formData.achievement || 
        !formData.achievement_date || !formData.image_url) {
      setError("Please fill in all required fields (Name, Achievement, Date, and Image)");
      return;
    }
    
    // Auto-generate title from learner names
    const generatedTitle = formData.learner_names;

    try {
      setSaving(true);
      setError("");

      const url = entry
        ? `/api/admin/hall-of-fame/${entry.id}`
        : "/api/admin/hall-of-fame";
      const method = entry ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          title: generatedTitle
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save hall of fame entry");
      }

      onSave();
      onClose();
    } catch (err: any) {
      console.error("Error saving hall of fame entry:", err);
      setError(err.message || "Failed to save hall of fame entry");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 my-4 sm:my-8 max-h-[95vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold">
            {entry ? "Edit Hall of Fame Entry" : "Add Hall of Fame Entry"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Learner Names */}
          <div>
            <Label htmlFor="learner_names" className="text-sm sm:text-base">Learner Name(s) *</Label>
            <Input
              id="learner_names"
              value={formData.learner_names}
              onChange={(e) => setFormData({ ...formData, learner_names: e.target.value })}
              placeholder="e.g., Sarah Nakato"
              required
              className="text-base sm:text-lg mt-1.5"
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Enter one name or multiple names for group achievements</p>
          </div>

          {/* Achievement */}
          <div>
            <Label htmlFor="achievement" className="text-sm sm:text-base">Achievement *</Label>
            <Textarea
              id="achievement"
              value={formData.achievement}
              onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
              placeholder="e.g., First Place in National Spelling Bee Competition"
              required
              rows={3}
              className="text-sm sm:text-base mt-1.5"
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Describe what was achieved</p>
          </div>

          {/* Achievement Date */}
          <div>
            <Label htmlFor="achievement_date" className="text-sm sm:text-base">Achievement Date *</Label>
            <Input
              id="achievement_date"
              type="date"
              value={formData.achievement_date}
              onChange={(e) => setFormData({ ...formData, achievement_date: e.target.value })}
              required
              className="text-sm sm:text-base mt-1.5"
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label htmlFor="image" className="text-sm sm:text-base">Image *</Label>
            <div className="mt-1.5">
              {formData.image_url ? (
                <div className="relative">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-40 sm:h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 text-xs sm:text-sm"
                    onClick={() => setFormData({ ...formData, image_url: "" })}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center justify-center py-4 px-2">
                    {uploading ? (
                      <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 animate-spin" />
                    ) : (
                      <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                    )}
                    <p className="mb-2 text-xs sm:text-sm text-gray-500 text-center">
                      <span className="font-semibold">Click to upload</span>
                      <span className="hidden sm:inline"> or drag and drop</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                  </div>
                  <input
                    id="image"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Display Settings */}
          <div className="border-t pt-4 space-y-3 sm:space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_featured: checked as boolean })
                }
                className="mt-0.5"
              />
              <Label htmlFor="is_featured" className="font-normal cursor-pointer text-sm sm:text-base leading-tight">
                ⭐ Featured (Highlight this entry on the home page)
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_published: checked as boolean })
                }
                className="mt-0.5"
              />
              <Label htmlFor="is_published" className="font-normal cursor-pointer text-sm sm:text-base leading-tight">
                👁️ Published (Show on public site)
              </Label>
            </div>
          </div>
        </form>

        {/* Form Actions - Fixed at bottom */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t flex-shrink-0 bg-gray-50">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={saving || uploading}
            onClick={handleSubmit}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              entry ? "Update Entry" : "Create Entry"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
