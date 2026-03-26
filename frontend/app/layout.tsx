import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { PlayerProvider } from '@/contexts/PlayerContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { AddToPlaylistProvider } from '@/components/AddToPlaylistDialog';
import { AppShell } from '@/components/AppShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Musify - Music Streaming',
  description: 'Stream your favorite music, anytime.',
  icons: { icon: '/musify-logo.png' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className="min-h-screen bg-[var(--background)]">
        <AuthProvider>
          <PlayerProvider>
            <SearchProvider>
              <AddToPlaylistProvider>
                <AppShell>{children}</AppShell>
              </AddToPlaylistProvider>
            </SearchProvider>
          </PlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
