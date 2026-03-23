import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar } from './Sidebar';

const mockUsePathname = vi.fn();
const mockUseSearchParams = vi.fn();
const mockUseAuth = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useSearchParams: () => mockUseSearchParams(),
}));

vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => mockUseAuth() }));

vi.mock('@/components/icons', () => ({ LogoutIcon: ({ className }: { className?: string }) => <span data-testid="logout-icon" className={className} /> }));
vi.mock('@/components/ThemeToggle', () => ({ ThemeToggle: () => <div data-testid="theme-toggle">Theme</div> }));

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue('/');
    mockUseSearchParams.mockReturnValue({ get: () => null });
    mockUseAuth.mockReturnValue({ user: null, logout: vi.fn() });
  });

  it('renders Musify logo and nav links', () => {
    render(<Sidebar />);
    expect(screen.getByText('Musify')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Library')).toBeInTheDocument();
    expect(screen.getByText('Liked')).toBeInTheDocument();
  });

  it('shows Dashboard link when user is SINGER', () => {
    mockUseAuth.mockReturnValue({ user: { role: 'SINGER' }, logout: vi.fn() });
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('shows Admin link when user is ADMIN', () => {
    mockUseAuth.mockReturnValue({ user: { role: 'ADMIN' }, logout: vi.fn() });
    render(<Sidebar />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('shows Log out when user is logged in', () => {
    mockUseAuth.mockReturnValue({ user: { role: 'USER' }, logout: vi.fn() });
    render(<Sidebar />);
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });
});
