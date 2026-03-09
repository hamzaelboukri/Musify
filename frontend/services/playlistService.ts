import { api } from './api';

export const playlistService = {
  create: (name: string) => api.post('/playlists', { name }),
  getAll: () => api.get('/playlists'),
  getById: (id: string) => api.get(`/playlists/${id}`),
  update: (id: string, name: string) => api.patch(`/playlists/${id}`, { name }),
  delete: (id: string) => api.delete(`/playlists/${id}`),
  addSong: (playlistId: string, songId: string) =>
    api.post(`/playlists/${playlistId}/songs/${songId}`),
  removeSong: (playlistId: string, songId: string) =>
    api.delete(`/playlists/${playlistId}/songs/${songId}`),
};
