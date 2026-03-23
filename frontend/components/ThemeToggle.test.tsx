import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

const mockToggleTheme = vi.fn();
vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'dark', toggleTheme: mockToggleTheme }),
}));

describe('ThemeToggle', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls toggleTheme on click', () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it('has aria-label for accessibility', () => {
    render(<ThemeToggle />);
    expect(screen.getByLabelText(/Switch to light mode/i)).toBeInTheDocument();
  });
});
