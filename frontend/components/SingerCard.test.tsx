import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SingerCard } from './SingerCard';

vi.mock('@/utils/coverImage', () => ({
  getCoverImageUrl: (_?: string, fallback?: string) => fallback || '/placeholder.png',
}));

describe('SingerCard', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders singer stage name', () => {
    render(<SingerCard singer={{ _id: 's1', stageName: 'Artist Name' }} />);
    expect(screen.getByText('Artist Name')).toBeInTheDocument();
  });

  it('renders bio when provided', () => {
    render(
      <SingerCard singer={{ _id: 's1', stageName: 'Artist', bio: 'Singer bio text' }} />,
    );
    expect(screen.getByText('Singer bio text')).toBeInTheDocument();
  });

  it('links to singer page', () => {
    render(<SingerCard singer={{ _id: 's1', stageName: 'Artist' }} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/singers/s1');
  });
});
