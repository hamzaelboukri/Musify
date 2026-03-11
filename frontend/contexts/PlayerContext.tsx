'use client';

import React, { createContext, useContext, useCallback, useState, useRef, useEffect } from 'react';
import { streamService } from '@/services/streamService';
import { favoriteService } from '@/services/favoriteService';

type Song = {
  _id: string;
  title: string;
  artist: string;
  coverImage?: string;
  audioUrl: string;
  duration: number;
};

type PlayerContextType = {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  setVolume: (v: number) => void;
  queue: Song[];
  play: (song: Song, queue?: Song[]) => void;
  pause: () => void;
  toggle: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  seek: (percent: number) => void;
  addToQueue: (song: Song) => void;
  deviceId: string;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('musify_volume');
      return saved ? parseInt(saved, 10) : 70;
    }
    return 70;
  });
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [deviceId, setDeviceId] = useState('web');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(100, v));
    setVolumeState(clamped);
    if (audioRef.current) audioRef.current.volume = clamped / 100;
    if (typeof window !== 'undefined') localStorage.setItem('musify_volume', String(clamped));
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    let id = localStorage.getItem('musify_device_id');
    if (!id) {
      id = 'web_' + Math.random().toString(36).slice(2) + Date.now();
      localStorage.setItem('musify_device_id', id);
    }
    setDeviceId(id);
  }, []);

  const startStreamSession = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        await streamService.start(deviceId, token, 'stop_previous');
      } catch (e) {
        console.warn('Stream session start failed:', e);
      }
    }
  }, [deviceId]);

  const recordPlay = useCallback(
    async (songId: string) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          await streamService.recordPlay(songId, deviceId);
        } catch (e) {
          console.warn('Record play failed:', e);
        }
      }
    },
    [deviceId]
  );

  const play = useCallback(
    (song: Song, newQueue?: Song[]) => {
      const q = newQueue && newQueue.length > 0 ? newQueue : [song];
      const idx = q.findIndex((s) => s._id === song._id);
      const queueIndexToUse = idx >= 0 ? idx : 0;
      setCurrentSong(song);
      setQueue(q);
      setQueueIndex(queueIndexToUse);
      setProgress(0);
      setIsPlaying(true);
      startStreamSession();
      recordPlay(song._id);
      if (audioRef.current) {
        audioRef.current.volume = volume / 100;
        audioRef.current.src = song.audioUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    },
    [startStreamSession, recordPlay, volume]
  );

  const pause = useCallback(() => {
    setIsPlaying(false);
    audioRef.current?.pause();
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentSong(null);
    setQueue([]);
    setQueueIndex(0);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.currentTime = 0;
    }
  }, []);

  const toggle = useCallback(() => {
    if (!currentSong) return;
    if (isPlaying) pause();
    else {
      setIsPlaying(true);
      audioRef.current?.play();
    }
  }, [currentSong, isPlaying, pause]);

  const next = useCallback(() => {
    if (queueIndex < queue.length - 1) {
      const nextSong = queue[queueIndex + 1];
      setQueueIndex((i) => i + 1);
      setCurrentSong(nextSong);
      setProgress(0);
      setIsPlaying(true);
      recordPlay(nextSong._id);
      if (audioRef.current) {
        audioRef.current.volume = volume / 100;
        audioRef.current.src = nextSong.audioUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      pause();
    }
  }, [queue, queueIndex, pause, recordPlay, volume]);

  const prev = useCallback(() => {
    if (progress > 3) {
      setProgress(0);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (queueIndex > 0) {
      const prevSong = queue[queueIndex - 1];
      setQueueIndex((i) => i - 1);
      setCurrentSong(prevSong);
      setProgress(0);
      setIsPlaying(true);
      recordPlay(prevSong._id);
      if (audioRef.current) {
        audioRef.current.volume = volume / 100;
        audioRef.current.src = prevSong.audioUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    }
  }, [queue, queueIndex, progress, recordPlay, volume]);

  const seek = useCallback((percent: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = (percent / 100) * audio.duration;
      setProgress(percent);
    }
  }, []);

  const addToQueue = useCallback((song: Song) => {
    setQueue((q) => (q.some((s) => s._id === song._id) ? q : [...q, song]));
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        progress,
        volume,
        setVolume,
        queue,
        play,
        pause,
        toggle,
        stop,
        next,
        prev,
        seek,
        addToQueue,
        deviceId,
      }}
    >
      {children}
      <audio
        ref={(el) => {
          audioRef.current = el;
          if (el) {
            el.volume = volume / 100;
            el.onended = next;
            el.ontimeupdate = () => {
              if (el.duration) setProgress((el.currentTime / el.duration) * 100);
            };
          }
        }}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
