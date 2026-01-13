'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  images: string[];
  initialIndex?: number;
}

export default function GalleryViewer({
  isOpen,
  onClose,
  title,
  images,
  initialIndex = 0,
}: GalleryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const goToPrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      if (isFullscreen) {
        setIsFullscreen(false);
      } else {
        onClose();
      }
    }
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, images.length]);

  // Scroll to current image when index changes
  useEffect(() => {
    if (scrollContainerRef.current && !isFullscreen && isOpen) {
      isScrollingRef.current = true;
      const container = scrollContainerRef.current;
      const imageWidth = container.offsetWidth;
      container.scrollTo({
        left: currentIndex * imageWidth,
        behavior: 'smooth',
      });
      
      // Reset scrolling flag after animation
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
    }
  }, [currentIndex, isFullscreen, isOpen]);

  if (!isOpen) return null;

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        {/* Close Fullscreen */}
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
          aria-label="Exit fullscreen"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-50"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-50"
              aria-label="Next image"
            >
              <ChevronRight className="w-12 h-12" />
            </button>
          </>
        )}

        {/* Fullscreen Image */}
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-7xl">
            <Image
              src={images[currentIndex]}
              alt={`${title} - ${currentIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
        <div className="flex-1">
          <h2 className="text-white font-semibold text-lg truncate">{title}</h2>
          <p className="text-white/70 text-sm">
            {currentIndex + 1} of {images.length}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 transition-colors ml-4"
          aria-label="Close gallery"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      {/* iPhone-style Scrolling Gallery */}
      <div className="flex-1 relative overflow-hidden">
        {/* Main Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory h-full scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
          onScroll={(e) => {
            if (isScrollingRef.current) return;
            const container = e.currentTarget;
            const scrollLeft = container.scrollLeft;
            const imageWidth = container.offsetWidth;
            const newIndex = Math.round(scrollLeft / imageWidth);
            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
              setCurrentIndex(newIndex);
            }
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full snap-center flex items-center justify-center p-4"
              onClick={() => setIsFullscreen(true)}
            >
              <div className="relative w-full h-full max-w-4xl cursor-pointer">
                <Image
                  src={image}
                  alt={`${title} - ${index + 1}`}
                  fill
                  className="object-contain"
                  priority={index === currentIndex}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows for Desktop */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/30 backdrop-blur-sm rounded-full p-3"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={goToNext}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/30 backdrop-blur-sm rounded-full p-3"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* Subtle Caption */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-2xl p-4 text-white">
          <p className="text-sm">
            Tap image for fullscreen • Swipe to navigate
          </p>
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="bg-black/50 backdrop-blur-sm p-4 overflow-x-auto">
          <div className="flex gap-2 justify-center">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                  index === currentIndex
                    ? 'ring-2 ring-white scale-110'
                    : 'opacity-50 hover:opacity-100'
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
