import LinkTree from '@/components/LinkTree';
import BlogCard from '@/components/BlogCard';
import FacebookSection from '@/components/FacebookSection';
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
      <section className="relative overflow-hidden bg-gradient-to-b from-primary via-primary to-secondary">
        <div className="relative max-w-7xl mx-auto px-8 py-16">
          <div className="flex flex-col items-center text-center gap-12">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white max-w-4xl mx-auto leading-tight">
                High Noon Optimist Club
              </h1>
              <p className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto">
                Bringing out the best in youth, our community, and ourselves
              </p>
            </div>

            <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-3xl shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-primary/40 pointer-events-none" />
              <Image
                src="/banner.jpg"
                alt="High Noon Optimist Club"
                width={1920}
                height={1080}
                className="w-full h-auto object-contain object-center"
                priority
              />
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-primary hover:bg-secondary hover:text-dark px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
              >
                Get Involved
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/about"
                className="bg-transparent hover:bg-white/10 text-white px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 backdrop-blur-sm border-2 border-white"
              >
                Learn More
              </Link>
            </div>
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
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl text-center font-bold text-white mb-4">
            The Optimist Creed
          </h2>
          <div className="mx-auto my-6 h-px w-24 bg-white/80"></div>
          <h4 className="text-2xl text-center text-secondary font-semibold">
            Promote Yourself
          </h4>
          <div className="text-gray-200 text-lg text-center mt-4 max-w-3xl mx-auto space-y-3">
            <p>To be so strong that nothing can disturb your peace of mind.</p>
            <p>
              To talk health, happiness and prosperity to every person you meet.
            </p>
            <p>
              To make all your friends feel that there is something in them.
            </p>
            <p>
              To look at the sunny side of everything and make your optimism
              come true.
            </p>
            <p>
              To think only of the best, to work only for the best, and to
              expect only the best.
            </p>
            <p>
              To be just as enthusiastic about the success of others as you are
              about your own.
            </p>
            <p>
              To forget the mistakes of the past and press on to the greater
              achievements of the future.
            </p>
            <p>
              To wear a cheerful countenance at all times and give every living
              creature you meet a smile.
            </p>
            <p>
              To give so much time to the improvement of yourself that you have
              no time to criticize others.
            </p>
            <p>
              To be too large for worry, too noble for anger, too strong for
              fear, and too happy to permit the presence of trouble.
            </p>
          </div>
        </div>
      </section>

      {/* Embedded Google Calendar */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center mb-4">
            <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mr-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-dark">Events Calendar</h2>
          </div>
          <div className="w-24 h-1 bg-primary mb-12"></div>
          <div className="flex justify-center">
            <iframe
              src="https://calendar.google.com/calendar/embed?src=c5057ac7c3f6d2074a3a21a2a8449fdba71182aff6755a2559f13c7cd684db94%40group.calendar.google.com&ctz=America%2FRegina"
              width="100%"
              height="600"
              frameBorder="0"
              scrolling="no"
              className="max-w-4xl w-full rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      {/* <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-dark mb-4">Quick Links</h2>
          <div className="w-24 h-1 bg-primary mb-12"></div>
          <LinkTree />
        </div>
      </section> */}

      {/* Latest Blog Post Section */}
      {latestPost && (
        <section className="py-20 bg-gray-200">
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
      <FacebookSection />
    </div>
  );
}
