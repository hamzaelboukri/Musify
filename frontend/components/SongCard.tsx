'use client';

import { usePlayer } from '@/contexts/PlayerContext';

type Song = {
  _id: string;
  title: string;
  artist: string;
  coverImage?: string;
  audioUrl: string;
  duration: number;
  playCount?: number;
};

type SongCardProps = {
  song: Song;
  onFavorite?: (songId: string) => void;
  isFavorite?: boolean;
};

export function SongCard({ song, onFavorite, isFavorite }: SongCardProps) {
  const { play, currentSong, isPlaying } = usePlayer();
  const isCurrent = currentSong?._id === song._id;

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="group p-4 rounded-xl bg-musify-card hover:bg-white/5 transition cursor-pointer"
      onClick={() => play(song)}
    >
      <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-white/5">
        <img
          src={song.coverImage || 'https://picsum.photos/200'}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition ${
            isCurrent && isPlaying ? 'opacity-100' : ''
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-musify-accent flex items-center justify-center">
            {isCurrent && isPlaying ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </div>
        {onFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(song._id);
            }}
            className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70"
          >
            {isFavorite ? (
              <svg className="w-5 h-5 text-musify-accent" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
        )}
      </div>
      <h3 className="font-semibold text-white truncate">{song.title}</h3>
      <p className="text-sm text-white/60 truncate">{song.artist}</p>
      <div className="flex justify-between mt-1 text-xs text-white/40">
        <span>{formatDuration(song.duration)}</span>
        {song.playCount != null && <span>{song.playCount} plays</span>}
      </div>
    </div>
  );
}
