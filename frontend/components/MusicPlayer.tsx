'use client';

import { usePlayer } from '@/contexts/PlayerContext';

export function MusicPlayer() {
  const { currentSong, isPlaying, progress, toggle, next, prev, seek } = usePlayer();

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-musify-card/95 backdrop-blur border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 min-w-[200px]">
            <img
              src={currentSong.coverImage || 'https://picsum.photos/64'}
              alt={currentSong.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="font-medium text-white truncate">{currentSong.title}</p>
              <p className="text-sm text-white/60 truncate">{currentSong.artist}</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-center gap-4">
              <button onClick={prev} className="p-2 text-white/80 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>
              <button
                onClick={toggle}
                className="w-12 h-12 rounded-full bg-musify-accent flex items-center justify-center text-black hover:scale-105 transition"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <button onClick={next} className="p-2 text-white/80 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
            </div>
            <div className="w-full max-w-md flex items-center gap-2">
              <span className="text-xs text-white/50 w-10">
                {Math.floor((progress / 100) * (currentSong.duration || 0) / 60)}:
                {Math.floor((progress / 100) * (currentSong.duration || 0) % 60)
                  .toString()
                  .padStart(2, '0')}
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="flex-1 h-1 rounded-full appearance-none bg-white/20 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-musify-accent"
              />
              <span className="text-xs text-white/50 w-10">
                {Math.floor((currentSong.duration || 0) / 60)}:
                {((currentSong.duration || 0) % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className="min-w-[200px]" />
        </div>
      </div>
    </div>
  );
}
