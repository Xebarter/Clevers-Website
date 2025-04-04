"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Download,
  Search,
  Calendar,
  Bookmark,
  BookOpen,
  GraduationCap,
  FileImage,
  File,
  FileSpreadsheet
} from "lucide-react";

// Define resource categories
const resourceCategories = [
  { id: "all", name: "All Resources" },
  { id: "academic", name: "Academic Materials" },
  { id: "forms", name: "Forms & Applications" },
  { id: "policies", name: "School Policies" },
  { id: "calendar", name: "Calendars & Schedules" },
  { id: "newsletters", name: "Newsletters" },
];

interface ResourceItem {
  id: number;
  title: string;
  description: string;
  category: string;
  type: string;
  fileSize: string;
  uploadDate: string;
  downloadUrl: string;
}

// Sample resources list
const resources: ResourceItem[] = [
  {
    id: 1,
    title: "Student Handbook 2025",
    description: "Comprehensive guide for students covering school rules, policies, and expectations.",
    category: "policies",
    type: "PDF",
    fileSize: "2.4 MB",
    uploadDate: "January 5, 2025",
    downloadUrl: "#student-handbook"
  },
  {
    id: 2,
    title: "School Calendar 2025",
    description: "Academic calendar with term dates, holidays, and important school events.",
    category: "calendar",
    type: "PDF",
    fileSize: "1.2 MB",
    uploadDate: "December 15, 2024",
    downloadUrl: "#school-calendar"
  },
  {
    id: 3,
    title: "Scholarship Application Form",
    description: "Application form for Clevers' Origin Schools scholarship program.",
    category: "forms",
    type: "DOCX",
    fileSize: "0.5 MB",
    uploadDate: "February 10, 2025",
    downloadUrl: "#scholarship-form"
  },
  {
    id: 4,
    title: "School Fee Structure 2025",
    description: "Comprehensive fee structure for all grades across all campuses.",
    category: "forms",
    type: "PDF",
    fileSize: "0.8 MB",
    uploadDate: "December 20, 2024",
    downloadUrl: "#fee-structure"
  },
  {
    id: 5,
    title: "Mathematics Syllabus - Grade 7",
    description: "Detailed syllabus covering all mathematics topics for Grade 7 students.",
    category: "academic",
    type: "PDF",
    fileSize: "1.5 MB",
    uploadDate: "January 15, 2025",
    downloadUrl: "#math-syllabus-g7"
  },
  {
    id: 6,
    title: "Science Syllabus - Grade 7",
    description: "Detailed syllabus covering all science topics for Grade 7 students.",
    category: "academic",
    type: "PDF",
    fileSize: "1.7 MB",
    uploadDate: "January 15, 2025",
    downloadUrl: "#science-syllabus-g7"
  },
  {
    id: 7,
    title: "English Syllabus - Grade 7",
    description: "Detailed syllabus covering all English topics for Grade 7 students.",
    category: "academic",
    type: "PDF",
    fileSize: "1.3 MB",
    uploadDate: "January 15, 2025",
    downloadUrl: "#english-syllabus-g7"
  },
  {
    id: 8,
    title: "School Newsletter - Term 1 2025",
    description: "First term newsletter featuring student achievements, upcoming events, and school news.",
    category: "newsletters",
    type: "PDF",
    fileSize: "3.2 MB",
    uploadDate: "February 28, 2025",
    downloadUrl: "#newsletter-t1-2025"
  },
  {
    id: 9,
    title: "Boarding Facilities Guidelines",
    description: "Guidelines and rules for boarding students across all campuses.",
    category: "policies",
    type: "PDF",
    fileSize: "1.1 MB",
    uploadDate: "January 10, 2025",
    downloadUrl: "#boarding-guidelines"
  },
  {
    id: 10,
    title: "Exam Timetable - Term 1 2025",
    description: "Detailed schedule for first term examinations.",
    category: "calendar",
    type: "PDF",
    fileSize: "0.7 MB",
    uploadDate: "March 15, 2025",
    downloadUrl: "#exam-timetable-t1"
  },
  {
    id: 11,
    title: "School Uniform Requirements",
    description: "Detailed information about school uniform requirements with illustrations.",
    category: "policies",
    type: "PDF",
    fileSize: "1.8 MB",
    uploadDate: "January 5, 2025",
    downloadUrl: "#uniform-requirements"
  },
  {
    id: 12,
    title: "Parent-Teacher Association Form",
    description: "Registration form for parents who want to join the school's PTA.",
    category: "forms",
    type: "DOCX",
    fileSize: "0.4 MB",
    uploadDate: "February 5, 2025",
    downloadUrl: "#pta-form"
  },
];

const ResourcesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter resources by category and search query
  const filteredResources = resources.filter(resource => {
    // Filter by category
    const categoryMatch = activeTab === "all" || resource.category === activeTab;

    // Filter by search query
    const searchMatch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && searchMatch;
  });

  // Get file icon based on file type
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case 'jpg':
      case 'png':
        return <FileImage className="h-5 w-5 text-purple-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get category icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic':
        return <BookOpen className="h-4 w-4 mr-1" />;
      case 'forms':
        return <FileText className="h-4 w-4 mr-1" />;
      case 'policies':
        return <Bookmark className="h-4 w-4 mr-1" />;
      case 'calendar':
        return <Calendar className="h-4 w-4 mr-1" />;
      case 'newsletters':
        return <GraduationCap className="h-4 w-4 mr-1" />;
      default:
        return <FileText className="h-4 w-4 mr-1" />;
    }
  };

  // Get category badge color
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'academic':
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 'forms':
        return "bg-green-100 text-green-800 border-green-200";
      case 'policies':
        return "bg-purple-100 text-purple-800 border-purple-200";
      case 'calendar':
        return "bg-orange-100 text-orange-800 border-orange-200";
      case 'newsletters':
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">School Resources</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access and download school documents, forms, academic materials, calendars, and newsletters.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold">Resource Library</h2>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search resources..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-6 h-auto">
              {resourceCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs md:text-sm py-2">
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Resources List */}
        <div className="space-y-4">
          {filteredResources.length === 0 ? (
            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <p className="text-gray-500">No resources found matching your criteria</p>
              </CardContent>
            </Card>
          ) : (
            filteredResources.map((resource) => (
              <Card key={resource.id} className="overflow-hidden group hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-gray-50 p-6 flex items-center justify-center md:w-24">
                    {getFileIcon(resource.type)}
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold">{resource.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{resource.description}</p>
                      </div>
                      <Link href={resource.downloadUrl} className="mt-2 md:mt-0">
                        <Button size="sm" className="gap-1">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </Link>
                    </div>
                    <div className="flex flex-wrap items-center mt-4 text-xs text-gray-500 gap-x-4 gap-y-2">
                      <Badge variant="outline" className={getCategoryBadgeClass(resource.category)}>
                        <span className="flex items-center">
                          {getCategoryIcon(resource.category)}
                          {resourceCategories.find(c => c.id === resource.category)?.name || resource.category}
                        </span>
                      </Badge>
                      <span className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {resource.type} • {resource.fileSize}
                      </span>
                      <span>Uploaded: {resource.uploadDate}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Parent Resources Section */}
        <div className="mt-16">
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle>Request Additional Materials</CardTitle>
              <CardDescription>
                Can't find what you're looking for? Contact us to request additional resources.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button className="w-full sm:w-auto">Contact Administration</Button>
                </Link>
                <Link href="mailto:resources@cleversorigin.edu">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Email Resource Department
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
