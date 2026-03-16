'use client';

import { usePlayer } from '@/contexts/PlayerContext';
import { useAddToPlaylist } from './AddToPlaylistDialog';
import { useAuth } from '@/contexts/AuthContext';
import { getCoverImageUrl } from '@/utils/coverImage';

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
  queue?: Song[];
  onFavorite?: (songId: string) => void;
  isFavorite?: boolean;
};

export function SongCard({ song, queue, onFavorite, isFavorite }: SongCardProps) {
  const { play, currentSong, isPlaying } = usePlayer();
  const imageUrl = getCoverImageUrl(song.coverImage, song._id || song.title);
  const addToPlaylist = useAddToPlaylist();
  const { user } = useAuth();
  const isCurrent = currentSong?._id === song._id;

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="group p-4 rounded-xl bg-[#1e1e22] hover:bg-[#28282e] border border-white/5 transition-all cursor-pointer"
      onClick={() => play(song, queue)}
    >
        <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-[#2a2a2e] shadow-lg">
        <img
          src={imageUrl}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-105 transition"
          onError={(e) => { (e.target as HTMLImageElement).src = getCoverImageUrl(undefined, song._id || song.title); }}
        />
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition ${
            isCurrent && isPlaying ? 'opacity-100' : ''
          }`}
        >
          <div className="play-btn-glow w-14 h-14 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00bfff] flex items-center justify-center">
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
        {addToPlaylist && user && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToPlaylist.open(song);
            }}
            className="absolute top-2 left-2 p-2 rounded-full bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition"
            title="Add to playlist"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
            </svg>
          </button>
        )}
        {onFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(song._id);
            }}
            className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70"
          >
            {isFavorite ? (
              <svg className="w-5 h-5 text-[#00d4ff]" fill="currentColor" viewBox="0 0 24 24">
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
