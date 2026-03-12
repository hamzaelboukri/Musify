import { api } from './api';

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (skip = 0, limit = 20) => api.get('/admin/users', { params: { skip, limit } }),
  banUser: (userId: string) => api.post(`/admin/users/${userId}/ban`),
  unbanUser: (userId: string) => api.post(`/admin/users/${userId}/unban`),
  getPendingSingers: () => api.get('/admin/singers/pending'),
  approveSinger: (singerId: string) => api.post(`/admin/singers/${singerId}/approve`),
  rejectSinger: (singerId: string) => api.post(`/admin/singers/${singerId}/reject`),
  getPendingSongs: () => api.get('/admin/songs/pending'),
  getAllSongs: (skip = 0, limit = 100) => api.get('/admin/songs', { params: { skip, limit } }),
  approveSong: (songId: string) => api.post(`/admin/songs/${songId}/approve`),
  deleteSong: (songId: string) => api.delete(`/admin/songs/${songId}`),
  getSessions: () => api.get('/admin/sessions'),
};
