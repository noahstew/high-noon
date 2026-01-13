'use client';

import Image from 'next/image';
import { useState } from 'react';

interface GalleryCardProps {
  id: string;
  title: string;
  images: string[];
  created_at: string;
  onOpen: () => void;
}

export default function GalleryCard({
  title,
  images,
  created_at,
  onOpen,
}: GalleryCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const coverImage = images && images.length > 0 ? images[0] : '/logo.png';
  const imageCount = images?.length || 0;

  const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      onClick={onOpen}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-64 sm:h-72 md:h-80 bg-secondary overflow-hidden">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Photo Count Badge */}
        {imageCount > 1 && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
            {imageCount} photos
          </div>
        )}
      </div>

      {/* Caption Overlay - Subtle, iPhone-style */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <h3 className="text-white font-semibold text-lg mb-1 truncate">
          {title}
        </h3>
        <p className="text-white/70 text-sm">{formattedDate}</p>
      </div>

      {/* Hover Indicator */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 text-primary font-semibold shadow-lg">
          View Gallery
        </div>
      </div>
    </div>
  );
}
