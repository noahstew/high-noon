import Image from 'next/image';
import Link from 'next/link';
import { Users, Target, Heart, Handshake, ExternalLink } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-dark overflow-hidden">
        <Image
          src="/group.jpg"
          alt="High Noon Optimist Club Members"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/70 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-8 h-full flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            About Us
          </h1>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-start gap-6 mb-8">
            <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-dark mb-4">Our Mission</h2>
              <div className="w-24 h-1 bg-primary mb-6"></div>
            </div>
          </div>
          <div className="max-w-4xl">
            <p className="text-xl text-dark leading-relaxed mb-6">
              By providing hope and positive vision, Optimists work to bring out
              the best in youth, our communities, and ourselves.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-start gap-6 mb-8">
            <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-dark mb-4">Who We Are</h2>
              <div className="w-24 h-1 bg-primary mb-6"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h3 className="text-2xl font-bold text-dark mb-4">
                A Community of Optimists
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The High Noon Optimist Club is part of Optimist International, a
                worldwide volunteer organization made up of more than 2,500
                Optimist Clubs. Our members are community leaders, business
                professionals, and dedicated volunteers who share a common goal:
                to make our community a better place for young people.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We meet regularly to plan and execute programs that benefit
                youth in Regina and surrounding areas. Through our collective
                efforts, we create opportunities for children and teens to
                develop their talents, build confidence, and become positive
                contributors to society.
              </p>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/group2.jpg"
                alt="Club members gathering"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-start gap-6 mb-12">
            <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-dark mb-4">What We Do</h2>
              <div className="w-24 h-1 bg-primary mb-6"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl order-2 md:order-1">
              <Image
                src="/hockey.jpg"
                alt="Youth programs"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">
                    Youth Programs
                  </h3>
                  <p className="text-gray-700">
                    We organize and sponsor programs that provide youth with
                    opportunities to develop leadership skills, participate in
                    sports and recreation, and engage in community service.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">
                    Community Events
                  </h3>
                  <p className="text-gray-700">
                    Hosting events that bring the community together, foster
                    connections, and raise awareness for important causes.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">
                    Financial Supports
                  </h3>
                  <p className="text-gray-700">
                    Conducting fundraisers to support our programs and make
                    grants to other youth-serving organizations in our
                    community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-12">
            <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
              <Handshake className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-dark mb-4">
                Our Partnerships
              </h2>
              <div className="w-24 h-1 bg-primary mb-6"></div>
              <p className="text-lg text-gray-700 max-w-3xl">
                We believe in the power of collaboration. Through strategic
                partnerships with local organizations, businesses, and community
                groups, we amplify our impact and create more opportunities for
                youth in Regina.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {/* Partnership Card 1 */}
            <div className="group bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-56">
                <Image
                  src="/donation.jpg"
                  alt="Community Partnership"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-dark mb-2">
                  Community Organizations
                </h3>
                <p className="text-gray-700 mb-4">
                  Working alongside local non-profits and service organizations
                  to maximize our community impact.
                </p>
                <Link
                  href="/about/community"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  View our Partners
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Partnership Card 2 */}
            <div className="group bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-56">
                <Image
                  src="/table.jpg"
                  alt="Business Partners"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-dark mb-2">
                  Local Businesses
                </h3>
                <p className="text-gray-700 mb-4">
                  Partnering with Regina businesses to sponsor programs, provide
                  resources, and create opportunities for youth.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Become a Partner
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Partnership Card 3 */}
            <div className="group bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-56">
                <Image
                  src="/group3.jpg"
                  alt="Optimist International"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-dark mb-2">
                  Optimist International
                </h3>
                <p className="text-gray-700 mb-4">
                  Proud member of Optimist International, a global network of
                  clubs dedicated to youth empowerment.
                </p>
                <Link
                  href="https://www.optimist.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Visit Optimist.org
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Join Us in Making a Difference
          </h2>
          <p className="text-xl text-secondary mb-8">
            Whether you're interested in becoming a member, volunteering, or
            partnering with us, there are many ways to get involved with the
            High Noon Optimist Club.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-primary hover:bg-secondary hover:text-dark px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
