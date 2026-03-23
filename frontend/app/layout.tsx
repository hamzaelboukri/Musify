import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { PlayerProvider } from '@/contexts/PlayerContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AddToPlaylistProvider } from '@/components/AddToPlaylistDialog';
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('musify-theme');var d=document.documentElement;d.setAttribute('data-theme',t==='light'?'light':'dark');d.classList.toggle('dark',t!=='light');})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--background)]">
        <ThemeProvider>
          <AuthProvider>
            <PlayerProvider>
              <SearchProvider>
                <AddToPlaylistProvider>
                  <AppShell>{children}</AppShell>
                </AddToPlaylistProvider>
              </SearchProvider>
            </PlayerProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
