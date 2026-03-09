'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { songService } from '@/services/songService';
import { SongCard } from '@/components/SongCard';
import { SearchBar } from '@/components/SearchBar';
import { favoriteService } from '@/services/favoriteService';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [songs, setSongs] = useState<unknown[]>([]);
  const [trending, setTrending] = useState<unknown[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    songService.getAll().then(({ data }) => setSongs(data));
    songService.getTrending(10).then(({ data }) => setTrending(data));
  }, []);

  useEffect(() => {
    if (user) {
      favoriteService.getAll().then(({ data }) => {
        const ids = new Set((data as { _id?: string }[]).map((s) => s._id).filter(Boolean));
        setFavorites(ids as Set<string>);
      });
    }
  }, [user]);

  const handleSearch = (query: string) => {
    songService.getAll({ search: query }).then(({ data }) => setSongs(data));
  };

  const toggleFavorite = async (songId: string) => {
    if (!user) return;
    const isFav = favorites.has(songId);
    try {
      if (isFav) {
        await favoriteService.remove(songId);
        setFavorites((s) => {
          const n = new Set(s);
          n.delete(songId);
          return n;
        });
      } else {
        await favoriteService.add(songId);
        setFavorites((s) => new Set(Array.from(s).concat(songId)));
      }
    } catch {}
  };

  if (loading) return <div className="p-8 text-center text-white/60">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Trending</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {(trending as { _id: string }[]).map((song) => (
            <SongCard
              key={song._id}
              song={song as Parameters<typeof SongCard>[0]['song']}
              onFavorite={user ? toggleFavorite : undefined}
              isFavorite={favorites.has(song._id)}
            />
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">All Songs</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {(songs as { _id: string }[]).map((song) => (
            <SongCard
              key={song._id}
              song={song as Parameters<typeof SongCard>[0]['song']}
              onFavorite={user ? toggleFavorite : undefined}
              isFavorite={favorites.has(song._id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
