'use client';

import { useEffect, useState } from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { songService } from '@/services/songService';
import { AlbumCard } from '@/components/AlbumCard';
import { useAuth } from '@/contexts/AuthContext';
import { favoriteService } from '@/services/favoriteService';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomePage() {
  const { user } = useAuth();
  const { searchQuery } = useSearch();
  const [songs, setSongs] = useState<unknown[]>([]);
  const [trending, setTrending] = useState<unknown[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    songService.getAll({ search: searchQuery || undefined }).then(({ data }) => setSongs(data));
    songService.getTrending(10).then(({ data }) => setTrending(data));
  }, [searchQuery]);

  useEffect(() => {
    if (user) {
      favoriteService.getAll().then(({ data }) => {
        const ids = new Set((data as { _id?: string }[]).map((s) => s._id).filter(Boolean));
        setFavorites(ids as Set<string>);
      });
    }
  }, [user]);

  const trendingSongs = (trending as { _id: string; title: string; artist: string; coverImage?: string; audioUrl: string; duration: number }[]).filter(
    (s) => !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const madeForYouSongs = (songs as { _id: string; title: string; artist: string; coverImage?: string; audioUrl: string; duration: number }[]).filter(
    (s) => !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-6 py-8 bg-gradient-to-b from-musify-teal/10 via-musify-purple/5 to-musify-dark min-h-full">
      <h1 className="text-3xl font-bold text-white mb-8">{getGreeting()}</h1>

      <section className="mb-10">
        <div className="flex overflow-x-auto gap-4 pb-4 -mx-2 scrollbar-hide">
          {trendingSongs.slice(0, 6).map((song) => (
            <div key={song._id} className="flex-shrink-0 w-40">
              <AlbumCard song={song} />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Made for you</h2>
            <p className="text-white/60 text-sm mt-1">Catch up on the latest releases</p>
          </div>
          <button className="text-sm font-medium text-white/80 hover:text-white hover:underline">
            Show all
          </button>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 -mx-2 scrollbar-hide">
          {madeForYouSongs.slice(0, 8).map((song) => (
            <div key={song._id} className="flex-shrink-0 w-48">
              <AlbumCard song={song} />
            </div>
          ))}
        </div>
      </section>

      {madeForYouSongs.length > 8 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">All Songs</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {madeForYouSongs.slice(8).map((song) => (
              <div key={song._id} className="flex-shrink-0">
                <AlbumCard song={song} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
