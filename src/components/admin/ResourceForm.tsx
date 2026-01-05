"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createResource, updateResource } from "@/lib/admin/services";

interface Resource {
  _id?: string;
  title: string;
  description: string;
  category?: string;
  file_url?: string;
  file_name?: string;
  type?: string;
  file_size?: number;
  created_at?: string;
}

interface ResourceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource?: Resource | null;
  onSave: () => void;
}

export default function ResourceForm({ open, onOpenChange, resource, onSave }: ResourceFormProps) {
  const [title, setTitle] = useState(resource?.title || "");
  const [description, setDescription] = useState(resource?.description ?? "");
  const [category, setCategory] = useState(resource?.category ?? "");
  const [fileUrl, setFileUrl] = useState(resource?.file_url ?? "");
  const [fileName, setFileName] = useState(resource?.file_name ?? "");
  const [fileType, setFileType] = useState(resource?.type ?? "");
  const [fileSize, setFileSize] = useState<number>(resource?.file_size ?? 0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!resource?._id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const resourceData = {
        title,
        description,
        category,
        file_url: fileUrl,
        file_name: fileName,
        type: fileType,
        file_size: fileSize ? Number(fileSize) : undefined,
      };

      if (isEditing) {
        await updateResource(resource._id!, resourceData);
      } else {
        await createResource(resourceData);
      }

      onSave();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while saving the resource");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'resources');
      formData.append('folder', 'files');

      const resp = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await resp.json();

      if (!resp.ok) {
        const errMsg = json?.error || `HTTP ${resp.status}`;
        console.error('Upload error:', errMsg);
        setError(`Upload failed: ${errMsg}`);
        return;
      }

      const result = Array.isArray(json.results) ? json.results[0] : json.results;
      if (!result) {
        setError('Upload returned no result');
        return;
      }
      if (result.error) {
        setError(result.error);
        return;
      }

      // Populate form fields from upload result
      setFileUrl(result.url || '');
      setFileName(file.name);
      setFileType(file.type || '');
      setFileSize(Math.round((file.size || 0) / 1024));
    } catch (err: any) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    setTitle(resource?.title || "");
    setDescription(resource?.description ?? "");
    setCategory(resource?.category ?? "");
    setFileUrl(resource?.file_url ?? "");
    setFileName(resource?.file_name ?? "");
    setFileType(resource?.type ?? "");
    setFileSize(resource?.file_size ?? 0);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) {
        resetForm();
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Resource" : "Add New Resource"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title ?? ""}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Resource title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Resource description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category ?? ""} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Administrative">Administrative</SelectItem>
                  <SelectItem value="Extracurricular">Extracurricular</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileSize">File Size (KB)</Label>
              <Input
                id="fileSize"
                type="number"
                value={fileSize ?? ""}
                onChange={(e) => setFileSize(e.target.value ? Number(e.target.value) : 0)}
                placeholder="File size in kilobytes"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileUpload">Upload File</Label>
            <Input
              id="fileUpload"
              type="file"
              accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/*,audio/*,video/*"
              onChange={handleFileUpload}
              ref={fileInputRef}
              disabled={uploading}
            />
            {uploading && <p className="text-sm text-blue-500">Uploading file...</p>}
            <div className="text-sm text-muted-foreground mt-1">Or enter a public file URL below.</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fileUrl">File URL</Label>
              <Input
                id="fileUrl"
                value={fileUrl ?? ""}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://example.com/file.pdf"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileName">File Name</Label>
              <Input
                id="fileName"
                value={fileName ?? ""}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="file.pdf"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fileType">File Type</Label>
              <Input
                id="fileType"
                value={fileType ?? ""}
                onChange={(e) => setFileType(e.target.value)}
                placeholder="PDF, DOCX, XLSX, etc."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Resource"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}