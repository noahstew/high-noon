'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Link {
  id: string;
  title: string;
  url: string;
  image_url?: string;
  sort_order: number;
}

export default function LinkTree() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links');
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="animate-pulse h-64 bg-gray-200 rounded-xl"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-white border-2 border-primary rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Card Container */}
            <div className="relative w-full h-64 bg-white flex items-center justify-center">
              {link.image_url ? (
                <Image
                  src={link.image_url}
                  alt={link.title}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="text-gray-400">No image</div>
              )}
            </div>

            {/* Title Section */}
            <div className="bg-white border-t-2 border-primary px-4 py-3">
              <h3 className="text-lg font-semibold text-primary truncate">
                {link.title}
              </h3>
              <p className="text-xs text-gray-600 truncate">{link.url}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
