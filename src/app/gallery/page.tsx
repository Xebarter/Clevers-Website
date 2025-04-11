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
  image: {
    asset: {
      _id: string;
      url: string;
    };
  };
  category: string;
  date: string;
  description?: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const query = `*[_type == "galleryImage"] | order(date desc) {
          _id,
          title,
          image {
            asset->{
              _id,
              url
            }
          },
          category,
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
  const filteredImages =
    activeTab === 'all' ? images : images.filter((img) => img.category === activeTab);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading gallery images...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">School Gallery</h1>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {filteredImages.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No images found in this category</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <div
                  key={image._id}
                  className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => setPreviewImage(image)}
                >
                  {image.image?.asset?.url ? (
                    <Image
                      src={image.image.asset.url}
                      alt={image.title || 'Gallery image'}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={false}
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-64 flex items-center justify-center text-sm text-gray-500">
                      No image available
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-semibold">{image.title}</h3>
                    {image.description && (
                      <p className="text-white/80 text-sm mt-1">{image.description}</p>
                    )}
                    <p className="text-white/60 text-xs mt-2">{formatDate(image.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal for Preview */}
      <Dialog open={!!previewImage} onClose={() => setPreviewImage(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative bg-white max-w-3xl w-full rounded-lg overflow-hidden shadow-lg">
            {previewImage && (
              <>
                <div className="relative w-full h-[500px] bg-black">
                  <Image
                    src={previewImage.image.asset.url}
                    alt={previewImage.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h2 className="text-xl font-semibold">{previewImage.title}</h2>
                  {previewImage.description && (
                    <p className="text-gray-700">{previewImage.description}</p>
                  )}
                  <p className="text-sm text-gray-500">{formatDate(previewImage.date)}</p>
                </div>
                <button
                  className="absolute top-4 right-4 text-white bg-black/70 p-1.5 rounded-full hover:bg-black"
                  onClick={() => setPreviewImage(null)}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
