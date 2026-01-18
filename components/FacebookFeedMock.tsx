'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

interface FacebookFeedMockProps {
  pageUrl: string;
  screenshotPath?: string;
}

export default function FacebookFeedMock({
  pageUrl,
  screenshotPath = '/facebook.png',
}: FacebookFeedMockProps) {
  return (
    <Link
      href={pageUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block max-w-xl mx-auto group cursor-pointer"
    >
      <div className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-300 group-hover:border-primary bg-white">
        {/* Facebook Header */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3">
            <svg
              className="w-10 h-10"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="18" cy="18" r="18" fill="#1877F2" />
              <path
                d="M25.6389 23.2031L26.3499 18.3919H21.7274V15.2666C21.7274 13.9434 22.3828 12.6522 24.4834 12.6522H26.5406V8.5791C26.5406 8.5791 24.6055 8.25 22.7547 8.25C18.901 8.25 16.3745 10.5987 16.3745 14.7203V18.3919H12.1548V23.2031H16.3745V34.8116C17.2619 34.9361 18.1696 35 19.0909 35C20.0122 35 20.9199 34.9361 21.8073 34.8116V23.2031H25.6389Z"
                fill="white"
              />
            </svg>
          </div>
          <div className="md:hidden flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
            <span className="text-primary text-sm font-semibold">
              Click to View
            </span>
            <ExternalLink className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Screenshot Image */}
        <div className="relative w-full bg-gray-50">
          <Image
            src={screenshotPath}
            alt="Facebook page preview"
            width={500}
            height={600}
            className="w-full h-auto block"
            priority
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full px-6 py-3 shadow-xl">
              <span className="text-primary font-bold">View on Facebook →</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
