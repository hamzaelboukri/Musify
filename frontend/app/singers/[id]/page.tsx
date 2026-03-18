'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { singerService } from '@/services/singerService';
import { songService } from '@/services/songService';
import { usePlayer } from '@/contexts/PlayerContext';
import { getCoverImageUrl } from '@/utils/coverImage';
import { BackIcon, PlayIcon, AddIcon, MoreVerticalIcon, ClockIcon } from '@/components/icons';

type Singer = {
  _id: string;
  stageName: string;
  bio?: string;
  image?: string;
};

type Song = {
  _id: string;
  title: string;
  artist: string;
  album?: string;
  coverImage?: string;
  audioUrl: string;
  duration: number;
  playCount?: number;
  createdAt?: string;
};

export default function SingerProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const { play, currentSong, isPlaying } = usePlayer();
  const [singer, setSinger] = useState<Singer | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const [singerRes, songsRes] = await Promise.all([
          singerService.getById(id),
          songService.getBySinger(id),
        ]);
        setSinger(singerRes.data as Singer);
        setSongs((songsRes.data as Song[]) || []);
      } catch (err) {
        setSinger(null);
        setSongs([]);
        setError((err as { response?: { status?: number } })?.response?.status === 404 ? 'Artist not found' : 'Failed to load artist');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatPlays = (n: number) =>
    n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

  const totalDuration = songs.reduce((a, s) => a + s.duration, 0);
  const totalMins = Math.floor(totalDuration / 60);
  const totalSecs = Math.floor(totalDuration % 60);
  const durationStr = `${totalMins} min ${totalSecs.toString().padStart(2, '0')} s`;
  const totalPlays = songs.reduce((a, s) => a + (s.playCount || 0), 0);

  const coverImage = singer ? getCoverImageUrl(singer.image, singer._id || singer.stageName) : '';

  const handlePlay = () => {
    if (songs.length) play(songs[0], songs);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="h-[70vh] bg-gradient-to-b from-musify-teal/20 via-musify-purple/10 to-musify-darker animate-pulse" />
        <div className="relative -mt-32 px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-white/10 flex-shrink-0 mx-auto sm:mx-0" />
            <div className="flex-1 space-y-4">
              <div className="h-4 w-32 bg-white/10 rounded" />
              <div className="h-12 w-64 bg-white/10 rounded" />
              <div className="h-5 w-40 bg-white/10 rounded" />
              <div className="flex gap-4 mt-6">
                <div className="w-14 h-14 rounded-full bg-white/10" />
                <div className="w-10 h-10 rounded-full bg-white/10" />
                <div className="w-10 h-10 rounded-full bg-white/10" />
              </div>
            </div>
          </div>
          <div className="mt-12 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !singer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
        <div className="w-24 h-24 rounded-full bg-musify-teal/20 flex items-center justify-center">
          <svg className="w-12 h-12 text-musify-teal/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <p className="text-xl font-medium text-white/80">{error || 'Artist not found'}</p>
        <p className="text-white/50 text-sm max-w-sm text-center">
          This artist might not exist or has been removed.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-full bg-musify-teal hover:bg-musify-accent-hover text-white font-semibold transition"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero */}
      <div className="relative h-[85vh] min-h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 blur-3xl opacity-40"
          style={{ backgroundImage: `url(${coverImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-musify-darker/60 to-musify-darker" />
        <div className="absolute inset-0 bg-gradient-to-r from-musify-teal/30 via-transparent to-musify-purple/20" />

        <Link
          href="/"
          className="absolute top-6 left-6 z-10 p-2.5 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm transition"
        >
          <BackIcon className="w-5 h-5 text-white" />
        </Link>

        <div className="relative h-full flex flex-col justify-end px-6 sm:px-10 lg:px-16 pb-8 pt-20">
          <div className="flex flex-col sm:flex-row items-end gap-8">
            <div className="relative flex-shrink-0 group mx-auto sm:mx-0">
              <div className="absolute -inset-1 bg-musify-teal/30 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition" />
              <img
                src={coverImage}
                alt={singer.stageName}
                className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full object-cover shadow-2xl shadow-black/50 ring-2 ring-white/10"
                onError={(e) => { (e.target as HTMLImageElement).src = getCoverImageUrl(undefined, singer._id || singer.stageName); }}
              />
            </div>

            <div className="flex-1 min-w-0 text-center sm:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium uppercase tracking-wider mb-3">
                Artist
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-lg">
                {singer.stageName}
              </h1>
              {singer.bio && (
                <p className="mt-4 text-white/80 max-w-xl">{singer.bio}</p>
              )}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4 text-white/60 text-sm">
                <span>{songs.length} track{songs.length !== 1 ? 's' : ''}</span>
                {songs.length > 0 && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span>{durationStr}</span>
                    {totalPlays > 0 && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-white/40" />
                        <span className="text-musify-teal font-medium">{formatPlays(totalPlays)} plays</span>
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-4 mt-6">
                <button
                  onClick={handlePlay}
                  disabled={!songs.length}
                  className="w-16 h-16 rounded-full bg-musify-teal hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg shadow-musify-teal/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <PlayIcon className="w-8 h-8 text-white ml-1" />
                </button>
                <button className="w-12 h-12 rounded-full border-2 border-white/30 hover:border-white/60 flex items-center justify-center text-white/90 hover:text-white hover:scale-105 transition-all">
                  <AddIcon className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition">
                  <MoreVerticalIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tracklist */}
      <div className="relative px-6 sm:px-10 lg:px-16 py-8 -mt-4">
        {songs.length > 0 ? (
          <>
            <div className="grid grid-cols-[48px_1fr_80px] gap-4 py-3 px-4 border-b border-white/10 text-white/50 text-sm font-medium">
              <span className="text-center">#</span>
              <span>Title</span>
              <span className="flex justify-end">
                <ClockIcon className="w-4 h-4" />
              </span>
            </div>

            <div className="mt-1">
              {songs.map((song, i) => {
                const isCurrent = currentSong?._id === song._id;
                return (
                  <div
                    key={song._id}
                    onClick={() => play(song, songs)}
                    className={`group grid grid-cols-[48px_1fr_80px] gap-4 py-3 px-4 -mx-4 rounded-xl cursor-pointer transition-all duration-200 ${
                      isCurrent ? 'bg-white/10 text-musify-teal' : 'hover:bg-white/5 text-white/90'
                    }`}
                  >
                    <span className="flex items-center justify-center text-white/40 group-hover:text-white/60 text-sm font-medium">
                      <span className="group-hover:hidden">{i + 1}</span>
                      <span className="hidden group-hover:flex items-center justify-center">
                        {isCurrent && isPlaying ? (
                          <svg className="w-5 h-5 text-musify-teal" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                          </svg>
                        ) : (
                          <PlayIcon className="w-5 h-5" />
                        )}
                      </span>
                    </span>
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={getCoverImageUrl(song.coverImage || singer.image, song._id || song.title)}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0 hidden sm:block"
                        onError={(e) => { (e.target as HTMLImageElement).src = getCoverImageUrl(undefined, song._id || song.title); }}
                      />
                      <div className="min-w-0">
                        <p className={`font-medium truncate ${isCurrent ? 'text-musify-teal' : 'text-white'}`}>
                          {song.title}
                        </p>
                        <p className="text-white/50 text-sm truncate">{song.artist}</p>
                      </div>
                    </div>
                    <span className="flex items-center justify-end text-white/50 text-sm">
                      {formatDuration(song.duration)}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="py-16 text-center">
            <p className="text-white/50">No tracks yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
