'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { galleryService, GalleryImage } from '../../../lib/supabase/services';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogBackdrop } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const [currentImage, setCurrentImage] = useState<GalleryImage | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const data = await galleryService.getAll();
        setImages(data);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  // Define campus categories
  const campuses = ['Kitintale', 'Kasokoso', 'Maganjo'];
  
  // Filter images by campus if active tab is a campus, otherwise show all
  const filteredImages = images.filter((img) => {
    if (activeTab === 'all') return true;
    if (campuses.includes(activeTab)) {
      return img.category && img.category.toLowerCase().includes(activeTab.toLowerCase());
    }
    // For other categories
    return img.category === activeTab;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleImageClick = (image: GalleryImage) => {
    setCurrentImage(image);
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tl from-yellow-50 via-pink-50 to-blue-50 text-gray-800">
      {/* Hero Section - Matching home page theme */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-pink-100 via-yellow-100 to-green-100 text-gray-800 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 bg-clip-text text-transparent">
                Photo Gallery
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-yellow-300 to-green-400 rounded-full"></span>
            </span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-gray-700 mb-8">
            Explore our collection of memorable moments from events, activities, and campus life
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/apply">
              <Button size="lg" variant="outline" className="border-pink-400 text-pink-600 hover:bg-pink-50 px-6 py-3 gap-2">
                Apply Now <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-12 bg-white shadow-md rounded-xl p-2">
              <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-green-500 data-[state=active]:text-white">All Photos</TabsTrigger>
              {campuses.map((campus) => (
                <TabsTrigger key={campus} value={campus} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-green-500 data-[state=active]:text-white">
                  {campus}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                  <p className="mt-4 text-lg text-gray-600">Loading gallery images...</p>
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600">No images found in the gallery</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredImages.map((img) => (
                    <div 
                      key={img.id} 
                      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100"
                      onClick={() => handleImageClick(img)}
                    >
                      <div className="aspect-square overflow-hidden">
                        <Image
                          src={img.file_url}
                          alt={img.alt_text || img.title}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <h3 className="text-white font-bold text-lg">{img.title}</h3>
                        {img.caption && (
                          <p className="text-white/80 text-sm mt-1 line-clamp-2">{img.caption}</p>
                        )}
                        {img.category && (
                          <p className="text-white/60 text-xs mt-2 uppercase tracking-wider">{img.category}</p>
                        )}
                        <p className="text-white/60 text-xs mt-1">{formatDate(img.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Campus tabs */}
            {campuses.map((campus) => (
              <TabsContent key={campus} value={campus} className="space-y-8">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading gallery images...</p>
                  </div>
                ) : filteredImages.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-xl text-gray-600">No images found for {campus} campus</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredImages.map((img) => (
                      <div 
                        key={img.id} 
                        className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100"
                        onClick={() => handleImageClick(img)}
                      >
                        <div className="aspect-square overflow-hidden">
                          <Image
                            src={img.file_url}
                            alt={img.alt_text || img.title}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <h3 className="text-white font-bold text-lg">{img.title}</h3>
                          {img.caption && (
                            <p className="text-white/80 text-sm mt-1 line-clamp-2">{img.caption}</p>
                          )}
                          <p className="text-white/60 text-xs mt-2 uppercase tracking-wider">{img.category}</p>
                          <p className="text-white/60 text-xs mt-1">{formatDate(img.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Image Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/70" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg z-10"
            >
              <XMarkIcon className="h-6 w-6 text-gray-800" />
            </button>
            
            {currentImage && (
              <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
                <div className="relative aspect-video">
                  <Image
                    src={currentImage.file_url}
                    alt={currentImage.alt_text || currentImage.title}
                    fill
                    className="object-contain"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{currentImage.title}</h3>
                  {currentImage.caption && (
                    <p className="text-gray-700 mb-2">{currentImage.caption}</p>
                  )}
                  {currentImage.category && (
                    <span className="inline-block bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm mb-3">
                      {currentImage.category}
                    </span>
                  )}
                  <p className="text-gray-500 text-sm">{formatDate(currentImage.created_at)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}