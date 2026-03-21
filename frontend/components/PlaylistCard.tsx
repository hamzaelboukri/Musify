'use client';

import Link from 'next/link';

type Playlist = {
  _id: string;
  name: string;
  songs?: unknown[];
};

type PlaylistCardProps = {
  playlist: Playlist;
  onDelete?: (id: string) => void;
};

export function PlaylistCard({ playlist, onDelete }: PlaylistCardProps) {
  const songCount = playlist.songs?.length || 0;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete && confirm(`Delete playlist "${playlist.name}"?`)) {
      onDelete(playlist._id);
    }
  };

  return (
    <Link href={`/playlists/${playlist._id}`} className="block group relative">
      <div className="p-4 rounded-xl bg-musify-card hover:bg-white/5 transition cursor-pointer">
        <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-musify-teal/20 to-musify-purple/30 flex items-center justify-center relative">
          <svg className="w-16 h-16 text-white/60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.5c0 1.38-1.12 2.5-2.5 2.5S12 15.88 12 14.5s1.12-2.5 2.5-2.5c.57 0 1.08.19 1.5.51V2h4v4h-2v8z" />
          </svg>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="absolute top-2 right-2 p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition z-10"
              title="Delete playlist"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
            </button>
          )}
        </div>
        <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
        <p className="text-sm text-white/60">{songCount} songs</p>
      </div>
    </Link>
  );
}
