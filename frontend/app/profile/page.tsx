'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/userService';
import { statsService } from '@/services/statsService';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
  const [history, setHistory] = useState<unknown[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      userService.getProfile().then(({ data }) => {
        setProfile(data);
        setName(data.name);
      });
      statsService.getHistory().then(({ data }) => setHistory(data));
    }
  }, [user]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.updateProfile({ name });
      setProfile((p) => (p ? { ...p, name } : null));
    } catch {}
  };

  if (loading) return <div className="p-8 text-center text-white/60">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">Profile</h1>
      <form onSubmit={updateProfile} className="space-y-4 mb-12">
        <div>
          <label className="block text-white/60 text-sm mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-musify-card border border-white/10 text-white focus:outline-none focus:border-musify-accent"
          />
        </div>
        <div>
          <label className="block text-white/60 text-sm mb-1">Email</label>
          <input
            type="email"
            value={profile?.email || ''}
            disabled
            className="w-full px-4 py-3 rounded-lg bg-musify-card border border-white/10 text-white/60"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-musify-accent hover:bg-musify-accent-hover text-black font-semibold"
        >
          Update
        </button>
      </form>
      <h2 className="text-xl font-bold text-white mb-4">Listening History</h2>
      <div className="space-y-2">
        {(history as { songId?: { title?: string; artist?: string }; playedAt?: string }[]).map((h, i) => (
          <div key={i} className="flex justify-between p-3 rounded-lg bg-musify-card">
            <span className="text-white">
              {h.songId?.title} - {h.songId?.artist}
            </span>
            <span className="text-white/60 text-sm">{new Date(h.playedAt || 0).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
