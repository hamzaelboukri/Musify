'use client';

import { useEffect, useState } from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { songService } from '@/services/songService';
import { AlbumCard } from '@/components/AlbumCard';
import { SongCard } from '@/components/SongCard';
import { useAuth } from '@/contexts/AuthContext';
import { favoriteService } from '@/services/favoriteService';
import { statsService } from '@/services/statsService';
import { usePlayer } from '@/contexts/PlayerContext';
import Link from 'next/link';
import { getCoverImageUrl } from '@/utils/coverImage';

const GENRES = ['All', 'Pop', 'Rock', 'Hip-hop', 'Jazz', 'Blues', 'Country', 'Electronic', 'Classical', 'R&B'];

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

export default function HomePage() {
  const { user } = useAuth();
  const { searchQuery } = useSearch();
  const { play, currentSong, isPlaying } = usePlayer();
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [trending, setTrending] = useState<Song[]>([]);
  const [newReleases, setNewReleases] = useState<Song[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [playHistory, setPlayHistory] = useState<{ songId?: { _id: string; title?: string; artist?: string; coverImage?: string; audioUrl?: string; duration?: number }; playedAt?: string }[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    songService.getAll({ genre: selectedGenre === 'All' ? undefined : selectedGenre, limit: 50 }).then(({ data }) => setSongs(data as Song[]));
    songService.getTrending(10).then(({ data }) => setTrending(data as Song[]));
    songService.getNewReleases(8).then(({ data }) => setNewReleases(data as Song[]));
  }, [selectedGenre]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    const timer = setTimeout(() => {
      songService.getAll({ search: searchQuery.trim(), limit: 50 }).then(({ data }) => {
        setSearchResults((data as Song[]) || []);
      }).finally(() => setSearchLoading(false));
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (user) {
      favoriteService.getAll().then(({ data }) => {
        const ids = new Set((data as { _id?: string }[]).map((s) => s._id).filter(Boolean));
        setFavorites(ids as Set<string>);
      });
      statsService.getHistory(12).then(({ data }) => setPlayHistory((data as { songId?: { _id: string; title?: string; artist?: string; coverImage?: string; audioUrl?: string; duration?: number }; playedAt?: string }[]) || []));
    }
  }, [user]);

  const toggleFavorite = async (songId: string, isFav: boolean) => {
    try {
      if (isFav) {
        await favoriteService.remove(songId);
        setFavorites((prev) => { const n = new Set(prev); n.delete(songId); return n; });
      } else {
        await favoriteService.add(songId);
        setFavorites((prev) => new Set(prev).add(songId));
      }
    } catch {
      /* ignore */
    }
  };

  const topHits = trending.slice(0, 6);
  const artists = Array.from(new Map(songs.map((s) => [s.artist, { name: s.artist, cover: s.coverImage, singerImage: (s as { singerId?: { _id?: string; image?: string } }).singerId?.image, singerId: (s as { singerId?: { _id?: string } }).singerId?._id }])).values()).slice(0, 6);

  const formatPlays = (n: number) => (n >= 1000000 ? `${(n / 1000000).toFixed(1)}m` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : '0');
  const formatDuration = (sec: number) => `${Math.floor(sec / 60)}.${(sec % 60).toString().padStart(2, '0')} min`;

  const showSearchResults = searchQuery.trim().length > 0;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-full bg-[#0d0d0d]">
      {/* Premium accent bar + hero gradient */}
      {!showSearchResults && (
        <>
          <div className="h-1 bg-gradient-to-r from-[#00d4ff] via-[#00bfff] to-[#0080ff]" />
          <div className="h-72 bg-gradient-to-b from-[#00d4ff]/20 via-[#00bfff]/10 to-[#0d0d0d] -mt-px" />
        </>
      )}
      {/* Search results (when typing) - replaces main content */}
      {showSearchResults ? (
        <div className="px-6 pt-8 pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">
              Search results for <span className="text-[#00d4ff]">&quot;{searchQuery}&quot;</span>
            </h2>
            <Link href={`/search?q=${encodeURIComponent(searchQuery)}`} className="text-[#00d4ff] hover:text-[#00bfff] text-sm font-medium transition">
              See all →
            </Link>
          </div>
          {searchLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 rounded-full border-2 border-[#00d4ff]/40 border-t-[#00d4ff] animate-spin" />
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-white/5 border border-white/10">
              <p className="text-white/60">No results found</p>
              <p className="text-white/40 text-[13px] mt-1">Try different keywords</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {searchResults.slice(0, 10).map((song) => (
                <SongCard
                  key={song._id}
                  song={song}
                  queue={searchResults.slice(0, 10)}
                  onFavorite={user ? (id) => toggleFavorite(id, favorites.has(id)) : undefined}
                  isFavorite={favorites.has(song._id)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
      /* Genre filter + content (only when not searching) */
      <div className="px-6 pb-8 -mt-48 relative">
        {/* Genre tabs - always visible */}
        <div className="mb-6">
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-4 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all shrink-0 ${
                selectedGenre === g
                  ? 'bg-[#00d4ff] text-black shadow-lg shadow-[#00d4ff]/40'
                  : 'bg-white/10 text-white hover:bg-white/15 border border-white/5'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 tracking-tight">{greeting()}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: New Releases + Promo + Artists */}
          <div className="lg:col-span-2 space-y-6">
            {/* New Releases */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white tracking-tight">New Releases</h2>
                {newReleases.length > 0 && (
                  <button
                    onClick={() => play(newReleases[0], newReleases)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00bfff] text-black font-semibold text-[14px] hover:opacity-90 transition"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Play all
                  </button>
                )}
              </div>
              <div className="flex overflow-x-auto gap-5 pb-6 -mx-2 scrollbar-hide">
                {newReleases.map((song) => (
                  <div key={song._id} className="flex-shrink-0 w-40 sm:w-44">
                    <AlbumCard song={song} queue={newReleases} showDuration formatDuration={formatDuration} />
                  </div>
                ))}
                {newReleases.length === 0 && (
                  <p className="text-white/50 py-8">No songs yet</p>
                )}
              </div>
            </section>

            {/* Recently Played - only when logged in */}
            {user && playHistory.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-white tracking-tight">Recently Played</h2>
                  <Link href="/profile" className="text-[#b3b3b3] hover:text-[#00d4ff] text-sm font-medium transition">See all</Link>
                </div>
                <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide -mx-2">
                  {playHistory.slice(0, 8).map((h, i) => {
                    const song = h.songId;
                    if (!song) return null;
                    const s = { _id: song._id, title: song.title ?? 'Unknown', artist: song.artist ?? '', coverImage: song.coverImage, audioUrl: song.audioUrl ?? '', duration: song.duration ?? 0 };
                    const queue = playHistory.map((x) => x.songId).filter(Boolean).map((sng) => ({
                      _id: (sng as { _id: string })._id,
                      title: (sng as { title?: string }).title ?? 'Unknown',
                      artist: (sng as { artist?: string }).artist ?? '',
                      coverImage: (sng as { coverImage?: string }).coverImage,
                      audioUrl: (sng as { audioUrl?: string }).audioUrl ?? '',
                      duration: (sng as { duration?: number }).duration ?? 0,
                    }));
                    return (
                      <div key={`${song._id}-${i}`} className="flex-shrink-0 w-32 sm:w-36 group">
                        <div
                          onClick={() => play(s, queue)}
                          className="relative aspect-square rounded-xl overflow-hidden bg-white/5 cursor-pointer hover:bg-white/10 transition-all mb-2 ring-2 ring-transparent hover:ring-[#00d4ff]/30"
                        >
                          <img src={getCoverImageUrl(song.coverImage, song._id)} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = getCoverImageUrl(undefined, song._id); }} />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00bfff] flex items-center justify-center">
                              <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <p className="text-white font-medium truncate text-[14px]">{song.title}</p>
                        <p className="text-white/50 text-[12px] truncate">{song.artist}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Artists */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white tracking-tight">Artists</h2>
                <Link href="/search" className="text-[#b3b3b3] hover:text-[#00d4ff] text-[13px] font-medium transition">See all</Link>
              </div>
              <div className="flex overflow-x-auto gap-5 pb-4 scrollbar-hide -mx-1">
                {artists.map((a, i) => {
                  const imgUrl = getCoverImageUrl(a.singerImage || a.cover, a.name);
                  const hasImage = !!(a.singerImage || a.cover)?.trim();
                  const singerId = (a as { singerId?: string }).singerId;
                  const artistContent = (
                    <>
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#00d4ff]/30 to-[#00bfff]/20 flex items-center justify-center text-white font-bold text-lg ring-2 ring-white/10 transition-all duration-300 group-hover:ring-[#00d4ff]/50 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#00d4ff]/15 mb-2">
                        {hasImage ? (
                          <img src={imgUrl} alt={a.name} className="absolute inset-0 w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }} />
                        ) : null}
                        <span className={hasImage ? 'hidden absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#00d4ff]/40 to-[#00bfff]/30' : 'absolute inset-0 flex items-center justify-center'}>{a.name?.charAt(0) ?? '?'}</span>
                      </div>
                      <p className="text-white font-semibold text-[14px] truncate max-w-[5.5rem] sm:max-w-[6rem] mx-auto">{a.name}</p>
                    </>
                  );
                  return (
                    <div key={i} className="flex-shrink-0 text-center group block px-3 py-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all">
                      {singerId ? (
                        <Link href={`/singers/${singerId}`} className="block">{artistContent}</Link>
                      ) : (
                        artistContent
                      )}
                    </div>
                  );
                })}
                {artists.length === 0 && <p className="text-white/50 text-sm">No artists yet</p>}
              </div>
            </section>
          </div>

          {/* Right: Top hits + Statistics */}
          <div className="space-y-6">
            {/* Top hits */}
            <div className="home-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white tracking-tight">Top hits</h2>
                <div className="flex items-center gap-2">
                  {topHits.length > 0 && (
                    <button
                      onClick={() => play(topHits[0], topHits)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00bfff] text-black font-semibold text-[13px] hover:opacity-90 transition"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Play all
                    </button>
                  )}
                  <Link href="/" className="text-[#b3b3b3] hover:text-[#00d4ff] text-[13px] font-medium transition">See more</Link>
                </div>
              </div>
              <div className="space-y-0.5">
                {topHits.map((song, i) => {
                  const isCurrent = currentSong?._id === song._id;
                  const albumHref = song.album
                    ? `/album?album=${encodeURIComponent(song.album)}&artist=${encodeURIComponent(song.artist)}`
                    : `/album?songId=${song._id}`;
                  return (
                    <Link
                      key={song._id}
                      href={albumHref}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-all group"
                    >
                      <img src={getCoverImageUrl(song.coverImage, song._id)} alt="" className="w-10 h-10 rounded-lg object-cover shadow-md flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = getCoverImageUrl(undefined, song._id); }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate text-[14px]">{song.title}</p>
                        <p className="text-white/55 text-[13px] truncate">{formatPlays(song.playCount || 0)} plays · {formatDuration(song.duration)}</p>
                      </div>
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); play(song, topHits); }}
                        className={`p-2.5 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00bfff] text-white transition-all hover:scale-110 hover:opacity-90 ${isCurrent && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                      >
                        <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </Link>
                  );
                })}
                {topHits.length === 0 && <p className="text-white/50 text-sm py-4">No songs yet</p>}
              </div>
            </div>

          </div>
        </div>
      </div>
      )}
    </div>
  );
}
