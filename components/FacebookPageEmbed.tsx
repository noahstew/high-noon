'use client';

interface FacebookPageEmbedProps {
  pageUrl: string;
  width?: number;
  height?: number;
  showPosts?: boolean;
  showCover?: boolean;
  hideCTA?: boolean;
}

export default function FacebookPageEmbed({
  pageUrl,
  width = 340,
  height = 500,
  showPosts = true,
  showCover = true,
}: FacebookPageEmbedProps) {
  return (
    <div
      className="relative"
      style={{ width: `${width}px`, height: `${height}px`, margin: '0 auto' }}
    >
      <iframe
        src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
          pageUrl
        )}&tabs=timeline&width=${width}&height=${height}&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
        width={width}
        height={height}
        style={{ border: 'none', overflow: 'hidden' }}
        scrolling="no"
        frameBorder="0"
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        loading="lazy"
      />
    </div>
  );
}
