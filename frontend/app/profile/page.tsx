'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    if (!loading && !user) router.replace('/login');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
          <p className="text-amber-200/80">Loading profile...</p>
        </div>
      </div>
    );
  }

  const historyList = history as { songId?: { title?: string; artist?: string }; playedAt?: string }[];

  return (
    <div className="min-h-full bg-musify-dark">
      {/* Top bar */}
      <header className="sticky top-0 z-10 px-6 py-4 bg-musify-dark/80 backdrop-blur-xl border-b border-amber-500/10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-amber-200/90 hover:text-amber-100 hover:bg-amber-500/10 text-sm font-medium transition"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
            Back to Musify
          </Link>
          <span className="text-amber-200/50 text-sm">Profile</span>
        </div>
      </header>

      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative max-w-2xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl shadow-amber-500/40 ring-4 ring-amber-500/20">
                {user?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-musify-dark flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
              </div>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{profile?.name || 'Listener'}</h1>
              <p className="text-amber-200/90 mt-2 flex items-center gap-2 justify-center sm:justify-start">
                <svg className="w-4 h-4 text-amber-400/80" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                {profile?.email}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg>
                <span className="text-amber-100 font-medium">{historyList.length}</span>
                <span className="text-amber-200/70 text-sm">songs played</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-16">
        {/* Profile card */}
        <div className="mt-8 p-6 rounded-2xl bg-musify-card/80 border border-white/5 shadow-xl shadow-black/20 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
            Edit Profile
          </h2>
          <form onSubmit={updateProfile} className="space-y-4">
            <div>
              <label className="block text-amber-200/80 text-sm mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-amber-500/20 text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
              />
            </div>
            <div>
              <label className="block text-amber-200/80 text-sm mb-1">Email</label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-amber-500/10 text-amber-200/60 cursor-not-allowed"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:scale-[1.02]"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Listening history */}
        <h2 className="text-xl font-semibold text-white mt-10 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg>
          Listening History
        </h2>
        <div className="space-y-2">
          {historyList.length === 0 ? (
            <div className="py-16 rounded-2xl bg-musify-card/50 border border-white/5 border-dashed text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-400/50" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg>
              </div>
              <p className="text-amber-200/60">No listening history yet</p>
              <p className="text-amber-200/40 text-sm mt-1">Start exploring music on the home page!</p>
              <Link href="/" className="inline-block mt-4 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 text-sm font-medium transition">
                Explore Music
              </Link>
            </div>
          ) : (
            historyList.map((h, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-musify-card/50 border border-white/5 hover:bg-white/5 hover:border-amber-500/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 group-hover:bg-amber-500/30 flex items-center justify-center text-amber-400 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{h.songId?.title || 'Unknown'}</p>
                  <p className="text-amber-200/70 text-sm truncate">{h.songId?.artist || '-'}</p>
                </div>
                <span className="text-amber-200/50 text-sm whitespace-nowrap">
                  {new Date(h.playedAt || 0).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
