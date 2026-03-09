import { api } from './api';

export const streamService = {
  start: (deviceId: string, accessToken: string, action: 'stop_previous' | 'block_new' = 'stop_previous') =>
    api.post('/streaming/start', { deviceId, accessToken, action }),
  stop: (deviceId?: string) => api.delete('/streaming/stop', { data: { deviceId } }),
  check: (deviceId: string) => api.post('/streaming/check', { deviceId }),
  recordPlay: (songId: string, deviceId: string) => api.post('/streaming/play', { songId, deviceId }),
};
