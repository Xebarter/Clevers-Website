"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { galleryService, GalleryImage } from "../../../lib/supabase/services";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ChevronLeft, ChevronRight, Images, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

const campuses = [
  { id: "Kitintale", label: "Kitintale", dot: "bg-red-500" },
  { id: "Kasokoso", label: "Kasokoso", dot: "bg-blue-500" },
  { id: "Maganjo", label: "Maganjo", dot: "bg-emerald-500" },
] as const;

const DEFAULT_BLUR =
  "data:image/svg+xml;base64," +
  btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="#ecfdf5"/><circle cx="20" cy="20" r="10" fill="#86efac" opacity="0.5"/></svg>`);

function GalleryCard({
  img,
  onClick,
}: {
  img: GalleryImage;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm ring-1 ring-black/5 text-left transition-all hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
    >
      <div className="relative aspect-square">
        {!loaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
            <div className="hero-spinner scale-75" role="status" />
          </div>
        )}
        <Image
          src={img.file_url}
          alt={img.alt_text || img.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          placeholder="blur"
          blurDataURL={img.blur_url || DEFAULT_BLUR}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <p className="text-white font-semibold line-clamp-1">{img.title}</p>
          {img.caption && <p className="text-white/80 text-xs mt-1 line-clamp-2">{img.caption}</p>}
        </div>
      </div>
      {img.category && (
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 text-gray-700 text-[10px] backdrop-blur-sm shadow-sm">
            {img.category}
          </Badge>
        </div>
      )}
    </button>
  );
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    galleryService
      .getAll()
      .then(setImages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredImages = useMemo(() => {
    if (activeTab === "all") return images;
    return images.filter(
      (img) => img.category?.toLowerCase().includes(activeTab.toLowerCase())
    );
  }, [images, activeTab]);

  const currentImage = lightboxIndex !== null ? filteredImages[lightboxIndex] : null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-UG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const goPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
  };

  const goNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setLightboxIndex((i) => (i! - 1 + filteredImages.length) % filteredImages.length);
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((i) => (i! + 1) % filteredImages.length);
      }
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, filteredImages.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-yellow-50/30 to-pink-50/20">
      {/* Hero */}
      <section className="relative py-16 sm:py-20 overflow-hidden bg-gradient-to-br from-pink-50 via-yellow-50/80 to-green-50">
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-pink-100 shadow-sm mb-6">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Campus life & events</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-5">
            Photo{" "}
            <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Memorable moments from events, activities, and daily life across our three campuses.
          </p>
          <Link href="/apply">
            <Button className="rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md">
              Apply Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-10 overflow-x-auto pb-1">
              <TabsList className="h-auto bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl border border-green-100 shadow-sm gap-1">
                <TabsTrigger
                  value="all"
                  className="rounded-xl px-4 sm:px-5 py-2 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-green-700"
                >
                  All Photos
                </TabsTrigger>
                {campuses.map((campus) => (
                  <TabsTrigger
                    key={campus.id}
                    value={campus.id}
                    className="rounded-xl px-4 sm:px-5 py-2 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md"
                  >
                    <span className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", campus.dot)} />
                      {campus.label}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="hero-spinner" role="status" aria-label="Loading gallery" />
                <p className="text-sm font-medium text-green-700/70">Loading gallery...</p>
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="text-center py-20 rounded-2xl border border-dashed border-gray-200 bg-white/60">
                <Images className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="font-medium text-gray-700">No photos in this category yet</p>
                <p className="text-sm text-gray-500 mt-1">Check back soon for new uploads.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-6 text-center">
                  {filteredImages.length} {filteredImages.length === 1 ? "photo" : "photos"}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {filteredImages.map((img, index) => (
                    <GalleryCard
                      key={img.id || index}
                      img={img}
                      onClick={() => setLightboxIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </Tabs>
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden gap-0 border-0 bg-black/95">
          <DialogHeader className="sr-only">
            <DialogTitle>{currentImage?.title || "Gallery image"}</DialogTitle>
          </DialogHeader>
          {currentImage && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="absolute top-3 right-3 z-20 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 backdrop-blur-sm"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              {filteredImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 backdrop-blur-sm"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 backdrop-blur-sm"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
              <div className="relative aspect-video max-h-[70vh] w-full bg-black">
                <Image
                  src={currentImage.file_url}
                  alt={currentImage.alt_text || currentImage.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
              <div className="p-5 sm:p-6 bg-white">
                <h3 className="text-xl font-bold text-gray-900">{currentImage.title}</h3>
                {currentImage.caption && (
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">{currentImage.caption}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  {currentImage.category && (
                    <Badge variant="outline" className="text-xs">
                      {currentImage.category}
                    </Badge>
                  )}
                  {currentImage.created_at && (
                    <span className="text-xs text-gray-400">{formatDate(currentImage.created_at)}</span>
                  )}
                  {filteredImages.length > 1 && (
                    <span className="text-xs text-gray-400 ml-auto tabular-nums">
                      {(lightboxIndex ?? 0) + 1} / {filteredImages.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
