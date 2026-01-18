interface FacebookPageEmbedProps {
  pageUrl: string;
  width?: number;
  height?: number;
}

export default function FacebookPageEmbed({
  pageUrl,
  width = 500,
  height = 700,
}: FacebookPageEmbedProps) {
  // Encode the URL for the iframe src
  const encodedUrl = encodeURIComponent(pageUrl);
  const iframeSrc = `https://www.facebook.com/plugins/page.php?href=${encodedUrl}&tabs=timeline&width=${width}&height=${height}&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`;

  return (
    <div className="flex justify-center items-center w-full my-8">
      <iframe
        src={iframeSrc}
        width={width}
        height={height}
        style={{ border: 'none', overflow: 'hidden' }}
        scrolling="no"
        frameBorder="0"
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      />
    </div>
  );
}
