'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-musify-dark/90 backdrop-blur border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/home" className="text-2xl font-bold text-musify-accent">
          Musify
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/home" className="text-white/80 hover:text-white transition">Home</Link>
          <Link href="/player" className="text-white/80 hover:text-white transition">Player</Link>
          {user?.role === 'USER' && (
            <>
              <Link href="/playlists" className="text-white/80 hover:text-white transition">Playlists</Link>
              <Link href="/favorites" className="text-white/80 hover:text-white transition">Favorites</Link>
              <Link href="/profile" className="text-white/80 hover:text-white transition">Profile</Link>
            </>
          )}
          {user?.role === 'SINGER' && (
            <Link href="/singer-dashboard" className="text-white/80 hover:text-white transition">Dashboard</Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link href="/admin-dashboard" className="text-white/80 hover:text-white transition">Admin</Link>
          )}
          {user ? (
            <button
              onClick={logout}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/"
              className="px-4 py-2 rounded-full bg-musify-accent hover:bg-cyan-400 text-black font-medium transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
