import FacebookPageEmbed from '@/components/FacebookPageEmbed';
import LinkTree from '@/components/LinkTree';

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">
          Welcome to High Noon Optimist Club
        </h1>

        {/* LinkTree Component */}
        <LinkTree />

        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Find us on Facebook!
          </h2>
          <FacebookPageEmbed
            pageUrl="https://www.facebook.com/p/High-Noon-Optimist-Club-Regina-100064661350870/"
            width={500}
            height={600}
            showPosts={true}
            showCover={true}
          />
        </div>
      </div>
    </div>
  );
}
