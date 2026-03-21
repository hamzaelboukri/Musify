'use client';

import { usePlayer } from '@/contexts/PlayerContext';
import { songService } from '@/services/songService';

export function MusicPlayer() {
  const { currentSong, isPlaying, progress, volume, setVolume, toggle, stop, next, prev, seek } = usePlayer();

  if (!currentSong) return null;

  const currentTime = Math.floor((progress / 100) * (currentSong.duration || 0));
  const totalTime = currentSong.duration || 0;
  const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#121212]/98 backdrop-blur-sm border-t border-white/5 px-4 py-2">
      <div className="max-w-[1800px] mx-auto flex items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-4">
            <button className="p-1 text-[#b3b3b3] hover:text-white transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm4 5 4 4V7l-4 4zm4-2v6h2V9h-2z" />
              </svg>
            </button>
            <button onClick={prev} className="p-2 text-[#b3b3b3] hover:text-white transition" title="Previous">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>
            <button
              onClick={toggle}
              className="relative w-12 h-12 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00bfff] flex items-center justify-center text-black hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#00d4ff]/40"
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
            <button onClick={next} className="p-2 text-[#b3b3b3] hover:text-white transition" title="Next">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
            <button className="p-1 text-[#b3b3b3] hover:text-white transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>
          <div className="w-full flex items-center gap-2">
            <span className="text-xs text-[#b3b3b3] w-10">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => seek(parseFloat(e.target.value))}
              style={{
                background: `linear-gradient(to right, #00d4ff 0%, #00bfff ${progress}%, rgba(255,255,255,0.15) ${progress}%)`,
              }}
              className="flex-1 h-1 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_#181818] [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
            />
            <span className="text-xs text-[#b3b3b3] w-10">{formatTime(totalTime)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={songService.getDownloadUrl(currentSong._id)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[#b3b3b3] hover:text-white transition"
            title="Download"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
          <button onClick={stop} className="p-2 text-[#b3b3b3] hover:text-white transition" title="Stop">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" />
            </svg>
          </button>
          <div className="flex items-center gap-2" title="Volume">
            <svg className="w-5 h-5 text-[#b3b3b3] shrink-0" fill="currentColor" viewBox="0 0 24 24">
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
              className="w-24 h-1 rounded-full appearance-none bg-white/30 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
