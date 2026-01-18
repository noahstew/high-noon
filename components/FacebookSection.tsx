'use client';

import dynamic from 'next/dynamic';

const FacebookPageEmbed = dynamic(() => import('./FacebookPageEmbed'), {
  ssr: false,
  loading: () => (
    <div
      className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg"
      style={{ width: '500px', height: '500px' }}
    >
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
      <p className="text-gray-600 text-sm">Loading Facebook feed...</p>
    </div>
  ),
});

export default function FacebookSection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-4xl font-bold text-dark mb-4">
          Connect with us on Facebook
        </h2>
        <div className="w-24 h-1 bg-primary mb-8"></div>
        <div className="flex justify-center">
          <FacebookPageEmbed
            pageUrl="https://www.facebook.com/p/High-Noon-Optimist-Club-Regina-100064661350870/"
            width={500}
            height={500}
          />
        </div>
      </div>
    </section>
  );
}
