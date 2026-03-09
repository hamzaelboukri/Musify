'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/', label: 'Search', icon: SearchIcon },
    { href: '/playlists', label: 'Your Library', icon: LibraryIcon },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 z-30 bg-musify-sidebar flex flex-col">
      <Link href="/" className="p-6 flex items-center gap-3">
        <img src="/musify-logo.png" alt="Musify" className="w-10 h-10 object-contain" />
        <span className="text-xl font-bold bg-gradient-to-r from-musify-teal to-musify-purple bg-clip-text text-transparent">
          Musify<span className="text-musify-teal">.</span>
        </span>
      </Link>

      <nav className="px-3 py-4 flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/' && pathname === '/');
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-4 px-3 py-2.5 rounded-lg transition ${
                    isActive ? 'bg-musify-frosted text-white' : 'text-musify-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 pt-6 border-t border-white/10">
          <Link
            href="/playlists"
            className="flex items-center gap-4 px-3 py-2.5 rounded-lg text-musify-text-secondary hover:text-white hover:bg-white/5 transition"
          >
            <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </div>
            <span className="font-medium">Create Playlist</span>
          </Link>
          <Link
            href="/favorites"
            className="flex items-center gap-4 px-3 py-2.5 rounded-lg text-musify-text-secondary hover:text-white hover:bg-white/5 transition mt-1"
          >
            <div className="w-6 h-6 rounded bg-gradient-to-br from-musify-teal to-musify-purple flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <span className="font-medium">Liked Songs</span>
          </Link>
        </div>

        <div className="mt-4 space-y-1 max-h-64 overflow-y-auto">
          {user?.role === 'SINGER' && (
            <Link href="/singer-dashboard" className="block px-3 py-2 text-white/60 hover:text-white text-sm truncate">
              Dashboard
            </Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link href="/admin-dashboard" className="block px-3 py-2 text-white/60 hover:text-white text-sm truncate">
              Admin
            </Link>
          )}
        </div>
      </nav>
    </aside>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L2 12h2v10h6v-6h4v6h6V12h2L12 2z" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
}

function LibraryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
    </svg>
  );
}
