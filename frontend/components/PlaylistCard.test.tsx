import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlaylistCard } from './PlaylistCard';

describe('PlaylistCard', () => {
  beforeEach(() => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
  });

  it('renders playlist name and song count', () => {
    render(<PlaylistCard playlist={{ _id: 'p1', name: 'My Playlist', songs: [{}, {}] }} />);
    expect(screen.getByText('My Playlist')).toBeInTheDocument();
    expect(screen.getByText('2 songs')).toBeInTheDocument();
  });

  it('links to playlist page', () => {
    render(<PlaylistCard playlist={{ _id: 'p1', name: 'Test' }} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/playlists/p1');
  });

  it('shows 0 songs when songs array is empty', () => {
    render(<PlaylistCard playlist={{ _id: 'p1', name: 'Empty', songs: [] }} />);
    expect(screen.getByText('0 songs')).toBeInTheDocument();
  });
});
