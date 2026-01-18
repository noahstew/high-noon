'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ExternalLink, Copy, Check } from 'lucide-react';

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
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto mb-12">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <div className="space-y-4">
        {links.map((link) => (
          <div
            key={link.id}
            className="group relative bg-white border-2 border-primary rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className="flex items-center p-4 gap-4">
              {/* Image */}
              {link.image_url && (
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
                  <Image
                    src={link.image_url}
                    alt={link.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Title */}
              <div className="flex-grow min-w-0">
                <h3 className="text-lg font-semibold text-dark truncate">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-600 truncate">{link.url}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Copy Button */}
                <button
                  onClick={() => copyToClipboard(link.url, link.id)}
                  className="p-2 rounded-lg bg-secondary transition-opacity duration-200 hover:opacity-80"
                  title="Copy link"
                  aria-label="Copy link to clipboard"
                >
                  {copiedId === link.id ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : (
                    <Copy className="w-5 h-5 text-primary" />
                  )}
                </button>

                {/* Open in New Tab Button */}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-primary hover:bg-dark transition-colors duration-200"
                  title="Open in new tab"
                  aria-label="Open link in new tab"
                >
                  <ExternalLink className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>

            {/* Decorative accent bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
