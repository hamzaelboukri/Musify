'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { songService } from '@/services/songService';
import { SongCard } from '@/components/SongCard';
import { useSearch } from '@/contexts/SearchContext';
import { useAuth } from '@/contexts/AuthContext';
import { favoriteService } from '@/services/favoriteService';

type Song = {
  _id: string;
  title: string;
  artist: string;
  album?: string;
  coverImage?: string;
  audioUrl: string;
  duration: number;
  playCount?: number;
  genre?: string;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const { setSearchQuery } = useSearch();
  const { user } = useAuth();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSearchQuery(q);
  }, [q, setSearchQuery]);

  useEffect(() => {
    if (user) {
      favoriteService.getAll().then(({ data }) => {
        const ids = new Set((data as { _id?: string }[]).map((s) => s._id).filter(Boolean));
        setFavorites(ids as Set<string>);
      });
    }
  }, [user]);

  useEffect(() => {
    if (!q.trim()) {
      setSongs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    songService
      .getAll({ search: q.trim(), limit: 50 })
      .then(({ data }) => setSongs((data as Song[]) || []))
      .finally(() => setLoading(false));
  }, [q]);

  const removeFavorite = async (songId: string) => {
    try {
      await favoriteService.remove(songId);
      setFavorites((prev) => {
        const next = new Set(prev);
        next.delete(songId);
        return next;
      });
    } catch {
      // ignore
    }
  };

  const addFavorite = async (songId: string) => {
    try {
      await favoriteService.add(songId);
      setFavorites((prev) => new Set(prev).add(songId));
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-full px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
        {q.trim() ? (
          <>
            Search results for <span className="text-musify-teal">&quot;{q}&quot;</span>
          </>
        ) : (
          'Search'
        )}
      </h1>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 rounded-full border-2 border-musify-teal/40 border-t-musify-teal animate-spin" />
        </div>
      ) : !q.trim() ? (
        <div className="py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-musify-teal/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-musify-teal/50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>
          <p className="text-white/70 font-medium">Type something to search</p>
          <p className="text-white/50 text-sm mt-1">Search by song title, artist, or album</p>
        </div>
      ) : songs.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
            <svg className="w-10 h-10 text-white/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>
          <p className="text-white/70 font-medium">No results found</p>
          <p className="text-white/50 text-sm mt-1">Try different keywords or check your spelling</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {songs.map((song) => (
            <SongCard
              key={song._id}
              song={song}
              onFavorite={user ? (favorites.has(song._id) ? removeFavorite : addFavorite) : undefined}
              isFavorite={favorites.has(song._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
