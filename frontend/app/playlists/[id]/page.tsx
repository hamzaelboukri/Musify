'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { playlistService } from '@/services/playlistService';
import { SongCard } from '@/components/SongCard';
import { favoriteService } from '@/services/favoriteService';

export default function PlaylistDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [playlist, setPlaylist] = useState<{ _id: string; name: string; songs?: unknown[] } | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (id) {
      playlistService.getById(id).then(({ data }) => setPlaylist(data));
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      favoriteService.getAll().then(({ data }) => {
        const ids = new Set((data as { _id?: string }[]).map((s) => s._id).filter(Boolean));
        setFavorites(ids as Set<string>);
      });
    }
  }, [user]);

  const removeSong = async (songId: string) => {
    try {
      await playlistService.removeSong(id, songId);
      setPlaylist((p) =>
        p
          ? {
              ...p,
              songs: ((p.songs as { _id: string }[])?.filter((s) => s._id !== songId) ?? []) as unknown[],
            }
          : null
      );
    } catch {}
  };

  if (loading) return <div className="p-8 text-center text-white/60">Loading...</div>;
  if (!playlist) return <div className="p-8 text-center text-white/60">Playlist not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">{playlist.name}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {((playlist.songs || []) as { _id: string }[]).map((song) => (
          <div key={song._id} className="relative">
            <SongCard
              song={song as Parameters<typeof SongCard>[0]['song']}
              onFavorite={user ? () => {} : undefined}
              isFavorite={favorites.has(song._id)}
            />
            <button
              onClick={() => removeSong(song._id)}
              className="absolute top-2 left-2 p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white text-xs z-10"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
