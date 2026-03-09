'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-musify-accent">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-musify-teal/20 via-musify-purple/10 to-musify-dark">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src="/musify-logo.png" alt="Musify" className="w-20 h-20 object-contain" />
        </div>
        <h1 className="text-4xl font-bold text-center text-white mb-8">Musify</h1>
        <LoginForm />
        <p className="text-center text-white/60 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-musify-accent hover:text-musify-teal hover:underline">
            Register
          </Link>
        </p>
        <p className="text-center text-white/40 text-xs mt-4">
          Demo: user@musify.com / User123! (run <code className="bg-white/10 px-1 rounded">npm run seed</code> in backend first)
        </p>
      </div>
    </div>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      window.location.href = '/';
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string | string[] } }; message?: string };
      if (axiosErr.response?.status === 401) {
        setError(axiosErr.response?.data?.message as string || 'Invalid email or password. Register first or use demo: user@musify.com / User123!');
      } else if (axiosErr.message === 'Network Error' || !axiosErr.response) {
        setError('Cannot reach server. Is the backend running on port 3001?');
      } else {
        setError((axiosErr.response?.data?.message as string) || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        className="w-full px-4 py-3 rounded-lg bg-musify-card border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-musify-accent"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
        className="w-full px-4 py-3 rounded-lg bg-musify-card border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-musify-accent"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-full bg-gradient-to-r from-musify-teal to-musify-purple hover:opacity-90 text-white font-semibold transition disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
