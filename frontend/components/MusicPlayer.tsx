'use client';

import { usePlayer } from '@/contexts/PlayerContext';
import { useState } from 'react';

export function MusicPlayer() {
  const { currentSong, isPlaying, progress, toggle, next, prev, seek } = usePlayer();
  const [volume, setVolume] = useState(70);

  if (!currentSong) return null;

  const currentTime = Math.floor((progress / 100) * (currentSong.duration || 0));
  const totalTime = currentSong.duration || 0;
  const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/30 backdrop-blur-[50px] backdrop-saturate-150 border-t border-white/10 shadow-[0_-4px_40px_rgba(0,0,0,0.4)] px-4 py-2">
      <div className="max-w-[1800px] mx-auto flex items-center gap-4">
        <div className="flex items-center gap-4 min-w-[280px]">
          <img
            src={currentSong.coverImage || '/placeholder.svg'}
            alt={currentSong.title}
            className="w-14 h-14 rounded-md object-cover shadow-lg"
          />
          <div className="min-w-0">
            <p className="font-medium text-white truncate">{currentSong.title}</p>
            <p className="text-sm text-white/60 truncate">{currentSong.artist}</p>
          </div>
          <button className="p-2 text-white/70 hover:text-musify-accent transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center gap-1 max-w-[722px]">
          <div className="flex items-center gap-6">
            <button className="p-1 text-white/70 hover:text-white transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
              </svg>
            </button>
            <button onClick={prev} className="p-2 text-white/80 hover:text-white transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>
            <button
              onClick={toggle}
              className="relative w-14 h-14 rounded-full bg-musify-teal flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-[0_0_0_0_rgba(6,182,212,0.4),0_0_20px_rgba(6,182,212,0.5),0_0_40px_rgba(6,182,212,0.3)] hover:shadow-[0_0_0_0_rgba(6,182,212,0.5),0_0_25px_rgba(6,182,212,0.6),0_0_50px_rgba(6,182,212,0.35)]"
            >
              {isPlaying ? (
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button onClick={next} className="p-2 text-white/80 hover:text-white transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
            <button className="p-1 text-white/70 hover:text-white transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
              </svg>
            </button>
          </div>
          <div className="w-full flex items-center gap-2">
            <span className="text-xs text-white/60 w-10">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => seek(parseFloat(e.target.value))}
              style={{
                background: `linear-gradient(to right, rgb(6 182 212) 0%, rgb(6 182 212) ${progress}%, rgba(255,255,255,0.2) ${progress}%)`,
              }}
              className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-musify-teal [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(6,182,212,0.6),0_0_4px_rgba(6,182,212,0.4)] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-musify-teal [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-[0_0_12px_rgba(6,182,212,0.6)]"
            />
            <span className="text-xs text-white/60 w-10">{formatTime(totalTime)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 min-w-[180px] justify-end">
          <button className="p-2 text-white/70 hover:text-white transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </button>
          <button className="p-2 text-white/70 hover:text-white transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="w-24 h-1 rounded-full appearance-none bg-white/20 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
