'use client';

import { useState } from 'react';
import ContactForm from '@/components/ContactForm';
import ApplicationDownloadButton from '@/components/ApplicationDownloadButton';
import ApplicationUploadForm from '@/components/ApplicationUploadForm';

type TabType = 'contact' | 'application';

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<TabType>('contact');

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">
          Get In Touch
        </h1>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-3 px-4 font-semibold transition-colors ${
              activeTab === 'contact'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-dark hover:bg-gray-300'
            }`}
          >
            Contact Us
          </button>
          <button
            onClick={() => setActiveTab('application')}
            className={`flex-1 py-3 px-4 font-semibold transition-colors ${
              activeTab === 'application'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-dark hover:bg-gray-300'
            }`}
          >
            Sponsorship Request
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'contact' ? (
          <div>
            <h2 className="text-2xl font-bold text-primary mb-4">
              Send Us a Message
            </h2>
            <p className="text-dark mb-6">
              Have a question or want to get involved? Fill out the form below.
            </p>
            <ContactForm />
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">
                Download Form
              </h2>
              <p className="text-dark mb-4">
                Download our sponsorship request form and fill it out.
              </p>
              <ApplicationDownloadButton />
            </div>

            <div className="border-t-2 border-gray-300 pt-6">
              <h2 className="text-2xl font-bold text-primary mb-4">
                Upload Completed Form
              </h2>
              <p className="text-dark mb-4">
                Once completed, upload your form here.
              </p>
              <ApplicationUploadForm />
            </div>

            <div className="bg-secondary/40 border-l-4 border-accent p-4 mt-6">
              <p className="font-semibold text-dark mb-2">What happens next?</p>
              <ul className="space-y-1 text-dark text-sm">
                <li>• Your request will be reviewed by our committee</li>
                <li>• We'll contact you within 5-7 business days</li>
                <li>• We'll discuss sponsorship opportunities</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
