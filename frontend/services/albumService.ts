import { api } from './api';

export const albumService = {
  create: (data: { name: string; coverImage?: string }) =>
    api.post<{ _id: string; name: string; artist: string; songs: unknown[] }>('/albums', data),
  getMyAlbums: () =>
    api.get<{ _id: string; name: string; artist: string; coverImage?: string; songs: unknown[] }[]>('/albums/me'),
  getById: (id: string) =>
    api.get<{ _id: string; name: string; artist: string; coverImage?: string; songs: unknown[] }>(`/albums/${id}`),
  addSong: (albumId: string, songId: string) =>
    api.post(`/albums/${albumId}/songs/${songId}`),
  removeSong: (albumId: string, songId: string) =>
    api.delete(`/albums/${albumId}/songs/${songId}`),
  deleteAlbum: (albumId: string) =>
    api.delete(`/albums/${albumId}`),
};
