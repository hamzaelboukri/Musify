import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MusicPlayer } from './MusicPlayer';

const mockUsePlayer = vi.fn();
vi.mock('@/contexts/PlayerContext', () => ({ usePlayer: () => mockUsePlayer() }));

vi.mock('@/services/songService', () => ({
  songService: { getDownloadUrl: (id: string) => `/api/songs/${id}/download` },
}));

describe('MusicPlayer', () => {
  const defaultPlayer = {
    currentSong: null,
    isPlaying: false,
    progress: 0,
    volume: 70,
    setVolume: vi.fn(),
    toggle: vi.fn(),
    stop: vi.fn(),
    next: vi.fn(),
    prev: vi.fn(),
    seek: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePlayer.mockReturnValue(defaultPlayer);
  });

  it('renders nothing when no current song', () => {
    const { container } = render(<MusicPlayer />);
    expect(container.firstChild).toBeNull();
  });

  it('renders player UI when currentSong is set', () => {
    mockUsePlayer.mockReturnValue({
      ...defaultPlayer,
      currentSong: { _id: '1', title: 'Song', artist: 'Artist', audioUrl: '/a.mp3', duration: 180 },
      isPlaying: true,
      progress: 50,
    });
    render(<MusicPlayer />);
    expect(screen.getByTitle('Pause')).toBeInTheDocument();
    expect(screen.getByTitle('Previous')).toBeInTheDocument();
  });
});
