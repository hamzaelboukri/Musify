import { api } from './api';

export const userService = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: { name?: string; email?: string }) => api.patch('/users/me', data),
  followSinger: (singerId: string) => api.post(`/users/follow/${singerId}`),
  unfollowSinger: (singerId: string) => api.post(`/users/unfollow/${singerId}`),
};
