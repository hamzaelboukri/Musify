'use client';

import Link from 'next/link';

type Playlist = {
  _id: string;
  name: string;
  songs?: unknown[];
};

type PlaylistCardProps = {
  playlist: Playlist;
};

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const songCount = playlist.songs?.length || 0;

  return (
    <Link href={`/playlists/${playlist._id}`}>
      <div className="p-4 rounded-xl bg-musify-card hover:bg-white/5 transition cursor-pointer">
        <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-musify-teal/20 to-musify-purple/30 flex items-center justify-center">
          <svg className="w-16 h-16 text-white/60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.5c0 1.38-1.12 2.5-2.5 2.5S12 15.88 12 14.5s1.12-2.5 2.5-2.5c.57 0 1.08.19 1.5.51V2h4v4h-2v8z" />
          </svg>
        </div>
        <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
        <p className="text-sm text-white/60">{songCount} songs</p>
      </div>
    </Link>
  );
}
