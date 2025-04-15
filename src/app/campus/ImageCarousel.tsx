"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface ImageProps {
  url: string;
  alt: string;
}

const ImageCarousel = ({ images }: { images: ImageProps[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [images.length]);

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
            src={image.url.startsWith("/") ? image.url : `/${image.url}`} // Ensure starting with /
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

export default ImageCarousel;
