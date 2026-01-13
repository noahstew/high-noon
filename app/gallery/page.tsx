'use client';

import { useState, useEffect } from 'react';
import GalleryCard from '@/components/GalleryCard';
import GalleryViewer from '@/components/GalleryViewer';

interface GalleryItem {
  id: string;
  title: string;
  images: string[];
  created_at: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(
    null
  );

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-8 text-center">
            Gallery
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 rounded-2xl h-80"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-8 text-center">
            Gallery
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No gallery items yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <GalleryCard
                  key={item.id}
                  {...item}
                  onOpen={() => setSelectedGallery(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Gallery Viewer Modal */}
      {selectedGallery && (
        <GalleryViewer
          isOpen={true}
          onClose={() => setSelectedGallery(null)}
          title={selectedGallery.title}
          images={selectedGallery.images}
        />
      )}
    </>
  );
}
