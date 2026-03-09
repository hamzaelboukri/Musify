import { api } from './api';

export const favoriteService = {
  getAll: () => api.get('/favorites'),
  add: (songId: string) => api.post(`/favorites/${songId}`),
  remove: (songId: string) => api.delete(`/favorites/${songId}`),
  check: (songId: string) => api.get(`/favorites/check/${songId}`),
};
