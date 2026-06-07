import LinkTree from '@/components/LinkTree';

export const metadata = {
  title: 'Community Partners | High Noon Optimist Club',
  description:
    'Discover the community partners and local collaborations that support the High Noon Optimist Club in Regina.',
};

export default function CommunityPage() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-4xl font-bold text-dark mb-4">
          Community Partners
        </h2>
        <div className="w-24 h-1 bg-primary mb-12"></div>
        <LinkTree />
      </div>
    </section>
  );
}
