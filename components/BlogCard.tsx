'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User } from 'lucide-react';

interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  images?: string[];
  published_at?: string;
  created_at: string;
}

export default function BlogCard({
  id,
  title,
  content,
  images,
  published_at,
  created_at,
}: BlogCardProps) {
  const previewImage = images && images.length > 0 ? images[0] : '/logo.png';
  const displayDate = published_at || created_at;
  const formattedDate = new Date(displayDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Extract first 150 characters for preview
  const contentPreview =
    content.length > 150 ? content.substring(0, 150) + '...' : content;

  return (
    <Link href={`/blog/${id}`}>
      <article className="group bg-white border-2 border-primary rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 sm:h-56 md:h-64 bg-secondary overflow-hidden">
          <Image
            src={previewImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {images && images.length > 1 && (
            <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              {images.length} photos
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-grow flex flex-col">
          {/* Title */}
          <h2 className="text-2xl font-bold text-dark mb-3 group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {title}
          </h2>

          {/* Preview Content */}
          <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
            {contentPreview}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span>Admin</span>
            </div>
          </div>
        </div>

        {/* Decorative hover bar */}
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      </article>
    </Link>
  );
}
