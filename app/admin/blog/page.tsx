'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  images: string[];
  published_at: string | null;
  created_at: string;
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus !== 'true') {
      router.push('/admin');
    } else {
      setIsLoading(false);
      fetchPosts();
    }
  }, [router]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPosts();
      } else {
        alert('Failed to delete blog post');
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert('Error deleting blog post');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Manage Blog Posts</h1>
          <button
            onClick={() => router.push('/admin')}
            className="text-primary hover:text-dark underline font-medium cursor-pointer"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-accent">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-dark">Your Blog Posts</h2>
            <button
              onClick={() => router.push('/admin/blog/new')}
              className="bg-accent hover:bg-primary text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              + New Post
            </button>
          </div>

          {posts.length === 0 ? (
            <p className="text-dark text-center py-8">
              No blog posts yet. Create your first post!
            </p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-accent transition-all"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-dark mb-2">
                      {post.title}
                    </h3>
                    <div
                      className="text-sm text-gray-600 mb-2 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: post.content.substring(0, 150) + '...',
                      }}
                    />
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>Created: {formatDate(post.created_at)}</span>
                      {post.published_at && (
                        <span className="text-green-600 font-medium">
                          Published: {formatDate(post.published_at)}
                        </span>
                      )}
                      {!post.published_at && (
                        <span className="text-orange-600 font-medium">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => router.push(`/admin/blog/${post.id}`)}
                      className="text-primary hover:text-dark px-4 py-2 font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 hover:text-red-700 px-4 py-2 font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
