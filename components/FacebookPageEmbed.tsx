'use client';

import { useEffect, useState } from 'react';
import FacebookFeedMock from './FacebookFeedMock';

interface FacebookPageEmbedProps {
  pageUrl: string;
  width?: number;
  height?: number;
}

/**
 * Facebook Page Embed Component
 *
 * ATTEMPTS TO USE FACEBOOK TIMELINE:
 * Facebook SDK loads fine, but the TIMELINE content often gets stuck
 * with an infinite spinner. This is a known Facebook issue when:
 * - Page has restrictions (age, country, etc.)
 * - Page isn't fully public
 * - Facebook's internal issues
 *
 * After 8 seconds, if timeline hasn't loaded, we show the mockup instead.
 */
export default function FacebookPageEmbed({
  pageUrl,
  width = 500,
  height = 600,
}: FacebookPageEmbedProps) {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Prevent SSR issues
    if (typeof window === 'undefined') return;

    // Timer: If timeline doesn't load in 8 seconds, show fallback
    // (SDK loads quickly, but timeline content often never appears)
    const timelineTimeout = setTimeout(() => {
      console.warn('Facebook timeline failed to load - showing fallback feed');
      setShowFallback(true);
    }, 8000);

    // Load Facebook SDK
    const loadFacebookSDK = () => {
      const script = document.createElement('script');
      script.src =
        'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';

      script.onload = () => {
        if ((window as any).FB) {
          (window as any).FB.XFBML.parse();
        }
      };

      script.onerror = () => {
        console.error('Facebook SDK failed to load');
        setShowFallback(true);
        clearTimeout(timelineTimeout);
      };

      document.body.appendChild(script);
    };

    // Check if SDK already exists
    if ((window as any).FB) {
      (window as any).FB.XFBML.parse();
    } else {
      loadFacebookSDK();
    }

    return () => {
      clearTimeout(timelineTimeout);
    };
  }, []);

  // Show fallback mockup
  if (showFallback) {
    return <FacebookFeedMock pageUrl={pageUrl} />;
  }

  return (
    <div className="flex justify-center w-full">
      <div className="relative">
        {/* Facebook Page Plugin - will show spinner if timeline fails */}
        <div id="fb-root"></div>
        <div
          className="fb-page"
          data-href={pageUrl}
          data-tabs="timeline"
          data-width={width}
          data-height={height}
          data-small-header="false"
          data-adapt-container-width="true"
          data-hide-cover="false"
          data-show-facepile="true"
        >
          <blockquote cite={pageUrl} className="fb-xfbml-parse-ignore">
            {/* Loading message while waiting */}
            <div
              className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg"
              style={{ width: `${width}px`, height: `${height}px` }}
            >
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
              <p className="text-gray-600 text-sm">
                Attempting to load Facebook timeline...
              </p>
              <p className="text-gray-500 text-xs mt-2">
                If this takes more than a few seconds, we'll show an alternative
                view
              </p>
            </div>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
