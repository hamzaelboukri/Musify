import { api } from './api';

export const songService = {
  getAll: (params?: { genre?: string; artist?: string; search?: string; skip?: number; limit?: number }) =>
    api.get('/songs', { params }),
  getTrending: (limit = 10) => api.get('/songs/trending', { params: { limit } }),
  getById: (id: string) => api.get(`/songs/${id}`),
  getBySinger: (singerId: string) => api.get(`/songs/singer/${singerId}`),
};
