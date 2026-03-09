'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
    if (!loading && !user) router.replace('/');
    if (user && user.role !== 'SINGER' && user.role !== 'ADMIN') router.replace('/home');
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

  if (loading) return <div className="p-8 text-center text-white/60">Loading...</div>;

  if (user?.role === 'SINGER' && !profile) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">Apply to Become a Singer</h1>
        <form onSubmit={handleApply} className="space-y-4">
          <input
            value={applyForm.stageName}
            onChange={(e) => setApplyForm((f) => ({ ...f, stageName: e.target.value }))}
            placeholder="Stage Name"
            required
            className="w-full px-4 py-3 rounded-lg bg-musify-card border border-white/10 text-white placeholder-white/40"
          />
          <textarea
            value={applyForm.bio}
            onChange={(e) => setApplyForm((f) => ({ ...f, bio: e.target.value }))}
            placeholder="Bio (optional)"
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-musify-card border border-white/10 text-white placeholder-white/40"
          />
          <button type="submit" className="w-full py-3 rounded-lg bg-musify-accent text-black font-semibold">
            Apply
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">Singer Dashboard</h1>
      {profile && !profile.isApproved && (
        <div className="p-4 rounded-lg bg-amber-500/20 text-amber-200 mb-6">
          Your singer profile is pending approval. Songs will be public once approved.
        </div>
      )}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-musify-card">
            <p className="text-white/60 text-sm">Total Songs</p>
            <p className="text-2xl font-bold text-white">{stats.totalSongs as number}</p>
          </div>
          <div className="p-4 rounded-xl bg-musify-card">
            <p className="text-white/60 text-sm">Total Plays</p>
            <p className="text-2xl font-bold text-white">{stats.totalPlays as number}</p>
          </div>
          <div className="p-4 rounded-xl bg-musify-card">
            <p className="text-white/60 text-sm">Approved</p>
            <p className="text-2xl font-bold text-musify-accent">{stats.approvedSongs as number}</p>
          </div>
          <div className="p-4 rounded-xl bg-musify-card">
            <p className="text-white/60 text-sm">Pending</p>
            <p className="text-2xl font-bold text-amber-400">{stats.pendingSongs as number}</p>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">My Songs</h2>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="px-4 py-2 rounded-lg bg-musify-accent hover:bg-musify-accent-hover text-black font-medium"
        >
          {showUpload ? 'Cancel' : 'Upload Song'}
        </button>
      </div>
      {showUpload && (
        <form onSubmit={handleUpload} className="p-6 rounded-xl bg-musify-card mb-6 space-y-4">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
            className="w-full px-4 py-2 rounded-lg bg-musify-dark border border-white/10 text-white"
          />
          <input
            placeholder="Artist"
            value={form.artist}
            onChange={(e) => setForm((f) => ({ ...f, artist: e.target.value }))}
            required
            className="w-full px-4 py-2 rounded-lg bg-musify-dark border border-white/10 text-white"
          />
          <input
            placeholder="Genre"
            value={form.genre}
            onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg bg-musify-dark border border-white/10 text-white"
          />
          <input
            placeholder="Audio URL"
            value={form.audioUrl}
            onChange={(e) => setForm((f) => ({ ...f, audioUrl: e.target.value }))}
            required
            className="w-full px-4 py-2 rounded-lg bg-musify-dark border border-white/10 text-white"
          />
          <input
            type="number"
            placeholder="Duration (seconds)"
            value={form.duration}
            onChange={(e) => setForm((f) => ({ ...f, duration: parseInt(e.target.value) || 0 }))}
            className="w-full px-4 py-2 rounded-lg bg-musify-dark border border-white/10 text-white"
          />
          <button type="submit" className="px-6 py-2 rounded-lg bg-musify-accent text-black font-medium">
            Upload
          </button>
        </form>
      )}
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
  );
}
