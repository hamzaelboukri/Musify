import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AlbumCard } from './AlbumCard';

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

const mockSong = {
  _id: 'song-1',
  title: 'Album Track',
  artist: 'Test Artist',
  album: 'My Album',
  audioUrl: '/audio.mp3',
  duration: 200,
};

describe('AlbumCard', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders song title and artist', () => {
    render(<AlbumCard song={mockSong} />);
    expect(screen.getByText('Album Track')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('links to album page with album and artist params', () => {
    render(<AlbumCard song={mockSong} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/album?album=My%20Album&artist=Test%20Artist');
  });

  it('shows duration when formatDuration provided', () => {
    const formatDuration = (sec: number) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;
    render(<AlbumCard song={mockSong} showDuration formatDuration={formatDuration} />);
    expect(screen.getByText(/3:20/)).toBeInTheDocument();
  });
});
