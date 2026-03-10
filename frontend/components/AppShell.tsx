'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { MusicPlayer } from './MusicPlayer';

const DASHBOARD_ROUTES = ['/profile', '/singer-dashboard', '/admin-dashboard'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isDashboardPage = DASHBOARD_ROUTES.some((r) => pathname.startsWith(r));

  // Auth pages: no sidebar, no header
  if (isAuthPage) {
    return (
      <>
        <div className="min-h-screen">{children}</div>
        <MusicPlayer />
      </>
    );
  }

  // Role dashboards: standalone layout - each has its own design, no main app sidebar
  if (isDashboardPage) {
    return (
      <>
        <div className="min-h-screen bg-musify-dark">{children}</div>
        <MusicPlayer />
      </>
    );
  }

  // Main app: sidebar + header (Home, Search, Library, Playlists, etc.)
  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar />
          <div className="flex-1 flex flex-col ml-20">
          <TopHeader />
          <main className="flex-1 overflow-y-auto pb-24">{children}</main>
        </div>
      </div>
      <MusicPlayer />
    </>
  );
}
