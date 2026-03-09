'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useSearch } from '@/contexts/SearchContext';

export function TopHeader() {
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <header className="sticky top-0 z-20 bg-musify-dark/90 backdrop-blur-md px-6 py-4 flex items-center justify-between gap-4 border-b border-white/5">
      <div className="flex items-center gap-4 flex-1">
        <button className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        <button className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
          </svg>
        </button>
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="What do you want to play?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md px-4 py-2.5 pl-10 rounded-full bg-white/10 text-white placeholder-musify-text-muted focus:outline-none focus:ring-2 focus:ring-musify-accent/50"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>
        </form>
      </div>
      <div className="flex items-center gap-2">
        <button className="px-4 py-2 rounded-full bg-musify-frosted hover:bg-musify-accent/20 text-white text-sm font-medium transition border border-musify-accent/30">
          Explore Premium
        </button>
        <button className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
          </svg>
        </button>
        {user ? (
          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition"
            >
              Logout
            </button>
            <Link href="/profile" className="w-8 h-8 rounded-full bg-gradient-to-br from-musify-teal to-musify-purple flex items-center justify-center text-white font-bold ring-2 ring-musify-accent/30">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </Link>
          </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-musify-teal to-musify-purple hover:opacity-90 text-white font-medium transition"
            >
              Login
            </Link>
          )}
      </div>
    </header>
  );
}
