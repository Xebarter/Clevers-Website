"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { resourcesService } from "../../../lib/supabase/services"; // Use relative path for Supabase services
import { Resource } from "../../../lib/supabase/client"; // Use relative path for Supabase client

// UI components
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Icons
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
  FileSpreadsheet,
} from "lucide-react";

const resourceCategories = [
  { id: "all", name: "All Resources" },
  { id: "academic", name: "Academic Materials" },
  { id: "forms", name: "Forms & Applications" },
  { id: "policies", name: "School Policies" },
  { id: "calendar", name: "Calendars & Schedules" },
  { id: "newsletters", name: "Newsletters" },
];

// Updated interface to match Supabase resource structure
interface SupabaseResource extends Resource {
  type?: string; // We'll derive this from file_name if needed
  fileSize?: string; // We'll need to handle this differently as Supabase doesn't store it directly
  uploadDate?: string; // Using created_at from Supabase
}

const ResourcesPage = () => {
  const [resources, setResources] = useState<SupabaseResource[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const data = await resourcesService.getAll();
        
        // Transform Supabase resources to match the expected format
        const transformedResources = data.map(resource => ({
          ...resource,
          type: resource.file_name ? resource.file_name.split('.').pop()?.toUpperCase() || 'FILE' : 'LINK',
          fileSize: 'N/A', // Supabase doesn't store file sizes directly
          uploadDate: resource.created_at || new Date().toISOString(), // Use created_at from Supabase
        }));
        
        setResources(transformedResources);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = resources.filter((resource) => {
    const categoryMatch = activeTab === "all" || resource.category === activeTab;
    const searchMatch =
      (resource.title && resource.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return categoryMatch && searchMatch;
  });

  const getFileIcon = (type: string = '') => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "docx":
      case "doc":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "xlsx":
      case "xls":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case "jpg":
      case "png":
        return <FileImage className="h-5 w-5 text-purple-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string = '') => {
    switch (category) {
      case "academic":
        return <BookOpen className="h-4 w-4 mr-1" />;
      case "forms":
        return <FileText className="h-4 w-4 mr-1" />;
      case "policies":
        return <Bookmark className="h-4 w-4 mr-1" />;
      case "calendar":
        return <Calendar className="h-4 w-4 mr-1" />;
      case "newsletters":
        return <GraduationCap className="h-4 w-4 mr-1" />;
      default:
        return <FileText className="h-4 w-4 mr-1" />;
    }
  };

  const getCategoryBadgeClass = (category: string = '') => {
    switch (category) {
      case "academic":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "forms":
        return "bg-green-100 text-green-800 border-green-200";
      case "policies":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "calendar":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "newsletters":
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">School Resources</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Loading resources...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">School Resources</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access and download school documents, forms, academic materials, calendars, and newsletters.
          </p>
        </div>

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
                      <Link href={resource.file_url || "#"} className="mt-2 md:mt-0" target="_blank">
                        <Button size="sm" className="gap-1">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </Link>
                    </div>
                    <div className="flex flex-wrap items-center mt-4 text-xs text-gray-500 gap-x-4 gap-y-2">
                      {resource.category && (
                        <Badge variant="outline" className={getCategoryBadgeClass(resource.category)}>
                          <span className="flex items-center">
                            {getCategoryIcon(resource.category)}
                            {resourceCategories.find((c) => c.id === resource.category)?.name || resource.category}
                          </span>
                        </Badge>
                      )}
                      <span className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {resource.type} • {resource.fileSize}
                      </span>
                      <span>Uploaded: {resource.uploadDate ? new Date(resource.uploadDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;