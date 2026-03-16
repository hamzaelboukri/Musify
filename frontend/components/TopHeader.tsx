'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSearch } from '@/contexts/SearchContext';

export function TopHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { searchQuery, setSearchQuery } = useSearch();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (pathname === '/search') router.push('/');
  };

  return (
    <header className="sticky top-0 z-20 bg-[#121212]/80 backdrop-blur-md px-6 py-4 flex items-center gap-6 border-b border-white/5">
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            placeholder="Search songs, artists, albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-2.5 rounded-full bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 border border-transparent"
            aria-label="Search"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          ) : (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-xs">↵</span>
          )}
        </div>
      </form>

      <div className="flex items-center gap-2 shrink-0">
        <Link href="/favorites" className="p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </Link>
        <button className="p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
        </button>
        {user ? (
          <Link href={user.role === 'SINGER' ? '/singer-dashboard?nav=profile' : '/profile'} className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-white/10 transition">
            <div className="w-8 h-8 rounded-full bg-[#535353] flex items-center justify-center text-white font-bold text-sm">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </Link>
        ) : (
          <Link href="/login" className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:scale-105 transition">
            Log in
          </Link>
        )}
      </div>
    </header>
  );
}
