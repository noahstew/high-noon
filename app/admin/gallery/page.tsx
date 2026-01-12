'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface GalleryItem {
  id: string;
  title: string;
  images: string[];
  created_at: string;
}

export default function AdminGalleryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus !== 'true') {
      router.push('/admin');
    } else {
      setIsLoading(false);
      fetchItems();
    }
  }, [router]);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchItems();
      } else {
        alert('Failed to delete gallery item');
      }
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Error deleting gallery item');
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
          <h1 className="text-3xl font-bold text-primary">Manage Gallery</h1>
          <button
            onClick={() => router.push('/admin')}
            className="text-primary hover:text-dark underline font-medium cursor-pointer"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-accent">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-dark">Your Gallery Items</h2>
            <button
              onClick={() => router.push('/admin/gallery/new')}
              className="bg-accent hover:bg-primary text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              + New Gallery Item
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-dark text-center py-8">No gallery items yet. Create your first item!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-accent transition-all overflow-hidden"
                >
                  {item.images.length > 0 && (
                    <div className="aspect-video bg-gray-200 relative">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {item.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          +{item.images.length - 1} more
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-dark mb-2">{item.title}</h3>
                    <div className="text-xs text-gray-500 mb-3">
                      Created: {formatDate(item.created_at)}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/admin/gallery/${item.id}`)}
                        className="flex-1 text-primary hover:text-dark py-2 font-medium transition-colors border-2 border-primary hover:border-dark rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 text-red-500 hover:text-red-700 py-2 font-medium transition-colors border-2 border-red-500 hover:border-red-700 rounded"
                      >
                        Delete
                      </button>
                    </div>
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
