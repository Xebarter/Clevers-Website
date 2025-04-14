'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface GalleryImage {
  _id: string;
  title: string;
  images?: {
    asset: {
      _id: string;
      url: string;
    };
  }[];
  category: string;
  location: string;
  date: string;
  description?: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [activeCampus, setActiveCampus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const [currentGallery, setCurrentGallery] = useState<GalleryImage | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const query = `*[_type == "galleryImage"] | order(date desc) {
          _id,
          title,
          images[] {
            asset->{
              _id,
              url
            }
          },
          category,
          location,
          date,
          description
        }`;
        const data = await client.fetch(query);
        setImages(data);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  const categories = Array.from(new Set(images.map((img) => img.category)));
  const campuses = ['kitintale', 'kasokoso', 'maganjo'];

  const filteredImages = images.filter((img) => {
    const matchesCategory = activeTab === 'all' || img.category === activeTab;
    const matchesCampus = activeCampus === 'all' || img.location === activeCampus;
    return matchesCategory && matchesCampus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const campusColors: Record<string, string> = {
    kitintale: 'bg-blue-400 text-white hover:bg-blue-500',
    kasokoso: 'bg-pink-400 text-white hover:bg-pink-500',
    maganjo: 'bg-lime-400 text-white hover:bg-lime-500',
  };

  const currentImage = currentGallery?.images?.[currentImageIndex];

  const handleNext = () => {
    if (
      currentGallery &&
      currentGallery.images &&
      currentImageIndex < currentGallery.images.length - 1
    ) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading gallery images...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <h1 className="text-2xl font-extrabold text-center text-pink-600 mb-2 sm:text-3xl sm:mb-3 lg:text-4xl lg:mb-4">
        🎉 School Gallery
      </h1>
      <p className="text-center text-gray-600 text-sm mb-6 max-w-md mx-auto sm:text-base sm:mb-8 lg:max-w-2xl">
        Explore joyful moments, events, and everyday fun across our campuses.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-wrap justify-center gap-2 mb-4 sm:gap-3 sm:mb-6 lg:gap-4">
          <TabsTrigger
            value="all"
            className="px-3 py-1.5 text-xs rounded-full bg-purple-500 text-white hover:bg-purple-600 sm:px-4 sm:py-2 sm:text-sm lg:text-base"
          >
            All Categories
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="px-3 py-1.5 text-xs rounded-full bg-teal-400 text-white hover:bg-teal-500 sm:px-4 sm:py-2 sm:text-sm lg:text-base"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {['all', ...categories].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-0">
            <div className="mt-6 mb-4 sm:mt-8 sm:mb-6 lg:mt-10 lg:mb-8">
              <h2 className="text-sm font-semibold mb-2 text-center sm:text-base lg:text-lg">
                Filter by Campus
              </h2>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
                <button
                  className={`px-3 py-1.5 text-xs rounded-full ${
                    activeCampus === 'all'
                      ? 'bg-orange-500 text-white'
                      : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                  } min-w-[90px] sm:px-4 sm:py-2 sm:text-sm sm:min-w-[100px] lg:text-base`}
                  onClick={() => setActiveCampus('all')}
                >
                  All Campuses
                </button>
                {campuses.map((campus) => (
                  <button
                    key={campus}
                    className={`px-3 py-1.5 text-xs rounded-full transition ${
                      activeCampus === campus
                        ? campusColors[campus]
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } min-w-[90px] sm:px-4 sm:py-2 sm:text-sm sm:min-w-[100px] lg:text-base`}
                    onClick={() => setActiveCampus(campus)}
                  >
                    {campus.charAt(0).toUpperCase() + campus.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {filteredImages.length === 0 ? (
              <p className="text-center text-gray-500 py-6 text-xs sm:text-sm lg:text-base">
                No images found for this category and campus
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {filteredImages.map((gallery) =>
                  gallery.images?.length ? (
                    gallery.images.map((image, index) => (
                      <div
                        key={`${gallery._id}-${index}`}
                        className="group relative overflow-hidden rounded-2xl border border-yellow-100 shadow-md hover:shadow-2xl hover:border-pink-200 transition-all duration-300 cursor-pointer"
                        onClick={() => {
                          setCurrentGallery(gallery);
                          setCurrentImageIndex(index);
                        }}
                      >
                        <Image
                          src={image.asset.url}
                          alt={gallery.title || 'Gallery image'}
                          width={400}
                          height={300}
                          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105 sm:h-64"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-pink-800/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 sm:p-3 lg:p-4">
                          <h3 className="text-white font-semibold text-xs sm:text-sm lg:text-base">
                            {gallery.title}
                          </h3>
                          {gallery.description && (
                            <p className="text-white/80 text-xs mt-1 line-clamp-2 sm:text-sm lg:text-base">
                              {gallery.description}
                            </p>
                          )}
                          <p className="text-white/60 text-xs mt-1 sm:mt-2 lg:text-sm">
                            {formatDate(gallery.date)}
                          </p>
                          <p className="text-white/60 text-xs capitalize sm:text-sm lg:text-sm">
                            {gallery.location}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      key={gallery._id}
                      className="bg-gray-200 w-full h-40 flex items-center justify-center text-xs text-gray-500 rounded-xl sm:h-64 lg:h-64"
                    >
                      No images available
                    </div>
                  )
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Modal Preview */}
      <Dialog open={!!currentGallery} onClose={() => setCurrentGallery(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 lg:p-6">
          <Dialog.Panel className="relative bg-white w-full max-w-[95vw] rounded-lg shadow-lg max-h-[90vh] overflow-y-auto sm:max-w-4xl">
            {currentImage && (
              <>
                <div className="relative w-full h-[60vh] bg-black sm:h-[70vh] lg:h-[75vh]">
                  <Image
                    src={currentImage.asset.url}
                    alt={currentGallery?.title || 'Gallery image'}
                    fill
                    className="object-contain"
                  />
                  {currentImageIndex > 0 && (
                    <button
                      onClick={handlePrevious}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black/50 p-2 rounded-full hover:bg-black"
                    >
                      ‹
                    </button>
                  )}
                  {currentGallery.images && currentImageIndex < currentGallery.images.length - 1 && (
                    <button
                      onClick={handleNext}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black/50 p-2 rounded-full hover:bg-black"
                    >
                      ›
                    </button>
                  )}
                </div>
                <div className="p-3 space-y-2 sm:p-4 sm:space-y-3 lg:p-6 lg:space-y-4">
                  <h2 className="text-base font-semibold sm:text-lg lg:text-xl">
                    {currentGallery?.title}
                  </h2>
                  {currentGallery?.description && (
                    <p className="text-gray-700 text-xs sm:text-sm lg:text-base">
                      {currentGallery.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 sm:text-sm lg:text-base">
                    {formatDate(currentGallery?.date || '')}
                  </p>
                </div>
                <button
                  className="absolute top-2 right-2 text-white bg-black/70 p-1 rounded-full hover:bg-black sm:top-4 sm:right-4 sm:p-2"
                  onClick={() => setCurrentGallery(null)}
                >
                  <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
