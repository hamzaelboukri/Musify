'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { getCoverImageUrl } from '@/utils/coverImage';

export default function PlayerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { currentSong, queue } = usePlayer();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading) return <div className="p-8 text-center text-white/60">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">Now Playing</h1>
      {currentSong ? (
        <div className="text-center">
          <img
            src={getCoverImageUrl(currentSong.coverImage, currentSong._id || currentSong.title)}
            alt={currentSong.title}
            className="w-64 h-64 mx-auto rounded-2xl object-cover mb-6 shadow-xl"
            onError={(e) => { (e.target as HTMLImageElement).src = getCoverImageUrl(undefined, currentSong._id || currentSong.title); }}
          />
          <h2 className="text-2xl font-bold text-white">{currentSong.title}</h2>
          <p className="text-white/60 mt-1">{currentSong.artist}</p>
        </div>
      ) : (
        <p className="text-white/60 text-center">Select a song to play</p>
      )}
      {queue.length > 0 && (
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-white mb-4">Queue</h3>
          <div className="space-y-2">
            {queue.map((s, i) => (
              <div key={s._id} className="flex items-center gap-3 p-3 rounded-lg bg-musify-card">
                <span className="text-white/60 w-6">{i + 1}</span>
                <img src={getCoverImageUrl(s.coverImage, s._id || s.title)} alt="" className="w-10 h-10 rounded" onError={(e) => { (e.target as HTMLImageElement).src = getCoverImageUrl(undefined, s._id || s.title); }} />
                <div>
                  <p className="text-white font-medium">{s.title}</p>
                  <p className="text-sm text-white/60">{s.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
