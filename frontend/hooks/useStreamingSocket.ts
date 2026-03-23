'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';

export function useStreamingSocket(
  deviceId: string,
  onDeviceTakenOver: (activeDeviceId: string) => void,
) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token || !deviceId || deviceId === 'web') return;

    const socket = io(`${WS_URL}/streaming`, {
      auth: { token },
      query: { deviceId },
      transports: ['websocket', 'polling'],
    });

    socket.on('device_taken_over', (data: { activeDeviceId: string }) => {
      if (data.activeDeviceId && data.activeDeviceId !== deviceId) {
        onDeviceTakenOver(data.activeDeviceId);
      }
    });

    socketRef.current = socket;
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [deviceId, onDeviceTakenOver]);
}
