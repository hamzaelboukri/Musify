'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { playlistService } from '@/services/playlistService';
import { PlaylistCard } from '@/components/PlaylistCard';
import Link from 'next/link';

export default function PlaylistsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [playlists, setPlaylists] = useState<unknown[]>([]);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      playlistService.getAll().then(({ data }) => setPlaylists(data));
    }
  }, [user]);

  const createPlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const { data } = await playlistService.create(newName.trim());
      setPlaylists((p) => [data, ...(p as object[])]);
      setNewName('');
    } catch {}
    setCreating(false);
  };

  if (loading) return <div className="p-8 text-center text-white/60">Loading...</div>;

  return (
    <div className="px-6 py-8 bg-gradient-to-b from-musify-teal/10 via-musify-purple/5 to-musify-dark min-h-full">
      <h1 className="text-3xl font-bold text-white mb-8">My Playlists</h1>
      <form onSubmit={createPlaylist} className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="New playlist name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg bg-musify-card border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-musify-accent"
        />
        <button
          type="submit"
          disabled={creating}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-musify-teal to-musify-purple hover:opacity-90 text-white font-semibold disabled:opacity-50"
        >
          Create
        </button>
      </form>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {(playlists as { _id: string; name: string; songs?: unknown[] }[]).map((p) => (
          <PlaylistCard key={p._id} playlist={p} />
        ))}
      </div>
    </div>
  );
}
