'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'SINGER'>('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ name, email, password, role });
      router.replace('/');
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-musify-teal/20 via-musify-purple/10 to-musify-dark">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src="/musify-logo.png" alt="Musify" className="w-20 h-20 object-contain" />
        </div>
        <h1 className="text-4xl font-bold text-center text-white mb-8">Musify</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="w-full px-4 py-3 rounded-lg bg-musify-card border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-musify-accent"
          />
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
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full px-4 py-3 rounded-lg bg-musify-card border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-musify-accent"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'USER' | 'SINGER')}
            className="w-full px-4 py-3 rounded-lg bg-musify-card border border-white/10 text-white focus:outline-none focus:border-musify-accent"
          >
            <option value="USER">USER</option>
            <option value="SINGER">SINGER</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-musify-teal to-musify-purple hover:opacity-90 text-white font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-white/60 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-musify-accent hover:text-musify-teal hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
