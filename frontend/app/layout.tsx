import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { PlayerProvider } from '@/contexts/PlayerContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { AppShell } from '@/components/AppShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Musify - Music Streaming',
  description: 'Stream your favorite music',
  icons: { icon: '/musify-logo.png' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0a]">
        <AuthProvider>
          <PlayerProvider>
            <SearchProvider>
              <AppShell>{children}</AppShell>
            </SearchProvider>
          </PlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
