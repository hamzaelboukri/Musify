'use client';

import { usePlayer } from '@/contexts/PlayerContext';

type Song = {
  _id: string;
  title: string;
  artist: string;
  coverImage?: string;
  audioUrl: string;
  duration: number;
};

type AlbumCardProps = {
  song: Song;
};

export function AlbumCard({ song }: AlbumCardProps) {
  const { play, currentSong, isPlaying } = usePlayer();
  const isCurrent = currentSong?._id === song._id;
  const image = song.coverImage || 'https://picsum.photos/200';

  return (
    <div
      className="group p-4 rounded-lg bg-musify-card hover:bg-musify-card-hover transition cursor-pointer"
      onClick={() => play(song)}
    >
      <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-white/5">
        <img
          src={image}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition ${
            isCurrent && isPlaying ? 'opacity-100' : ''
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-musify-accent flex items-center justify-center shadow-lg shadow-cyan-500/40 hover:scale-110 transition">
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
      </div>
      <h3 className="font-semibold text-white truncate">{song.title}</h3>
      <p className="text-sm text-white/60 truncate mt-0.5">{song.artist}</p>
    </div>
  );
}
