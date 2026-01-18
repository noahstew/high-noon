'use client';

import { useState, useEffect } from 'react';
import BlogCard from '@/components/BlogCard';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  images?: string[];
  published_at?: string;
  created_at: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-dark mb-4">Blog</h1>
            <div className="w-24 h-1 bg-primary mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Read our recent blog posts about what we've been doing in our
              community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 rounded-xl h-96"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-dark mb-4">Blog</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Read our recent blog posts about what we've been doing in our
            community
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No blog posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {posts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
