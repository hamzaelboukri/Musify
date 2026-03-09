import { api } from './api';

export const statsService = {
  getHistory: (limit = 50) => api.get('/stats/history', { params: { limit } }),
};
