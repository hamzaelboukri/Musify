'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { singerService } from '@/services/singerService';
import { AdminTable } from '@/components/AdminTable';

export default function SingerDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<{ _id: string; stageName: string; isApproved: boolean } | null>(null);
  const [songs, setSongs] = useState<unknown[]>([]);
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [applyForm, setApplyForm] = useState({ stageName: '', bio: '' });
  const [form, setForm] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 180,
  });

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
    if (user && user.role !== 'SINGER' && user.role !== 'ADMIN') router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'SINGER') {
      singerService.getMyProfile().then(({ data }) => setProfile(data)).catch(() => setProfile(null));
      singerService.getMySongs().then(({ data }) => setSongs(data)).catch(() => setSongs([]));
      singerService.getStats().then(({ data }) => setStats(data)).catch(() => setStats(null));
    }
  }, [user]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      await singerService.uploadSong({
        ...form,
        singerId: profile._id,
      });
      singerService.getMySongs().then(({ data }) => setSongs(data));
      setShowUpload(false);
      setForm({ title: '', artist: profile.stageName, album: '', genre: '', audioUrl: form.audioUrl, duration: 180 });
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyForm.stageName.trim()) return;
    try {
      const { data } = await singerService.apply({
        stageName: applyForm.stageName.trim(),
        bio: applyForm.bio.trim() || undefined,
      });
      setProfile(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-musify-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-violet-500/30 border-t-violet-400 animate-spin" />
          <p className="text-violet-200/80">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Apply form - creative artist onboarding
  if (user?.role === 'SINGER' && !profile) {
    return (
      <div className="min-h-full bg-musify-dark">
        <header className="sticky top-0 z-10 px-6 py-4 bg-musify-dark/80 backdrop-blur-xl border-b border-violet-500/10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-violet-200/90 hover:text-violet-100 hover:bg-violet-500/10 text-sm font-medium transition"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
            Back to Musify
          </Link>
        </header>
        <div className="flex items-center justify-center p-8 min-h-[calc(100vh-60px)]">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 items-center justify-center mb-4 shadow-lg shadow-violet-500/40">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Become an Artist</h1>
            <p className="text-violet-200/80 mt-2">Create your stage identity and start sharing your music</p>
          </div>
          <form onSubmit={handleApply} className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20">
            <input
              value={applyForm.stageName}
              onChange={(e) => setApplyForm((f) => ({ ...f, stageName: e.target.value }))}
              placeholder="Stage Name"
              required
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-violet-500/30 text-white placeholder-violet-200/50 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
            />
            <textarea
              value={applyForm.bio}
              onChange={(e) => setApplyForm((f) => ({ ...f, bio: e.target.value }))}
              placeholder="Bio (optional)"
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-violet-500/30 text-white placeholder-violet-200/50 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 resize-none"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-400 hover:to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30 transition"
            >
              Apply
            </button>
          </form>
        </div>
        </div>
      </div>
    );
  }

  // Main singer dashboard - stage/studio vibe
  return (
    <div className="min-h-full bg-musify-dark">
      <header className="sticky top-0 z-10 px-6 py-4 bg-musify-dark/80 backdrop-blur-xl border-b border-violet-500/10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-violet-200/90 hover:text-violet-100 hover:bg-violet-500/10 text-sm font-medium transition"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
            Back to Musify
          </Link>
          <span className="text-violet-200/50 text-sm">Artist Dashboard</span>
        </div>
      </header>
      {/* Purple/violet gradient header - artist spotlight */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-fuchsia-600/20 to-purple-800/10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative p-8 pb-20">
        <div className="relative max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white">{profile?.stageName || 'Artist'}</h1>
              <p className="text-violet-200/90 mt-1">Singer Dashboard</p>
              {profile && !profile.isApproved && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                  Pending approval – songs will be public once approved
                </div>
              )}
            </div>
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="px-6 py-3 rounded-xl bg-white text-violet-900 font-semibold hover:bg-violet-50 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              {showUpload ? 'Cancel' : 'Upload Song'}
            </button>
          </div>
        </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-12">
        {/* Stats - big creative cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Songs', value: stats.totalSongs as number, color: 'border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/15' },
              { label: 'Total Plays', value: stats.totalPlays as number, color: 'border-fuchsia-500/30 bg-fuchsia-500/10 hover:bg-fuchsia-500/15' },
              { label: 'Approved', value: stats.approvedSongs as number, color: 'border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15' },
              { label: 'Pending', value: stats.pendingSongs as number, color: 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/15' },
            ].map((s) => (
              <div
                key={s.label}
                className={`p-5 rounded-2xl border ${s.color} transition-all shadow-lg shadow-black/10`}
              >
                <p className="text-white/70 text-sm mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Upload form */}
        {showUpload && (
          <form
            onSubmit={handleUpload}
            className="p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 mb-8 space-y-4"
          >
            <h3 className="text-lg font-semibold text-white mb-4">New Song</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
                className="px-4 py-2.5 rounded-xl bg-black/30 border border-violet-500/20 text-white placeholder-violet-200/50"
              />
              <input
                placeholder="Artist"
                value={form.artist}
                onChange={(e) => setForm((f) => ({ ...f, artist: e.target.value }))}
                required
                className="px-4 py-2.5 rounded-xl bg-black/30 border border-violet-500/20 text-white placeholder-violet-200/50"
              />
              <input
                placeholder="Genre"
                value={form.genre}
                onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))}
                className="px-4 py-2.5 rounded-xl bg-black/30 border border-violet-500/20 text-white placeholder-violet-200/50"
              />
              <input
                type="number"
                placeholder="Duration (seconds)"
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: parseInt(e.target.value) || 0 }))}
                className="px-4 py-2.5 rounded-xl bg-black/30 border border-violet-500/20 text-white placeholder-violet-200/50"
              />
            </div>
            <input
              placeholder="Audio URL"
              value={form.audioUrl}
              onChange={(e) => setForm((f) => ({ ...f, audioUrl: e.target.value }))}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-violet-500/20 text-white placeholder-violet-200/50"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-medium hover:opacity-90 transition"
            >
              Upload
            </button>
          </form>
        )}

        {/* Songs table */}
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-musify-card/50 shadow-xl">
          <h2 className="text-lg font-semibold text-white px-6 py-4 border-b border-violet-500/20">My Songs</h2>
          <AdminTable
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'artist', label: 'Artist' },
              { key: 'playCount', label: 'Plays' },
              { key: 'isApproved', label: 'Status' },
            ]}
            data={(songs as { title: string; artist: string; playCount: number; isApproved: boolean; _id: string }[]).map(
              (s) => ({
                ...s,
                isApproved: s.isApproved ? 'Approved' : 'Pending',
              })
            )}
            actions={(row) => (
              <button
                onClick={async () => {
                  if (confirm('Delete this song?')) {
                    await singerService.deleteSong((row as { _id: string })._id);
                    singerService.getMySongs().then(({ data }) => setSongs(data));
                  }
                }}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Delete
              </button>
            )}
          />
        </div>
      </div>
    </div>
  );
}
