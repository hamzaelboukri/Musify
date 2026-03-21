'use client';

import { usePlayer } from '@/contexts/PlayerContext';
import { useEffect } from 'react';

export function DeviceTakenOverToast() {
  const { deviceTakenOverMessage, dismissDeviceTakenOverMessage } = usePlayer();

  useEffect(() => {
    if (!deviceTakenOverMessage) return;
    const t = setTimeout(dismissDeviceTakenOverMessage, 5000);
    return () => clearTimeout(t);
  }, [deviceTakenOverMessage, dismissDeviceTakenOverMessage]);

  if (!deviceTakenOverMessage) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-500/95 dark:bg-amber-600/95 text-white shadow-lg border border-amber-400/50 max-w-md">
        <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4h2V7h-2v6z" />
        </svg>
        <p className="text-sm font-medium flex-1">{deviceTakenOverMessage}</p>
        <button
          onClick={dismissDeviceTakenOverMessage}
          className="p-1 hover:bg-white/20 rounded transition"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
