'use client';

import { useState } from 'react';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';

interface ApplicationUploadFormProps {
  className?: string;
}

export default function ApplicationUploadForm({
  className = '',
}: ApplicationUploadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setUploadStatus({
        type: 'error',
        message: 'Please upload a PDF file only.',
      });
      e.target.value = '';
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setUploadStatus({
        type: 'error',
        message: 'File size must be less than 5MB.',
      });
      e.target.value = '';
      return;
    }

    setFile(selectedFile);
    setUploadStatus({ type: null, message: '' });
  };

  const removeFile = () => {
    setFile(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setUploadStatus({
        type: 'error',
        message: 'Please select a file to upload.',
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ type: null, message: '' });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);

      const response = await fetch('/api/application', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUploadStatus({
          type: 'success',
          message: 'Sponsorship request submitted successfully! We will review it shortly.',
        });
        setFormData({ name: '', email: '' });
        setFile(null);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setUploadStatus({
          type: 'error',
          message: data.error || 'Failed to submit request. Please try again.',
        });
      }
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="upload-name" className="block font-semibold text-dark mb-1">
            Your Name (optional)
          </label>
          <input
            type="text"
            id="upload-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-primary text-dark"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="upload-email" className="block font-semibold text-dark mb-1">
            Your Email (optional)
          </label>
          <input
            type="email"
            id="upload-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-primary text-dark"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="file-upload" className="block font-semibold text-dark mb-1">
            PDF File <span className="text-primary">*</span>
          </label>

          {!file ? (
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center">
                <FiUpload className="text-3xl text-accent mb-2" />
                <p className="text-sm text-dark">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-dark/60 mt-1">PDF only (Max 5MB)</p>
              </div>
              <input
                id="file-upload"
                name="file"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex items-center justify-between w-full p-3 border-2 border-primary bg-primary/5">
              <div className="flex items-center gap-3">
                <FiFile className="text-xl text-primary" />
                <div>
                  <p className="text-sm font-medium text-dark">{file.name}</p>
                  <p className="text-xs text-dark/60">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-1 hover:bg-red-100 transition-colors"
              >
                <FiX className="text-lg text-red-600" />
              </button>
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isUploading || !file}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                <FiUpload />
                Submit Request
              </>
            )}
          </button>
        </div>

        {uploadStatus.type && (
          <div
            className={`p-3 border-l-4 ${
              uploadStatus.type === 'success'
                ? 'bg-green-50 border-green-500 text-green-800'
                : 'bg-red-50 border-red-500 text-red-800'
            }`}
          >
            <p className="text-sm">{uploadStatus.message}</p>
          </div>
        )}
      </form>
    </div>
  );
}
