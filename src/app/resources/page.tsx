"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { resourcesService } from "../../../lib/supabase/services";
import { Resource } from "../../../lib/supabase/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Download,
  Search,
  Calendar,
  FileImage,
  File,
  FileSpreadsheet,
  FolderOpen,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const resourceCategories = [
  { id: "all", name: "All" },
  { id: "academic", name: "Academic" },
  { id: "forms", name: "Forms" },
  { id: "policies", name: "Policies" },
  { id: "calendar", name: "Calendars" },
  { id: "newsletters", name: "Newsletters" },
];

type SupabaseResource = Resource & {
  type?: string;
  uploadDate?: string;
};

function getFileIcon(type: string = "") {
  switch (type.toLowerCase()) {
    case "pdf":
      return <FileText className="h-6 w-6 text-red-500" />;
    case "docx":
    case "doc":
      return <FileText className="h-6 w-6 text-blue-500" />;
    case "xlsx":
    case "xls":
      return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
    case "jpg":
    case "png":
      return <FileImage className="h-6 w-6 text-purple-500" />;
    default:
      return <File className="h-6 w-6 text-gray-400" />;
  }
}

const categoryStyles: Record<string, string> = {
  academic: "bg-blue-50 text-blue-700 border-blue-100",
  forms: "bg-green-50 text-green-700 border-green-100",
  policies: "bg-purple-50 text-purple-700 border-purple-100",
  calendar: "bg-orange-50 text-orange-700 border-orange-100",
  newsletters: "bg-pink-50 text-pink-700 border-pink-100",
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<SupabaseResource[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resourcesService
      .getAll()
      .then((data) =>
        setResources(
          data.map((resource) => ({
            ...resource,
            type: resource.file_name?.split(".").pop()?.toUpperCase() || "FILE",
            uploadDate: resource.created_at || new Date().toISOString(),
          }))
        )
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredResources = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return resources.filter((resource) => {
      const categoryMatch = activeTab === "all" || resource.category === activeTab;
      const searchMatch =
        !q ||
        resource.title?.toLowerCase().includes(q) ||
        resource.description?.toLowerCase().includes(q);
      return categoryMatch && searchMatch;
    });
  }, [resources, activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-green-50/20">
      {/* Hero */}
      <section className="relative py-16 sm:py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/15 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-blue-100 shadow-sm mb-6">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Downloads & documents</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-5">
            School{" "}
            <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 bg-clip-text text-transparent">
              Resources
            </span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Access forms, academic materials, policies, calendars, and newsletters for parents and students.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          {/* Toolbar */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search resources..."
                className="pl-9 h-10 border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-auto w-full flex flex-wrap justify-start gap-1 bg-gray-50 p-1 rounded-xl">
                {resourceCategories.map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    {cat.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="hero-spinner" role="status" aria-label="Loading resources" />
              <p className="text-sm font-medium text-green-700/70">Loading resources...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-dashed border-gray-200 bg-white/60">
              <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="font-medium text-gray-700">No resources found</p>
              <p className="text-sm text-gray-500 mt-1">
                {searchQuery ? "Try a different search term." : "New documents will appear here when published."}
              </p>
              {searchQuery && (
                <Button variant="link" className="mt-2 text-green-700" onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                {filteredResources.length} of {resources.length} resources
              </p>
              <div className="space-y-3">
                {filteredResources.map((resource) => (
                  <article
                    key={resource.id}
                    className="group flex flex-col sm:flex-row gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-50 ring-1 ring-gray-100">
                      {getFileIcon(resource.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                            {resource.title}
                          </h3>
                          {resource.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{resource.description}</p>
                          )}
                        </div>
                        {resource.file_url && (
                          <a href={resource.file_url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                            <Button size="sm" className="rounded-lg gap-1.5 bg-green-600 hover:bg-green-700">
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </a>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {resource.category && (
                          <Badge
                            variant="outline"
                            className={cn("text-[10px] uppercase tracking-wide", categoryStyles[resource.category])}
                          >
                            {resourceCategories.find((c) => c.id === resource.category)?.name || resource.category}
                          </Badge>
                        )}
                        {resource.type && (
                          <span className="text-xs text-gray-400">{resource.type}</span>
                        )}
                        {resource.uploadDate && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(resource.uploadDate).toLocaleDateString("en-UG")}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          <div className="mt-12 text-center rounded-2xl border border-green-100 bg-green-50/50 p-8">
            <p className="text-gray-700 mb-4">Need help finding a document?</p>
            <Link href="/contact">
              <Button variant="outline" className="rounded-lg gap-2 border-green-200 text-green-700 hover:bg-green-50">
                Contact us <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
