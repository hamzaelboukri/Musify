import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AddToPlaylistProvider, useAddToPlaylist } from './AddToPlaylistDialog';

vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ user: { id: '1' } }) }));
vi.mock('@/services/playlistService', () => ({
  playlistService: { getAll: vi.fn().mockResolvedValue({ data: [] }) },
}));
vi.mock('@/utils/coverImage', () => ({
  getCoverImageUrl: () => '/cover.png',
}));

function TestConsumer() {
  const addToPlaylist = useAddToPlaylist();
  return (
    <div>
      <span data-testid="has-context">{addToPlaylist ? 'yes' : 'no'}</span>
      {addToPlaylist && (
        <button
          onClick={() => addToPlaylist.open({ _id: 's1', title: 'Song', artist: 'Artist' })}
          data-testid="open-btn"
        >
          Add
        </button>
      )}
    </div>
  );
}

describe('AddToPlaylistDialog', () => {
  beforeEach(() => vi.clearAllMocks());

  it('provides useAddToPlaylist context with open function', () => {
    render(
      <AddToPlaylistProvider>
        <TestConsumer />
      </AddToPlaylistProvider>,
    );
    expect(screen.getByTestId('has-context')).toHaveTextContent('yes');
  });

  it('opens dialog when open is called', () => {
    render(
      <AddToPlaylistProvider>
        <TestConsumer />
      </AddToPlaylistProvider>,
    );
    act(() => { fireEvent.click(screen.getByTestId('open-btn')); });
    expect(screen.getByText('Adding song')).toBeInTheDocument();
    expect(screen.getByText('Song')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Playlist name')).toBeInTheDocument();
  });
});
