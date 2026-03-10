'use client';

import { useEffect, useState } from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { songService } from '@/services/songService';
import { AlbumCard } from '@/components/AlbumCard';
import { useAuth } from '@/contexts/AuthContext';
import { favoriteService } from '@/services/favoriteService';
import { usePlayer } from '@/contexts/PlayerContext';
import Link from 'next/link';

const GENRES = ['All', 'Pop', 'Rock', 'Hip-hop', 'Jazz', 'Blues', 'Country', 'Electronic', 'Classical', 'R&B'];

type Song = {
  _id: string;
  title: string;
  artist: string;
  coverImage?: string;
  audioUrl: string;
  duration: number;
  playCount?: number;
  genre?: string;
};

export default function HomePage() {
  const { user } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const { play, currentSong, isPlaying } = usePlayer();
  const [songs, setSongs] = useState<Song[]>([]);
  const [trending, setTrending] = useState<Song[]>([]);
  const [newReleases, setNewReleases] = useState<Song[]>([]);
  const [platformStats, setPlatformStats] = useState<{ totalStreams: number; totalDownloads: number }>({ totalStreams: 0, totalDownloads: 0 });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    songService.getAll({ search: searchQuery || undefined, genre: selectedGenre === 'All' ? undefined : selectedGenre, limit: 50 }).then(({ data }) => setSongs(data as Song[]));
    songService.getTrending(10).then(({ data }) => setTrending(data as Song[]));
    songService.getNewReleases(8).then(({ data }) => setNewReleases(data as Song[]));
    songService.getPlatformStats().then(({ data }) => setPlatformStats({ totalStreams: data.totalStreams ?? 0, totalDownloads: data.totalDownloads ?? 0 }));
  }, [searchQuery, selectedGenre]);

  useEffect(() => {
    if (user) {
      favoriteService.getAll().then(({ data }) => {
        const ids = new Set((data as { _id?: string }[]).map((s) => s._id).filter(Boolean));
        setFavorites(ids as Set<string>);
      });
    }
  }, [user]);

  const topHits = trending.slice(0, 6);
  const artists = Array.from(new Map(songs.map((s) => [s.artist, { name: s.artist, cover: s.coverImage }])).values()).slice(0, 6);

  const formatPlays = (n: number) => (n >= 1000000 ? `${(n / 1000000).toFixed(1)}m` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : '0');
  const formatDuration = (sec: number) => `${Math.floor(sec / 60)}.${(sec % 60).toString().padStart(2, '0')} min`;

  return (
    <div className="min-h-full bg-musify-dark">
      {/* Genre tabs */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                selectedGenre === g ? 'bg-musify-teal text-white' : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: New Releases + Promo + Artists */}
          <div className="lg:col-span-2 space-y-6">
            {/* New Releases */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4">New Releases</h2>
              <div className="flex overflow-x-auto gap-4 pb-4 -mx-2 scrollbar-hide">
                {newReleases.map((song) => (
                  <div key={song._id} className="flex-shrink-0 w-40">
                    <AlbumCard song={song} />
                    <p className="text-white/50 text-xs mt-1">{formatDuration(song.duration)}</p>
                  </div>
                ))}
                {newReleases.length === 0 && (
                  <p className="text-white/50 py-8">No songs yet</p>
                )}
              </div>
            </section>

            {/* Promo card */}
            <div className="rounded-2xl bg-gradient-to-br from-musify-teal/30 to-musify-purple/30 border border-white/10 p-6 overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">Unlimited Downloads</h3>
                  <p className="text-white/80 text-sm mt-2">Get Premier Membership for unlimited downloads and offline listening.</p>
                  <button className="mt-4 px-6 py-2.5 rounded-xl bg-musify-teal hover:bg-musify-accent-hover text-white font-medium transition">
                    Subscribe
                  </button>
                </div>
                <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-16 h-16 text-musify-teal/50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Artists */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4">Artists</h2>
              <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
                {artists.map((a, i) => (
                  <div key={i} className="flex-shrink-0 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-musify-teal to-musify-purple flex items-center justify-center text-white font-bold text-2xl mb-2">
                      {a.name?.charAt(0) ?? '?'}
                    </div>
                    <p className="text-white/90 text-sm font-medium truncate w-20">{a.name}</p>
                  </div>
                ))}
                {artists.length === 0 && <p className="text-white/50 text-sm">No artists yet</p>}
              </div>
            </section>
          </div>

          {/* Right: Top hits + Statistics */}
          <div className="space-y-6">
            {/* Top hits */}
            <div className="rounded-2xl bg-musify-card border border-white/10 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Top hits</h2>
                <Link href="/" className="text-musify-teal text-sm font-medium hover:underline">See more</Link>
              </div>
              <div className="space-y-3">
                {topHits.map((song, i) => {
                  const isCurrent = currentSong?._id === song._id;
                  return (
                    <div
                      key={song._id}
                      onClick={() => play(song)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition group"
                    >
                      <img src={song.coverImage || '/placeholder.svg'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{song.title}</p>
                        <p className="text-white/50 text-xs">{formatPlays(song.playCount || 0)} plays · {formatDuration(song.duration)}</p>
                      </div>
                      <button className="p-2 rounded-lg text-white/50 hover:text-white opacity-0 group-hover:opacity-100 transition">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
                {topHits.length === 0 && <p className="text-white/50 text-sm py-4">No songs yet</p>}
              </div>
            </div>

            {/* Statistics */}
            <div className="rounded-2xl bg-musify-card border border-white/10 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Statistics</h2>
                <Link href="/" className="text-musify-teal text-sm font-medium hover:underline">Explore</Link>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <div className="w-10 h-10 rounded-lg bg-musify-teal/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-musify-teal" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold">{formatPlays(platformStats.totalStreams)}</p>
                    <p className="text-white/50 text-xs">Streams</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <div className="w-10 h-10 rounded-lg bg-musify-purple/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-musify-purple" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold">{platformStats.totalDownloads}</p>
                    <p className="text-white/50 text-xs">Downloads</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-rose-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold">{favorites.size}</p>
                    <p className="text-white/50 text-xs">Likes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
