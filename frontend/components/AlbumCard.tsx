'use client';

import Link from 'next/link';
import { usePlayer } from '@/contexts/PlayerContext';
import { getCoverImageUrl } from '@/utils/coverImage';
import { useAddToPlaylist } from './AddToPlaylistDialog';
import { useAuth } from '@/contexts/AuthContext';

type Song = {
  _id: string;
  title: string;
  artist: string;
  album?: string;
  coverImage?: string;
  audioUrl: string;
  duration: number;
};

type AlbumCardProps = {
  song: Song;
};

function albumHref(song: Song) {
  const album = song.album || song.title;
  const artist = encodeURIComponent(song.artist);
  if (album) {
    return `/album?album=${encodeURIComponent(album)}&artist=${artist}`;
  }
  return `/album?songId=${song._id}`;
}

export function AlbumCard({ song }: AlbumCardProps) {
  const { play, currentSong, isPlaying } = usePlayer();
  const addToPlaylist = useAddToPlaylist();
  const { user } = useAuth();
  const isCurrent = currentSong?._id === song._id;
  const image = getCoverImageUrl(song.coverImage, song._id || song.title);

  return (
    <Link
      href={albumHref(song)}
      className="album-card-premium group block p-4 cursor-pointer"
    >
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-[#2a2a2e] shadow-xl">
        <img
          src={image}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
        />
        {addToPlaylist && user && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToPlaylist.open(song);
            }}
            className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition z-10"
            title="Add to playlist"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
            </svg>
          </button>
        )}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition ${
            isCurrent && isPlaying ? 'opacity-100' : ''
          }`}
        >
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              play(song);
            }}
            className="play-btn-glow w-14 h-14 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00bfff] flex items-center justify-center hover:scale-110 transition-all duration-200 cursor-pointer"
          >
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
      <h3 className="font-semibold text-white truncate text-[15px]">{song.title}</h3>
      <p className="text-sm text-white/55 truncate mt-1">{song.artist}</p>
    </Link>
  );
}
