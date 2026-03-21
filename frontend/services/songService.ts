import { api, API_BASE } from './api';

export const songService = {
  getAll: (params?: { genre?: string; artist?: string; album?: string; search?: string; skip?: number; limit?: number }) =>
    api.get('/songs', { params }),
  getCount: (params?: { genre?: string; artist?: string; album?: string; search?: string }) =>
    api.get<number>('/songs/count', { params }),
  getTrending: (limit = 10) => api.get('/songs/trending', { params: { limit } }),
  getNewReleases: (limit = 10, genre?: string) =>
    api.get('/songs/new-releases', { params: { limit, ...(genre ? { genre } : {}) } }),
  getPlatformStats: () => api.get<{ totalStreams: number; totalSongs: number; totalDownloads: number; totalLikes: number }>('/songs/stats'),
  getById: (id: string) => api.get(`/songs/${id}`),
  getBySinger: (singerId: string) => api.get(`/songs/singer/${singerId}`),
  getDownloadUrl: (songId: string) => `${API_BASE.replace(/\/$/, '')}/songs/${songId}/download`,
};
