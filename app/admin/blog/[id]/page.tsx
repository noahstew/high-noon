'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function BlogEditorPage() {
  const router = useRouter();
  const params = useParams();
  const isNewPost = params.id === 'new';

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    images: [] as string[],
    published_at: '',
  });

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFormData((prev) => ({ ...prev, content: html }));
    },
  });

  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus !== 'true') {
      router.push('/admin');
      return;
    }

    if (!isNewPost) {
      fetchPost();
    } else {
      setIsLoading(false);
    }
  }, [router, params.id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title,
          content: data.content,
          images: data.images || [],
          published_at: data.published_at
            ? new Date(data.published_at).toISOString().split('T')[0]
            : '',
        });
        // Update editor content
        if (editor && data.content) {
          editor.commands.setContent(data.content);
        }
      } else {
        alert('Failed to load blog post');
        router.push('/admin/blog');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      alert('Error loading blog post');
      router.push('/admin/blog');
    } finally {
      setIsLoading(false);
    }
  };

  // Update editor when content is loaded
  useEffect(() => {
    if (editor && formData.content && !isLoading) {
      const currentContent = editor.getHTML();
      if (currentContent !== formData.content) {
        editor.commands.setContent(formData.content);
      }
    }
  }, [editor, formData.content, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        published_at: formData.published_at
          ? new Date(formData.published_at).toISOString()
          : null,
      };

      const url = isNewPost ? '/api/blog' : `/api/blog/${params.id}`;
      const method = isNewPost ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        alert(
          isNewPost
            ? 'Blog post created successfully!'
            : 'Blog post updated successfully!'
        );
        router.push('/admin/blog');
      } else {
        alert('Failed to save blog post');
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Error saving blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed the limit
    const remainingSlots = 4 - formData.images.length;
    if (remainingSlots <= 0) {
      alert('Maximum 4 images allowed per blog post');
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
        formData.append('bucket', 'blog-images');

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
          alert(`Failed to upload ${file.name}: ${errorData.error || 'Unknown error'}`);
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
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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
            {isNewPost ? 'Create New Post' : 'Edit Post'}
          </h1>
          <button
            onClick={() => router.push('/admin/blog')}
            className="text-primary hover:text-dark underline font-medium cursor-pointer"
          >
            ← Back to Posts
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
                placeholder="Enter post title"
              />
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Content *
              </label>

              {/* Toolbar */}
              {editor && (
                <div className="flex flex-wrap gap-2 p-2 border-2 border-gray-200 rounded-t-lg bg-gray-50">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold ${
                      editor.isActive('bold') ? 'bg-gray-200' : ''
                    }`}
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 italic ${
                      editor.isActive('italic') ? 'bg-gray-200' : ''
                    }`}
                    title="Italic"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 line-through ${
                      editor.isActive('strike') ? 'bg-gray-200' : ''
                    }`}
                    title="Strikethrough"
                  >
                    S
                  </button>
                  <div className="w-px bg-gray-300"></div>
                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className={`px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm ${
                      editor.isActive('heading', { level: 1 })
                        ? 'bg-gray-200'
                        : ''
                    }`}
                    title="Heading 1"
                  >
                    H1
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={`px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm ${
                      editor.isActive('heading', { level: 2 })
                        ? 'bg-gray-200'
                        : ''
                    }`}
                    title="Heading 2"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    className={`px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm ${
                      editor.isActive('heading', { level: 3 })
                        ? 'bg-gray-200'
                        : ''
                    }`}
                    title="Heading 3"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={`px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm ${
                      editor.isActive('paragraph') ? 'bg-gray-200' : ''
                    }`}
                    title="Paragraph"
                  >
                    P
                  </button>
                  <div className="w-px bg-gray-300"></div>
                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().toggleBulletList().run()
                    }
                    className={`px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm ${
                      editor.isActive('bulletList') ? 'bg-gray-200' : ''
                    }`}
                    title="Bullet List"
                  >
                    • List
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().toggleOrderedList().run()
                    }
                    className={`px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm ${
                      editor.isActive('orderedList') ? 'bg-gray-200' : ''
                    }`}
                    title="Numbered List"
                  >
                    1. List
                  </button>
                </div>
              )}

              {/* Editor */}
              <EditorContent
                editor={editor}
                className="w-full min-h-[400px] px-4 py-3 border-2 border-t-0 border-gray-200 rounded-b-lg focus-within:border-accent prose max-w-none [&_.ProseMirror]:min-h-[400px] [&_.ProseMirror]:outline-none"
              />
            </div>

            {/* Published Date */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Publish Date (Optional - Leave empty for draft)
              </label>
              <input
                type="date"
                value={formData.published_at}
                onChange={(e) =>
                  setFormData({ ...formData, published_at: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                If no date is set, the post will be saved as a draft
              </p>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Images (Optional)
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
              {formData.images.length > 0 && (
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
                      />

                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm text-gray-600 truncate">{url}</p>
                      </div>

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
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => router.push('/admin/blog')}
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
                : isNewPost
                ? 'Create Post'
                : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
