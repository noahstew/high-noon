'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('adminAuth', 'true');
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setError('Incorrect password');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  const navigateTo = (path: string) => {
    router.push(`/admin/${path}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border-2 border-accent">
          <h1 className="text-2xl font-bold text-center mb-6 text-primary">
            Admin Login
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-dark mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 border-accent rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-dark"
                placeholder="Enter admin password"
                required
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-dark transition-colors font-medium cursor-pointer"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl border-2 border-accent">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-accent hover:text-dark underline font-medium cursor-pointer"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigateTo('links')}
            className="bg-primary text-white p-8 rounded-lg hover:bg-dark transition-all shadow-md hover:shadow-xl transform hover:scale-105 border-2 border-accent cursor-pointer"
          >
            <div className="text-4xl mb-3">🔗</div>
            <div className="text-xl font-bold">Community</div>
            <div className="text-sm text-secondary mt-2">
              Manage these links
            </div>
          </button>

          <button
            onClick={() => navigateTo('blog')}
            className="bg-primary text-white p-8 rounded-lg hover:bg-dark transition-all shadow-md hover:shadow-xl transform hover:scale-105 border-2 border-accent cursor-pointer"
          >
            <div className="text-4xl mb-3">📝</div>
            <div className="text-xl font-bold">Blog</div>
            <div className="text-sm text-secondary mt-2">
              Create & edit posts
            </div>
          </button>

          <button
            onClick={() => navigateTo('gallery')}
            className="bg-primary text-white p-8 rounded-lg hover:bg-dark transition-all shadow-md hover:shadow-xl transform hover:scale-105 border-2 border-accent cursor-pointer"
          >
            <div className="text-4xl mb-3">🖼️</div>
            <div className="text-xl font-bold">Gallery</div>
            <div className="text-sm text-secondary mt-2">
              Manage gallery images
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
