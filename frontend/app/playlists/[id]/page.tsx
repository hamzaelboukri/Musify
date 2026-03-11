'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
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
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
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

  const deletePlaylist = async () => {
    if (!confirm(`Delete playlist "${playlist?.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await playlistService.delete(id);
      router.replace('/playlists');
    } catch {}
    setDeleting(false);
  };

  if (loading) return <div className="p-8 text-center text-white/60">Loading...</div>;
  if (!playlist) return <div className="p-8 text-center text-white/60">Playlist not found</div>;

  const playlistSongs = (playlist.songs || []) as { _id: string; title?: string; artist?: string; coverImage?: string; audioUrl?: string; duration?: number }[];

  return (
    <div className="px-6 py-8 min-h-full">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-white">{playlist.name}</h1>
        <div className="flex items-center gap-2">
          <Link href="/playlists" className="px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 text-sm font-medium transition">
            Back to Playlists
          </Link>
          <button
            onClick={deletePlaylist}
            disabled={deleting}
            className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 text-sm font-medium transition disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete Playlist'}
          </button>
        </div>
      </div>
      {playlistSongs.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-musify-card/50 border border-white/5 border-dashed">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-musify-teal/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-musify-teal/50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
          <p className="text-white/70 font-medium">This playlist is empty</p>
          <p className="text-white/50 text-sm mt-1">Add songs from Search or Home to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlistSongs.map((song) => (
            <div key={song._id} className="relative">
              <SongCard
                song={{
                  _id: song._id,
                  title: song.title ?? 'Unknown',
                  artist: song.artist ?? '',
                  coverImage: song.coverImage,
                  audioUrl: song.audioUrl ?? '',
                  duration: song.duration ?? 0,
                }}
                queue={playlistSongs.map((s) => ({
                  _id: s._id,
                  title: s.title ?? 'Unknown',
                  artist: s.artist ?? '',
                  coverImage: s.coverImage,
                  audioUrl: s.audioUrl ?? '',
                  duration: s.duration ?? 0,
                }))}
                onFavorite={user ? () => {} : undefined}
                isFavorite={favorites.has(song._id)}
              />
              <button
                onClick={(e) => { e.stopPropagation(); removeSong(song._id); }}
                className="absolute top-2 left-2 p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white text-xs z-10"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
