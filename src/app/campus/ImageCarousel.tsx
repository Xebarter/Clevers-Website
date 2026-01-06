"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { galleryService, GalleryImage } from "../../../lib/supabase/services";

interface ImageProps {
  url: string;
  alt: string;
}

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
          alt: image.alt_text || image.title || 'Gallery image'
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

  useEffect(() => {
    if (images.length === 0) return;

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
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={image.url.startsWith('http') ? image.url : image.url.startsWith('/') ? image.url : `/${image.url}`}
            alt={image.alt}
            fill // replaces layout="fill"
            sizes="100vw"
            className="object-cover w-full h-full"
            priority={index === 0} // Load first image with priority
          />
        </div>
      ))}
    </div>
  );
};

// Legacy component for backward compatibility - accepts images as props
const ImageCarousel = ({ images }: { images: ImageProps[] }) => {
  // Process images to ensure correct URL format
  const processedImages = images.map(image => ({
    ...image,
    url: image.url.startsWith("/") ? image.url : `/${image.url}`
  }));

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % processedImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [processedImages.length]);

  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md">
      {processedImages.map((image, index) => (
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
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
};

// New component that fetches images from the "Other/General" category
export const GeneralImageCarousel = () => {
  return <CampusImageCarousel category="Other/General" />;
};

export default ImageCarousel;