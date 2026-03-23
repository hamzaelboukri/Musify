import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SongCard } from './SongCard';

vi.mock('@/contexts/PlayerContext', () => ({
  usePlayer: () => ({
    play: vi.fn(),
    currentSong: null,
    isPlaying: false,
  }),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock('./AddToPlaylistDialog', () => ({
  useAddToPlaylist: () => null,
}));

vi.mock('@/utils/coverImage', () => ({
  getCoverImageUrl: (_?: string, fallback?: string) => fallback || '/placeholder.png',
}));

vi.mock('@/services/songService', () => ({
  songService: {
    getDownloadUrl: (id: string) => `/api/songs/${id}/download`,
  },
}));

const mockSong = {
  _id: 'song-1',
  title: 'Test Song',
  artist: 'Test Artist',
  audioUrl: '/audio.mp3',
  duration: 180,
  playCount: 42,
};

describe('SongCard', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders song title and artist', () => {
    render(<SongCard song={mockSong} />);
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('renders duration formatted as m:ss', () => {
    render(<SongCard song={mockSong} />);
    expect(screen.getByText('3:00')).toBeInTheDocument();
  });

  it('renders play count when present', () => {
    render(<SongCard song={mockSong} />);
    expect(screen.getByText('42 plays')).toBeInTheDocument();
  });

  it('does not render play count when absent', () => {
    const songWithoutPlays = { ...mockSong, playCount: undefined };
    render(<SongCard song={songWithoutPlays} />);
    expect(screen.queryByText(/plays/)).not.toBeInTheDocument();
  });
});
