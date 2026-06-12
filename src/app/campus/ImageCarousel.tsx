"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { galleryService, GalleryImage } from "../../../lib/supabase/services";
import { cn } from "@/lib/utils";

interface ImageProps {
  url: string;
  alt: string;
  blurDataURL?: string;
}

const DEFAULT_BLUR =
  "data:image/svg+xml;base64," +
  btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="30"><rect width="40" height="30" fill="#ecfdf5"/><circle cx="20" cy="15" r="8" fill="#86efac" opacity="0.6"/></svg>`);

function CarouselSlides({
  images,
  className,
}: {
  images: ImageProps[];
  className?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [firstLoaded, setFirstLoaded] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setCurrentIndex((i) => (i + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className={cn("flex items-center justify-center bg-gradient-to-br from-green-50 to-white", className)}>
        <p className="text-sm text-gray-500">No photos available</p>
      </div>
    );
  }

  const showSpinner = !firstLoaded;

  return (
    <div className={cn("relative overflow-hidden bg-gray-100", className)}>
      {showSpinner && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-white/95 via-green-50/95 to-white/95">
          <div className="hero-spinner scale-90" role="status" aria-label="Loading photos" />
        </div>
      )}
      {images.map((image, index) => {
        const isCurrent = index === currentIndex;
        const nextIndex = (currentIndex + 1) % images.length;
        const isPriority = isCurrent || index === nextIndex;

        return (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              isCurrent ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <Image
              src={image.url.startsWith("http") ? image.url : image.url.startsWith("/") ? image.url : `/${image.url}`}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={cn("object-cover", isCurrent && "hero-ken-burns")}
              priority={isPriority}
              placeholder="blur"
              blurDataURL={image.blurDataURL || DEFAULT_BLUR}
              onLoad={() => {
                if (index === 0) setFirstLoaded(true);
              }}
              onError={() => {
                if (index === 0) setFirstLoaded(true);
              }}
            />
          </div>
        );
      })}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent z-10 pointer-events-none" />
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const CampusImageCarousel = ({
  category,
  className,
}: {
  category: string;
  className?: string;
}) => {
  const [images, setImages] = useState<ImageProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const galleryImages: GalleryImage[] = await galleryService.getByCategory(category);
        setImages(
          galleryImages.map((image) => ({
            url: image.file_url,
            alt: image.alt_text || image.title || "Campus photo",
            blurDataURL: image.blur_url,
          }))
        );
      } catch {
        setImages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [category]);

  if (loading) {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-green-50 to-white", className)}>
        <div className="hero-spinner scale-90" role="status" />
        <p className="text-xs text-green-700/70 font-medium">Loading photos...</p>
      </div>
    );
  }

  return <CarouselSlides images={images} className={className} />;
};

export const GeneralImageCarousel = () => <CampusImageCarousel category="Other/General" className="h-64 w-full rounded-lg" />;

export default function ImageCarousel({ images }: { images: ImageProps[] }) {
  const processed = images.map((image) => ({
    ...image,
    url: image.url.startsWith("/") ? image.url : `/${image.url}`,
    blurDataURL: image.blurDataURL || DEFAULT_BLUR,
  }));
  return <CarouselSlides images={processed} className="h-64 w-full rounded-lg" />;
}
