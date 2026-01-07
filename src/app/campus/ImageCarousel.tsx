"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { galleryService, GalleryImage } from "../../../lib/supabase/services";

interface ImageProps {
  url: string;
  alt: string;
  blurDataURL?: string;
}

// Legacy component for backward compatibility - accepts images as props
const ImageCarousel = ({ images }: { images: ImageProps[] }) => {
  // Process images to ensure correct URL format
  const processedImages = images.map(image => ({
    ...image,
    url: image.url.startsWith("/") ? image.url : `/${image.url}`,
    blurDataURL: image.blurDataURL || `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="30" viewBox="0 0 50 30">
        <rect width="50" height="30" fill="#e2e8f0"/>
        <circle cx="25" cy="15" r="10" fill="#94a3b8" opacity="0.5"/>
      </svg>
    `)}`
  }));

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (processedImages.length <= 1) return; // Don't auto-rotate if there's only one or no images
    
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % processedImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [processedImages.length]);

  // Preload images - optimized for faster loading
  useEffect(() => {
    if (processedImages.length > 0) {
      // Preload the first image immediately since it's priority
      if (processedImages[0]) {
        const preloadFirstImage = new window.Image();
        preloadFirstImage.src = processedImages[0].url;
      }
      
      // Preload next few images that will be displayed
      const preloadCount = Math.min(3, processedImages.length); // Preload first 3 images
      for (let i = 1; i < preloadCount; i++) {
        if (processedImages[i]) {
          const preloadImage = new window.Image();
          preloadImage.src = processedImages[i].url;
        }
      }
    }
  }, [processedImages.length]);

  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md">
      {processedImages.map((image, index) => {
        // Determine if this image should have priority
        // Priority for current image and the next one to be shown
        const nextIndex = (currentIndex + 1) % processedImages.length;
        const isPriority = index === currentIndex || index === nextIndex;
        
        return (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="100vw"
              className="object-cover w-full h-full"
              priority={isPriority}
              placeholder="blur"
              blurDataURL={image.blurDataURL}
              loading="eager"
            />
          </div>
        )
      })}
    </div>
  );
};

// Campus-specific image carousel component
export const CampusImageCarousel = ({ category }: { category: string }) => {
  const [images, setImages] = useState<ImageProps[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const galleryImages: GalleryImage[] = await galleryService.getByCategory(category);
        
        // Convert gallery images to the format expected by the carousel
        const formattedImages = galleryImages.map(image => ({
          url: image.file_url,
          alt: image.alt_text || image.title || 'Gallery image',
          blurDataURL: image.blur_url || `data:image/svg+xml;base64,${btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="30" viewBox="0 0 50 30">
              <rect width="50" height="30" fill="#e2e8f0"/>
              <circle cx="25" cy="15" r="10" fill="#94a3b8" opacity="0.5"/>
            </svg>
          `)}`
        }));
        
        setImages(formattedImages);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching images for category ${category}:`, err);
        setError('Failed to load images');
        setLoading(false);
      }
    };

    fetchImages();
  }, [category]);

  // Preload images - optimized for faster loading
  useEffect(() => {
    if (images.length > 0) {
      // Preload the first image immediately since it's priority
      if (images[0]) {
        const preloadFirstImage = new window.Image();
        preloadFirstImage.src = images[0].url;
      }
      
      // Preload next few images that will be displayed
      const preloadCount = Math.min(3, images.length); // Preload first 3 images
      for (let i = 1; i < preloadCount; i++) {
        if (images[i]) {
          const preloadImage = new window.Image();
          preloadImage.src = images[i].url;
        }
      }
    }
  }, [images]);

  useEffect(() => {
    if (images.length <= 1) return; // Don't auto-rotate if there's only one or no images

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [images.length]);

  if (loading) return <div className="w-full h-64 flex items-center justify-center">Loading images...</div>;
  if (error) return <div className="w-full h-64 flex items-center justify-center">Error: {error}</div>;
  if (images.length === 0) return <div className="w-full h-64 flex items-center justify-center">No images available</div>;

  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md">
      {images.map((image, index) => {
        // Determine if this image should have priority
        // Priority for current image and the next one to be shown
        const nextIndex = (currentIndex + 1) % images.length;
        const isPriority = index === currentIndex || index === nextIndex;
        
        return (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={image.url.startsWith('http') ? image.url : image.url.startsWith('/') ? image.url : `/${image.url}`} // Ensure starting with /
              alt={image.alt}
              fill // replaces layout="fill"
              sizes="100vw"
              className="object-cover w-full h-full"
              priority={isPriority} // Load current and next image with priority
              placeholder="blur"
              blurDataURL={image.blurDataURL}
              loading="eager"
            />
          </div>
        )
      })}
    </div>
  );
};

// New component that fetches images from the "Other/General" category
export const GeneralImageCarousel = () => {
  return <CampusImageCarousel category="Other/General" />;
};

export default ImageCarousel;