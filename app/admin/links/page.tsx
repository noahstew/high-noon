'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Link {
  id: string;
  title: string;
  url: string;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export default function AdminLinksPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [links, setLinks] = useState<Link[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<Link | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    image_url: '',
  });

  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus !== 'true') {
      router.push('/admin');
    } else {
      setIsLoading(false);
      fetchLinks();
    }
  }, [router]);

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links');
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ title: '', url: '', image_url: '' });
        setIsModalOpen(false);
        fetchLinks();
      } else {
        alert('Failed to add link');
      }
    } catch (error) {
      console.error('Error adding link:', error);
      alert('Error adding link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchLinks();
      } else {
        alert('Failed to delete link');
      }
    } catch (error) {
      console.error('Error deleting link:', error);
      alert('Error deleting link');
    }
  };

  const handleDragStart = (e: React.DragEvent, link: Link) => {
    setIsDragging(true);
    setDraggedItem(link);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetLink: Link) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.id === targetLink.id) {
      setIsDragging(false);
      setDraggedItem(null);
      return;
    }

    const draggedIndex = links.findIndex((l) => l.id === draggedItem.id);
    const targetIndex = links.findIndex((l) => l.id === targetLink.id);

    // Create new array with updated positions
    const newLinks = [...links];
    newLinks.splice(draggedIndex, 1);
    newLinks.splice(targetIndex, 0, draggedItem);

    // Update sort orders
    const updatedLinks = newLinks.map((link, index) => ({
      ...link,
      sort_order: index,
    }));

    setLinks(updatedLinks);
    setIsDragging(false);
    setDraggedItem(null);

    // Save to database
    try {
      await fetch('/api/links', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          links: updatedLinks.map((l) => ({
            id: l.id,
            sort_order: l.sort_order,
          })),
        }),
      });
    } catch (error) {
      console.error('Error updating link order:', error);
      alert('Failed to update link order');
      fetchLinks(); // Refresh to get correct order
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedItem(null);
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
          <h1 className="text-3xl font-bold text-primary">Manage Links</h1>
          <button
            onClick={() => router.push('/admin')}
            className="text-primary hover:text-dark underline font-medium cursor-pointer"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-accent">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-dark">Your Links</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-accent hover:bg-primary text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              + Add Link
            </button>
          </div>

          {links.length === 0 ? (
            <p className="text-dark text-center py-8">
              No links yet. Add your first link!
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop to reorder links
              </p>
              {links.map((link) => (
                <div
                  key={link.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, link)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, link)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-accent transition-all cursor-move ${
                    draggedItem?.id === link.id ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-gray-400 cursor-grab active:cursor-grabbing">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 8h16M4 16h16"
                        />
                      </svg>
                    </div>

                    {link.image_url && (
                      <img
                        src={link.image_url}
                        alt={link.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}

                    <div className="flex-1">
                      <h3 className="font-semibold text-dark">{link.title}</h3>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {link.url}
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(link.id)}
                    className="text-red-500 hover:text-red-700 px-4 py-2 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Link Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary">Add New Link</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                    placeholder="Enter link title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    URL *
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-dark rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-accent hover:bg-primary text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Adding...' : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
