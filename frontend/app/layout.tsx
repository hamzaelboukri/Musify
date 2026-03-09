import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { PlayerProvider } from '@/contexts/PlayerContext';
import { Navbar } from '@/components/Navbar';
import { MusicPlayer } from '@/components/MusicPlayer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Musify - Music Streaming',
  description: 'Stream your favorite music',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-musify-dark">
        <AuthProvider>
          <PlayerProvider>
            <Navbar />
            <main className="pt-16 pb-24 min-h-screen">{children}</main>
            <MusicPlayer />
          </PlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
