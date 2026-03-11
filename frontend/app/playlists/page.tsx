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

  const deletePlaylist = async (playlistId: string) => {
    try {
      await playlistService.delete(playlistId);
      setPlaylists((p) => (p as { _id: string }[]).filter((pl) => pl._id !== playlistId));
    } catch {}
  };

  if (loading) return <div className="p-8 text-center text-white/60">Loading...</div>;

  const playlistList = playlists as { _id: string; name: string; songs?: unknown[] }[];

  return (
    <div className="px-6 py-8 min-h-full">
      <h1 className="text-3xl font-bold text-white mb-8">My Playlists</h1>
      <form onSubmit={createPlaylist} className="flex gap-2 mb-8 max-w-2xl">
        <input
          type="text"
          placeholder="New playlist name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-musify-card border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-musify-teal focus:ring-2 focus:ring-musify-teal/20"
        />
        <button
          type="submit"
          disabled={creating}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-musify-teal to-musify-purple hover:opacity-90 text-white font-semibold disabled:opacity-50 transition"
        >
          Create
        </button>
      </form>
      {playlistList.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-musify-card/50 border border-white/5 border-dashed">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-musify-teal/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-musify-teal/50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
          </div>
          <p className="text-white/70 font-medium">No playlists yet</p>
          <p className="text-white/50 text-sm mt-1">Create one above to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlistList.map((p) => (
            <PlaylistCard key={p._id} playlist={p} onDelete={deletePlaylist} />
          ))}
        </div>
      )}
    </div>
  );
}
