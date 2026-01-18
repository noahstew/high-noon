import FacebookPageEmbed from '@/components/FacebookPageEmbed';
import LinkTree from '@/components/LinkTree';
import BlogCard from '@/components/BlogCard';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, Users, Heart } from 'lucide-react';

export const revalidate = 60; // Revalidate every 60 seconds

async function getLatestBlogPost() {
  try {
    const { data: posts, error } = await supabase
      .from('blog_post')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching latest blog post:', error);
      return null;
    }

    return posts && posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export default async function Home() {
  const latestPost = await getLatestBlogPost();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[700px] bg-primary overflow-hidden">
        <Image
          src="/group2.jpg"
          alt="High Noon Optimist Club"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/40 to-dark/70"></div>
        <div className="relative max-w-7xl mx-auto px-8 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 max-w-4xl leading-tight">
            High Noon Optimist Club
          </h1>
          <p className="text-xl md:text-2xl text-secondary mb-8 max-w-3xl">
            Bringing out the best in youth, our community, and ourselves
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-primary hover:bg-secondary hover:text-dark px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
            >
              Get Involved
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="bg-transparent hover:bg-white/10 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 backdrop-blur-sm border-2 border-white"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">
                Community Focus
              </h3>
              <p className="text-gray-700">
                Dedicated to making a positive impact in Regina and beyond
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">
                Youth Empowerment
              </h3>
              <p className="text-gray-700">
                Supporting and inspiring the next generation of leaders
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">
                Active Events
              </h3>
              <p className="text-gray-700">
                Regular programs and activities that strengthen our community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-dark mb-4">Quick Links</h2>
          <div className="w-24 h-1 bg-primary mb-12"></div>
          <LinkTree />
        </div>
      </section>

      {/* Latest Blog Post Section */}
      {latestPost && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-4xl font-bold text-dark mb-4">
                  Latest from our blog
                </h2>
                <div className="w-24 h-1 bg-primary"></div>
              </div>
              <Link
                href="/blog"
                className="text-primary hover:text-primary/80 font-semibold flex items-center gap-2 transition-colors"
              >
                View All Posts
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="max-w-4xl">
              <BlogCard
                id={latestPost.id}
                title={latestPost.title}
                content={latestPost.content}
                images={latestPost.images}
                published_at={latestPost.published_at}
                created_at={latestPost.created_at}
              />
            </div>
          </div>
        </section>
      )}

      {/* Facebook Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-dark mb-4">
            Connect with us on Facebook
          </h2>
          <div className="w-24 h-1 bg-primary mb-12"></div>
          <div className="flex justify-center">
            <FacebookPageEmbed
              pageUrl="https://www.facebook.com/p/High-Noon-Optimist-Club-Regina-100064661350870/"
              width={500}
              height={700}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
