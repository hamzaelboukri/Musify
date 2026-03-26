'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LogoutIcon } from '@/components/icons';

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  const isSingerProfile = pathname === '/singer-dashboard' && searchParams.get('tab') === 'profile';

  const navItems = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/search', label: 'Search', icon: SearchIcon },
    { href: '/playlists', label: 'Library', icon: LibraryIcon },
    { href: '/favorites', label: 'Liked', icon: HeartIcon },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 z-30 bg-[#0a0a0a] flex flex-col py-6 border-r border-white/5">
      <Link href="/" className="px-6 mb-6 flex items-center gap-3">
        <img src="/musify-logo.png" alt="Musify" className="w-10 h-10 object-contain" />
        <span className="text-lg font-bold text-white">Musify</span>
      </Link>

      <nav className="flex flex-col gap-1 px-3 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/' && pathname === '/') || (item.href === '/search' && pathname.startsWith('/search'));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                isActive ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/40' : 'text-[#b3b3b3] hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-6 h-6 shrink-0" />
              <span className="font-medium text-[14px]">{item.label}</span>
            </Link>
          );
        })}

        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-1">
          <Link
            href="/playlists"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#b3b3b3] hover:text-white hover:bg-white/5 transition"
          >
            <PlusIcon className="w-6 h-6 shrink-0" />
            <span className="font-medium text-[14px]">Create Playlist</span>
          </Link>
          {user?.role === 'SINGER' && (
            <Link
              href="/singer-dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#b3b3b3] hover:text-white hover:bg-white/5 transition"
            >
              <DashboardIcon className="w-6 h-6 shrink-0" />
              <span className="font-medium text-[14px]">Dashboard</span>
            </Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link
              href="/admin-dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#b3b3b3] hover:text-white hover:bg-white/5 transition"
            >
              <ShieldIcon className="w-6 h-6 shrink-0" />
              <span className="font-medium text-[14px]">Admin</span>
            </Link>
          )}
          <Link
            href="/about"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
              pathname === '/about' ? 'bg-white/10 text-white' : 'text-[#b3b3b3] hover:text-white hover:bg-white/5'
            }`}
          >
            <InfoIcon className="w-6 h-6 shrink-0" />
            <span className="font-medium text-[14px]">How it works</span>
          </Link>
          <Link
            href={user?.role === 'SINGER' ? '/singer-dashboard?nav=profile' : '/profile'}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
              (user?.role === 'SINGER' ? isSingerProfile : pathname === '/profile')
                ? 'bg-white/10 text-white'
                : 'text-[#b3b3b3] hover:text-white hover:bg-white/5'
            }`}
          >
            <SettingsIcon className="w-6 h-6 shrink-0" />
            <span className="font-medium text-[14px]">Profile</span>
          </Link>
          {user && (
            <button
              onClick={async () => { await logout(); window.location.href = '/'; }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#b3b3b3] hover:text-white hover:bg-white/5 transition w-full text-left"
            >
              <LogoutIcon className="w-6 h-6 shrink-0" />
              <span className="font-medium text-[14px]">Log out</span>
            </button>
          )}
        </div>
      </nav>
    </aside>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L2 12h2v10h6v-6h4v6h6V12h2L12 2z" />
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

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  );
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </svg>
  );
}
