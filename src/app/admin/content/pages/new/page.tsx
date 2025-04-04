"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  FileText,
  Save,
  ArrowLeft,
  AlertCircle,
  Link2,
  FileCode,
  Settings,
  Plus,
  Trash2,
  X
} from "lucide-react";
import { useCms, PageSection } from '../../../cmsService';
import { WysiwygEditor } from '@/components/ui/wysiwyg-editor';
import { MediaLibrary } from '@/components/ui/media-library';

export default function NewPagePage() {
  const router = useRouter();
  const { createPage } = useCms();

  // Page form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  // Sections state
  const [sections, setSections] = useState<Omit<PageSection, 'id'>[]>([
    {
      title: 'Introduction',
      content: '',
      type: 'text',
      order: 1
    }
  ]);

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [activeTab, setActiveTab] = useState('basic');

  // Generate slug from title
  const generateSlug = () => {
    const generatedSlug = title.toLowerCase()
      .replace(/[^\w\s-]/g, '')  // Remove special characters
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/-+/g, '-')       // Remove consecutive hyphens
      .trim();

    setSlug(generatedSlug);
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!slug.trim()) {
      newErrors.slug = 'URL slug is required';
    } else if (!/^[a-z0-9-]+$/.test(slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers and hyphens';
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }

    // Validate sections
    let hasInvalidSections = false;
    const validatedSections = sections.map((section, index) => {
      if (!section.title.trim()) {
        hasInvalidSections = true;
        return { ...section, error: 'Section title is required' };
      }
      if (!section.content.trim()) {
        hasInvalidSections = true;
        return { ...section, error: 'Section content is required' };
      }
      return { ...section, error: undefined };
    });

    if (hasInvalidSections) {
      setSections(validatedSections);
      newErrors.sections = 'One or more sections have errors';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add a new section
  const addSection = () => {
    setSections([
      ...sections,
      {
        title: `Section ${sections.length + 1}`,
        content: '',
        type: 'text',
        order: sections.length + 1
      }
    ]);
  };

  // Update a section
  const updateSection = (index: number, field: keyof Omit<PageSection, 'id'>, value: any) => {
    const updatedSections = [...sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value
    };
    setSections(updatedSections);
  };

  // Remove a section
  const removeSection = (index: number) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);

    // Update order of remaining sections
    updatedSections.forEach((section, idx) => {
      section.order = idx + 1;
    });

    setSections(updatedSections);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create page
    createPage({
      title,
      slug,
      content,
      metaDescription,
      isPublished,
      sections: sections
    });

    // Redirect to pages list
    router.push('/admin/content/pages');
  };

  const handleSectionChange = (index: number, field: keyof Omit<PageSection, 'id'>, value: any) => {
    const updatedSections = [...sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value
    };
    setSections(updatedSections);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2"
            onClick={() => router.push('/admin/content/pages')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold font-heading text-kinder-blue flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            Create New Page
          </h1>
        </div>
        <p className="text-gray-600 font-body mt-2">
          Create a new page for your website with content sections.
        </p>
      </div>

      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="sections" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Sections
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="flex-1">
            <TabsContent value="basic" className="mt-0 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Page Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Title Field */}
                  <div className="grid gap-2">
                    <Label htmlFor="title">
                      Page Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onBlur={() => {
                        if (title && !slug) {
                          generateSlug();
                        }
                      }}
                      placeholder="Enter page title"
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Slug Field */}
                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="slug">
                        URL Slug <span className="text-red-500">*</span>
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={generateSlug}
                        className="h-6 px-2 text-xs"
                      >
                        Generate from title
                      </Button>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-muted px-3 py-2 rounded-l-md text-muted-foreground text-sm border border-r-0 border-input">
                        /
                      </span>
                      <Input
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                        placeholder="page-url-slug"
                        className={`rounded-l-none ${errors.slug ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.slug && (
                      <p className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.slug}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      This will be the URL of your page. Use only lowercase letters, numbers, and hyphens.
                    </p>
                  </div>

                  {/* Meta Description */}
                  <div className="grid gap-2">
                    <Label htmlFor="metaDescription">
                      Meta Description <span className="text-gray-500 font-normal">(Optional)</span>
                    </Label>
                    <Textarea
                      id="metaDescription"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Brief description for search engines"
                      className="h-20"
                    />
                    <p className="text-xs text-gray-500">
                      A short description that appears in search engine results. Keep it under 160 characters.
                    </p>
                  </div>

                  {/* Published Status */}
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="isPublished"
                      checked={isPublished}
                      onCheckedChange={(checked) => setIsPublished(checked === true)}
                    />
                    <Label htmlFor="isPublished" className="font-normal cursor-pointer">
                      Publish page immediately
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="mt-0 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Page Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="content">
                      Main Content <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter the main content for your page"
                      className={`min-h-[300px] ${errors.content ? "border-red-500" : ""}`}
                    />
                    {errors.content && (
                      <p className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.content}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      This is the main content that appears at the top of your page.
                      You can also add more detailed sections below.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sections" className="mt-0 space-y-4">
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle>Page Sections</CardTitle>
                  <Button type="button" size="sm" onClick={addSection}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </CardHeader>
                <CardContent>
                  {errors.sections && (
                    <div className="bg-red-50 text-red-800 px-4 py-3 rounded-md mb-4 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <p>Please fix the errors in your sections</p>
                    </div>
                  )}

                  {sections.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed rounded-md">
                      <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No sections added yet</h3>
                      <p className="text-gray-500 mb-4 max-w-md mx-auto">
                        Sections help organize your page content. Add your first section to get started.
                      </p>
                      <Button type="button" onClick={addSection}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Section
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {sections.map((section, index) => (
                        <div key={index} className="border rounded-md p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-lg">Section {index + 1}</h3>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSection(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>

                          <div className="space-y-4">
                            <div className="grid gap-2">
                              <Label htmlFor={`section-${index}-title`}>
                                Section Title
                              </Label>
                              <Input
                                id={`section-${index}-title`}
                                value={section.title}
                                onChange={(e) => updateSection(index, 'title', e.target.value)}
                                placeholder="Section title"
                                className={section.error && !section.title ? "border-red-500" : ""}
                              />
                              {section.error && !section.title && (
                                <p className="text-red-500 text-sm flex items-center mt-1">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  Section title is required
                                </p>
                              )}
                            </div>

                            <div className="mb-4">
                              <Label htmlFor={`section-${index}-content`} className="mb-2 block">
                                Content
                              </Label>
                              {section.type === 'image' ? (
                                <div>
                                  {section.content && (
                                    <div className="mb-2 rounded-md overflow-hidden border">
                                      <img
                                        src={section.content}
                                        alt="Section image"
                                        className="w-full max-h-[200px] object-contain"
                                      />
                                    </div>
                                  )}
                                  <MediaLibrary
                                    onSelect={(url) => handleSectionChange(index, 'content', url)}
                                    selectedUrl={section.content}
                                    buttonLabel={section.content ? "Change Image" : "Select Image"}
                                  />
                                </div>
                              ) : section.type === 'gallery' ? (
                                <div>
                                  <div className="grid grid-cols-3 gap-2 mb-2">
                                    {section.content.split(',').filter(url => url.trim()).map((url, idx) => (
                                      <div key={idx} className="relative rounded-md overflow-hidden border group">
                                        <img
                                          src={url.trim()}
                                          alt={`Gallery image ${idx + 1}`}
                                          className="w-full h-24 object-cover"
                                        />
                                        <button
                                          type="button"
                                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                          onClick={() => {
                                            const urls = section.content.split(',').filter(u => u.trim());
                                            urls.splice(idx, 1);
                                            handleSectionChange(index, 'content', urls.join(','));
                                          }}
                                        >
                                          <X className="h-4 w-4" />
                                        </button>
                                      </div>
                                    ))}
                                    <div className="flex items-center justify-center border border-dashed rounded-md h-24">
                                      <MediaLibrary
                                        onSelect={(url) => {
                                          const currentUrls = section.content ? section.content.split(',').filter(u => u.trim()) : [];
                                          currentUrls.push(url);
                                          handleSectionChange(index, 'content', currentUrls.join(','));
                                        }}
                                        buttonLabel="Add Image"
                                      />
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Gallery images are separated by commas. Click "Add Image" to add more images.
                                  </div>
                                </div>
                              ) : (
                                <WysiwygEditor
                                  initialContent={section.content}
                                  onChange={(content) => handleSectionChange(index, 'content', content)}
                                  placeholder={`Enter content for this ${section.type} section...`}
                                  className="min-h-[200px]"
                                />
                              )}
                              {section.error && <p className="text-sm text-red-500 mt-1">{section.error}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <div className="flex gap-2">
              {activeTab === "basic" ? (
                <Button type="button" onClick={() => router.push('/admin/content/pages')}>
                  Cancel
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={() => {
                  const tabIndex = ["basic", "content", "sections"].indexOf(activeTab);
                  if (tabIndex > 0) {
                    setActiveTab(["basic", "content", "sections"][tabIndex - 1]);
                  }
                }}>
                  Previous
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {activeTab !== "sections" ? (
                <Button type="button" onClick={() => {
                  const tabIndex = ["basic", "content", "sections"].indexOf(activeTab);
                  if (tabIndex < 2) {
                    setActiveTab(["basic", "content", "sections"][tabIndex + 1]);
                  }
                }}>
                  Next
                </Button>
              ) : (
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {isPublished ? 'Publish' : 'Save'} Page
                </Button>
              )}
            </div>
          </div>
        </form>
      </Tabs>
    </div>
  );
}
