'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function GalleryEditorPage() {
  const router = useRouter();
  const params = useParams();
  const isNewItem = params.id === 'new';

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    images: [] as string[],
  });

  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus !== 'true') {
      router.push('/admin');
      return;
    }

    if (!isNewItem) {
      fetchItem();
    } else {
      setIsLoading(false);
    }
  }, [router, params.id]);

  const fetchItem = async () => {
    try {
      const response = await fetch(`/api/gallery/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title,
          images: data.images || [],
        });
      } else {
        alert('Failed to load gallery item');
        router.push('/admin/gallery');
      }
    } catch (error) {
      console.error('Error fetching gallery item:', error);
      alert('Error loading gallery item');
      router.push('/admin/gallery');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = isNewItem ? '/api/gallery' : `/api/gallery/${params.id}`;
      const method = isNewItem ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(
          isNewItem
            ? 'Gallery item created successfully!'
            : 'Gallery item updated successfully!'
        );
        router.push('/admin/gallery');
      } else {
        alert('Failed to save gallery item');
      }
    } catch (error) {
      console.error('Error saving gallery item:', error);
      alert('Error saving gallery item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed the limit
    const remainingSlots = 4 - formData.images.length;
    if (remainingSlots <= 0) {
      alert('Maximum 4 images allowed per gallery item');
      e.target.value = '';
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      alert(
        `Only uploading ${remainingSlots} image(s) to stay within the 4 image limit`
      );
    }

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'gallery-images');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.publicUrl);
        } else {
          const errorData = await response.json();
          console.error('Upload failed:', errorData);
          alert(
            `Failed to upload ${file.name}: ${
              errorData.error || 'Unknown error'
            }`
          );
        }
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset file input
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...formData.images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < newImages.length) {
      [newImages[index], newImages[newIndex]] = [
        newImages[newIndex],
        newImages[index],
      ];
      setFormData({ ...formData, images: newImages });
    }
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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">
            {isNewItem ? 'Create New Gallery Item' : 'Edit Gallery Item'}
          </h1>
          <button
            onClick={() => router.push('/admin/gallery')}
            className="text-primary hover:text-dark underline font-medium cursor-pointer"
          >
            ← Back to Gallery
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-6 border-2 border-accent"
        >
          <div className="space-y-6">
            {/* Title */}
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
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none text-lg"
                placeholder="Enter gallery item title"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Images
              </label>

              {/* Upload Button */}
              <div className="mb-4">
                <label
                  className={`inline-block px-6 py-2 rounded-lg font-medium transition-colors ${
                    formData.images.length >= 4 || isUploading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-accent hover:bg-primary cursor-pointer'
                  } text-white`}
                >
                  {isUploading
                    ? 'Uploading...'
                    : formData.images.length >= 4
                    ? 'Max 4 Images'
                    : '+ Upload Images'}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading || formData.images.length >= 4}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  {formData.images.length}/4 images uploaded
                </p>
              </div>

              {/* Image List */}
              {formData.images.length === 0 ? (
                <p className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  No images added yet. Add image URLs above.
                </p>
              ) : (
                <div className="space-y-3">
                  {formData.images.map((url, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-2 border-gray-200"
                    >
                      <img
                        src={url}
                        alt={`Image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src =
                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23ddd" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999"%3EError%3C/text%3E%3C/svg%3E';
                        }}
                      />

                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm text-gray-600 truncate">{url}</p>
                      </div>

                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => moveImage(index, 'up')}
                          disabled={index === 0}
                          className="p-2 text-gray-600 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(index, 'down')}
                          disabled={index === formData.images.length - 1}
                          className="p-2 text-gray-600 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-2 text-red-500 hover:text-red-700"
                          title="Remove"
                        >
                          <svg
                            className="w-5 h-5"
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => router.push('/admin/gallery')}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-dark rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-accent hover:bg-primary text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? 'Saving...'
                : isNewItem
                ? 'Create Gallery Item'
                : 'Update Gallery Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
