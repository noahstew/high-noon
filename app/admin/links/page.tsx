'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLinksPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus !== 'true') {
      router.push('/admin');
    } else {
      setIsLoading(false);
    }
  }, [router]);

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
          <p className="text-dark">Links management interface will go here.</p>
          {/* Add your links CRUD interface here */}
        </div>
      </div>
    </div>
  );
}
