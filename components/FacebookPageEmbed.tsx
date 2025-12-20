'use client';

import { useEffect } from 'react';

interface FacebookPageEmbedProps {
  pageUrl: string;
  width?: number;
  height?: number;
  showPosts?: boolean;
  showCover?: boolean;
  hideCTA?: boolean;
}

declare global {
  interface Window {
    FB?: any;
  }
}

export default function FacebookPageEmbed({
  pageUrl,
  width = 340,
  height = 500,
  showPosts = true,
  showCover = true,
  hideCTA = false,
}: FacebookPageEmbedProps) {
  useEffect(() => {
    // Load Facebook SDK if not already loaded
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, [pageUrl]);

  return (
    <div className="facebook-embed-container">
      <div
        className="fb-page"
        data-href={pageUrl}
        data-width={width}
        data-height={height}
        data-tabs={showPosts ? 'timeline' : ''}
        data-hide-cover={!showCover}
        data-show-facepile="true"
        data-hide-cta={hideCTA}
        data-small-header="false"
        data-adapt-container-width="true"
      >
        <blockquote cite={pageUrl} className="fb-xfbml-parse-ignore">
          <a href={pageUrl}>Loading Facebook Page...</a>
        </blockquote>
      </div>
    </div>
  );
}
