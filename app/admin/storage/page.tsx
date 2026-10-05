'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, FileText, Trash2, Upload } from 'lucide-react';

interface StoredDocument {
  path: string;
  name: string;
  createdAt: string | null;
  size: number | null;
}

const ACCEPTED_DOCUMENTS =
  '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.rtf,.txt,.odt,.ods,.odp';

function formatFileSize(size: number | null) {
  if (size === null) return 'Document';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminStoragePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadingPath, setDownloadingPath] = useState<string | null>(null);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchDocuments = useCallback(async () => {
    setError('');
    try {
      const response = await fetch('/api/admin/storage/documents');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load documents');
      }
      setDocuments(data.documents);
    } catch (fetchError) {
      console.error('Error fetching documents:', fetchError);
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Failed to load documents'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('adminAuth') !== 'true') {
      router.push('/admin');
      return;
    }
    void fetchDocuments();
  }, [fetchDocuments, router]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setError('');
    const failures: string[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/admin/storage/documents', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
          failures.push(`${file.name}: ${data.error || 'Upload failed'}`);
        }
      }

      await fetchDocuments();
      if (failures.length > 0) {
        setError(failures.join('\n'));
      }
    } catch (uploadError) {
      console.error('Error uploading documents:', uploadError);
      setError('An error occurred while uploading documents');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownload = async (document: StoredDocument) => {
    const downloadWindow = window.open('', '_blank');
    setDownloadingPath(document.path);

    try {
      const response = await fetch(
        `/api/admin/storage/documents/download?path=${encodeURIComponent(
          document.path
        )}`
      );
      const data = await response.json();
      if (!response.ok) {
        downloadWindow?.close();
        throw new Error(data.error || 'Failed to download document');
      }

      if (downloadWindow) {
        downloadWindow.location.href = data.signedUrl;
      } else {
        window.location.href = data.signedUrl;
      }
    } catch (downloadError) {
      console.error('Error downloading document:', downloadError);
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : 'Failed to download document'
      );
    } finally {
      setDownloadingPath(null);
    }
  };

  const handleDelete = async (document: StoredDocument) => {
    if (
      !window.confirm(
        `Permanently delete "${document.name}" from document storage?`
      )
    ) {
      return;
    }

    setDeletingPath(document.path);
    setError('');
    try {
      const response = await fetch('/api/admin/storage/documents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: document.path }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete document');
      }

      setDocuments((current) =>
        current.filter((item) => item.path !== document.path)
      );
    } catch (deleteError) {
      console.error('Error deleting document:', deleteError);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Failed to delete document'
      );
    } finally {
      setDeletingPath(null);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-primary">Document Storage</h1>
          <button
            onClick={() => router.push('/admin')}
            className="cursor-pointer font-medium text-primary underline hover:text-dark"
          >
            ← Back to Dashboard
          </button>
        </div>

        <section className="mb-8 rounded-lg border-2 border-accent bg-white p-6 shadow-lg">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-dark">
                Upload documents
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                PDF, Word, Excel, PowerPoint, CSV, RTF, or text files up to 50
                MB each.
              </p>
            </div>
            <label
              className={`inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium text-white transition-colors ${
                isUploading
                  ? 'cursor-wait bg-gray-400'
                  : 'bg-accent hover:bg-primary'
              }`}
            >
              <Upload className="h-5 w-5" aria-hidden="true" />
              {isUploading ? 'Uploading...' : 'Choose documents'}
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_DOCUMENTS}
                multiple
                disabled={isUploading}
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          </div>
          {error && (
            <p
              role="alert"
              className="mt-4 whitespace-pre-line rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
        </section>

        <section className="rounded-lg border-2 border-accent bg-white p-6 shadow-lg">
          <h2 className="mb-5 text-xl font-semibold text-dark">
            Stored documents
          </h2>
          {isLoading ? (
            <p className="py-8 text-center text-gray-600">
              Loading documents...
            </p>
          ) : documents.length === 0 ? (
            <p className="py-8 text-center text-gray-600">
              No documents uploaded yet.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {documents.map((document) => (
                <li
                  key={document.path}
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-dark">
                      {document.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {document.createdAt
                        ? new Date(document.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )
                        : 'Date unavailable'}{' '}
                      · {formatFileSize(document.size)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void handleDownload(document)}
                      disabled={
                        downloadingPath === document.path ||
                        deletingPath === document.path
                      }
                      className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-3 py-2 font-medium text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-wait disabled:opacity-50 sm:px-4"
                      aria-label={`Download ${document.name}`}
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      <span className="hidden sm:inline">
                        {downloadingPath === document.path
                          ? 'Preparing...'
                          : 'Download'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(document)}
                      disabled={
                        deletingPath === document.path ||
                        downloadingPath === document.path
                      }
                      className="inline-flex items-center gap-2 rounded-lg border-2 border-red-600 px-3 py-2 font-medium text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:cursor-wait disabled:opacity-50"
                      aria-label={`Delete ${document.name}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      <span className="hidden sm:inline">
                        {deletingPath === document.path
                          ? 'Deleting...'
                          : 'Delete'}
                      </span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
