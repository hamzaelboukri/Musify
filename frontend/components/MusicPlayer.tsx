'use client';

import { usePlayer } from '@/contexts/PlayerContext';
import { getCoverImageUrl } from '@/utils/coverImage';

export function MusicPlayer() {
  const { currentSong, isPlaying, progress, volume, setVolume, toggle, stop, next, prev, seek } = usePlayer();

  if (!currentSong) return null;

  const currentTime = Math.floor((progress / 100) * (currentSong.duration || 0));
  const totalTime = currentSong.duration || 0;
  const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/30 backdrop-blur-[50px] backdrop-saturate-150 border-t border-white/10 shadow-[0_-4px_40px_rgba(0,0,0,0.4)] px-4 py-2">
      <div className="max-w-[1800px] mx-auto flex items-center gap-4">
        <div className="flex items-center gap-4 min-w-[280px]">
          <img
            src={getCoverImageUrl(currentSong.coverImage)}
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
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
            <button onClick={prev} className="p-2 text-white/80 hover:text-white transition" title="Previous">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>
            <button
              onClick={toggle}
              className="relative w-14 h-14 rounded-full bg-musify-teal flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-[0_0_0_0_rgba(6,182,212,0.4),0_0_20px_rgba(6,182,212,0.5),0_0_40px_rgba(6,182,212,0.3)] hover:shadow-[0_0_0_0_rgba(6,182,212,0.5),0_0_25px_rgba(6,182,212,0.6),0_0_50px_rgba(6,182,212,0.35)]"
              title={isPlaying ? 'Pause' : 'Play'}
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
            <button onClick={next} className="p-2 text-white/80 hover:text-white transition" title="Next">
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
          <button onClick={stop} className="p-2 text-white/70 hover:text-white transition" title="Stop">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" />
            </svg>
          </button>
          <div className="flex items-center gap-2" title="Volume">
            <svg className="w-5 h-5 text-white/70 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              {volume === 0 ? (
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              ) : (
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              )}
            </svg>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="w-24 h-1.5 rounded-full appearance-none bg-white/20 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
