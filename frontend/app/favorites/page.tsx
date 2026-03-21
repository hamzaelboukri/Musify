'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { favoriteService } from '@/services/favoriteService';
import { SongCard } from '@/components/SongCard';

export default function FavoritesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [songs, setSongs] = useState<unknown[]>([]);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      favoriteService.getAll().then(({ data }) => setSongs(data));
    }
  }, [user]);

  const removeFavorite = async (songId: string) => {
    try {
      await favoriteService.remove(songId);
      setSongs((s) => (s as { _id: string }[]).filter((x) => x._id !== songId));
    } catch {}
  };

  if (loading) return <div className="p-8 text-center text-white/60">Loading...</div>;

  return (
    <div className="px-6 py-8 bg-gradient-to-b from-musify-teal/10 via-musify-purple/5 to-musify-dark min-h-full">
      <h1 className="text-2xl font-bold text-white mb-8">Liked Songs</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {(songs as { _id: string }[]).map((song) => (
          <SongCard
            key={song._id}
            song={song as Parameters<typeof SongCard>[0]['song']}
            queue={songs as Parameters<typeof SongCard>[0]['song'][]}
            onFavorite={removeFavorite}
            isFavorite
          />
        ))}
      </div>
    </div>
  );
}
