import { api } from './api';

export const singerService = {
  apply: (data: { stageName: string; bio?: string }) => api.post('/singers/apply', data),
  getMyProfile: () => api.get('/singers/me'),
  getAll: () => api.get('/singers'),
  getById: (id: string) => api.get(`/singers/${id}`),
  uploadSong: (data: {
    title: string;
    artist: string;
    singerId: string;
    album?: string;
    genre?: string;
    coverImage?: string;
    audioUrl: string;
    duration: number;
  }) => api.post('/singers/songs', data),
  getMySongs: () => api.get('/singers/songs/me'),
  updateSong: (songId: string, data: Partial<{ title: string; artist: string; album: string; genre: string }>) =>
    api.patch(`/singers/songs/${songId}`, data),
  deleteSong: (songId: string) => api.delete(`/singers/songs/${songId}`),
  getStats: () => api.get('/singers/stats/me'),
};
