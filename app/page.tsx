import FacebookPageEmbed from '@/components/FacebookPageEmbed';

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">
          Welcome to High Noon Optimist Club
        </h1>

        <div className="flex justify-center">
          <FacebookPageEmbed
            pageUrl="https://www.facebook.com/profile.php?id=100064661350870"
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
