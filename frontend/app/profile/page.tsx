'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/userService';
import { statsService } from '@/services/statsService';
import { favoriteService } from '@/services/favoriteService';
import { playlistService } from '@/services/playlistService';
import { usePlayer } from '@/contexts/PlayerContext';
import { getCoverImageUrl } from '@/utils/coverImage';

type ProfileData = { name: string; email: string; following?: string[] };
type HistoryItem = { songId?: { title?: string; artist?: string; coverImage?: string; _id: string; audioUrl: string; duration: number }; playedAt?: string };

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { play } = usePlayer();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<unknown[]>([]);
  const [playlists, setPlaylists] = useState<{ _id: string; name: string; songs?: unknown[] }[]>([]);
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
    if (!loading && user?.role === 'SINGER') router.replace('/singer-dashboard?tab=profile');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      userService.getProfile().then(({ data }) => {
        const p = data as ProfileData;
        setProfile(p);
        setName(p?.name ?? '');
      });
      statsService.getHistory(50).then(({ data }) => setHistory((data as HistoryItem[]) || []));
      favoriteService.getAll().then(({ data }) => setFavorites((data as unknown[]) || []));
      playlistService.getAll().then(({ data }) => setPlaylists((data as { _id: string; name: string; songs?: unknown[] }[]) || []));
    }
  }, [user]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userService.updateProfile({ name });
      setProfile((p) => (p ? { ...p, name } : null));
      setIsEditing(false);
    } catch {
      // Silent fail
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-musify-darker">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border-2 border-musify-teal/40 border-t-musify-teal animate-spin" />
          <p className="text-white/70">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const followingCount = profile?.following?.length ?? 0;

  return (
    <div className="min-h-full bg-musify-darker">
      {/* Top header */}
      <header className="sticky top-0 z-20 px-6 py-4 bg-musify-darker/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/5 text-sm font-medium transition"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back to Musify
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/favorites" className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </Link>
            <Link href="/playlists" className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero cover section */}
      <div className="relative overflow-hidden">
        <div
          className="h-48 sm:h-56 md:h-64"
          style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)',
            opacity: 0.9,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-musify-darker via-musify-darker/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.3)_0%,_transparent_50%)]" />

        <div className="relative max-w-4xl mx-auto px-6 -mt-24 sm:-mt-28 pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="relative shrink-0">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-musify-teal via-musify-purple to-musify-pink flex items-center justify-center text-5xl sm:text-6xl font-bold text-white shadow-2xl shadow-black/50 ring-4 ring-musify-darker/80">
                {user?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-musify-teal border-2 border-musify-darker flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                {profile?.name || 'Listener'}
              </h1>
              <p className="text-white/80 mt-2 flex items-center justify-center sm:justify-start gap-2">
                <svg className="w-4 h-4 text-musify-teal/90" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                {profile?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="max-w-4xl mx-auto px-6 -mt-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/favorites"
            className="group p-4 rounded-2xl bg-musify-card/80 border border-white/5 hover:border-musify-teal/30 hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-musify-pink/20 flex items-center justify-center group-hover:scale-105 transition">
                <svg className="w-6 h-6 text-musify-pink" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{favorites.length}</p>
                <p className="text-white/50 text-sm">Liked</p>
              </div>
            </div>
          </Link>
          <Link
            href="/playlists"
            className="group p-4 rounded-2xl bg-musify-card/80 border border-white/5 hover:border-musify-purple/30 hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-musify-purple/20 flex items-center justify-center group-hover:scale-105 transition">
                <svg className="w-6 h-6 text-musify-purple" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{playlists.length}</p>
                <p className="text-white/50 text-sm">Playlists</p>
              </div>
            </div>
          </Link>
          <div className="p-4 rounded-2xl bg-musify-card/80 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-musify-teal/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-musify-teal" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{history.length}</p>
                <p className="text-white/50 text-sm">Played</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-musify-card/80 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-musify-pink/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-musify-pink" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{followingCount}</p>
                <p className="text-white/50 text-sm">Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Edit Profile card */}
        <div className="rounded-2xl bg-musify-card/80 border border-white/5 overflow-hidden backdrop-blur-sm">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-musify-teal" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              Profile Settings
            </h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl bg-musify-teal/20 text-musify-teal hover:bg-musify-teal/30 text-sm font-medium transition"
              >
                Edit
              </button>
            ) : null}
          </div>
          {isEditing ? (
            <form onSubmit={updateProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2 font-medium">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-musify-teal focus:ring-2 focus:ring-musify-teal/20 transition"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2 font-medium">Email</label>
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/5 text-white/50 cursor-not-allowed"
                />
                <p className="text-white/40 text-xs mt-1">Email cannot be changed</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-musify-teal to-musify-purple hover:opacity-90 text-white font-semibold shadow-lg shadow-musify-teal/20 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsEditing(false); setName(profile?.name ?? ''); }}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6">
              <p className="text-white/70">Manage your display name and account details.</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 mt-4 text-musify-teal hover:text-musify-accent-hover text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                Back to Home
              </Link>
            </div>
          )}
        </div>

        {/* Listening History */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-musify-teal" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
              Recently Played
            </h2>
            {history.length > 0 && (
              <span className="text-white/50 text-sm">{history.length} tracks</span>
            )}
          </div>
          <div className="space-y-2">
            {history.length === 0 ? (
              <div className="py-16 rounded-2xl bg-musify-card/50 border border-white/5 border-dashed text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-musify-teal/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-musify-teal/50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
                <p className="text-white/70 font-medium">No listening history yet</p>
                <p className="text-white/50 text-sm mt-1">Start exploring music and your history will appear here</p>
                <Link
                  href="/"
                  className="inline-block mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-musify-teal to-musify-purple text-white font-semibold hover:opacity-90 transition"
                >
                  Explore Music
                </Link>
              </div>
            ) : (
              history.map((h, i) => {
                const song = h.songId;
                if (!song) return null;
                return (
                  <div
                    key={`${h.playedAt}-${i}`}
                    onClick={() => {
                      const s = { _id: song._id, title: song.title ?? 'Unknown', artist: song.artist ?? '', coverImage: song.coverImage, audioUrl: song.audioUrl ?? '', duration: song.duration ?? 0 };
                      const queue = history.map((x) => x.songId).filter(Boolean).map((sng: unknown) => {
                        const sn = sng as { _id: string; title?: string; artist?: string; coverImage?: string; audioUrl?: string; duration?: number };
                        return { _id: sn._id, title: sn.title ?? 'Unknown', artist: sn.artist ?? '', coverImage: sn.coverImage, audioUrl: sn.audioUrl ?? '', duration: sn.duration ?? 0 };
                      });
                      play(s, queue);
                    }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-musify-card/60 border border-white/5 hover:bg-white/5 hover:border-musify-teal/20 transition-all cursor-pointer group"
                  >
                    <img
                      src={getCoverImageUrl(song.coverImage, song._id)}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover group-hover:scale-105 transition"
                      onError={(e) => { (e.target as HTMLImageElement).src = getCoverImageUrl(undefined, song._id); }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{song.title || 'Unknown'}</p>
                      <p className="text-white/60 text-sm truncate">{song.artist || '-'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/40 text-sm hidden sm:block">
                        {new Date(h.playedAt || 0).toLocaleDateString()}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-musify-teal/20 group-hover:bg-musify-teal/40 flex items-center justify-center text-musify-teal transition">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Playlists preview */}
        {playlists.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-musify-purple" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
                Your Playlists
              </h2>
              <Link href="/playlists" className="text-musify-purple hover:text-musify-teal text-sm font-medium">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {playlists.slice(0, 4).map((pl) => (
                <Link
                  key={pl._id}
                  href={`/playlists/${pl._id}`}
                  className="p-4 rounded-xl bg-musify-card/60 border border-white/5 hover:bg-white/5 hover:border-musify-purple/20 transition group"
                >
                  <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-musify-purple/30 to-musify-pink/20 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                    <svg className="w-12 h-12 text-musify-purple/60" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                    </svg>
                  </div>
                  <p className="text-white font-medium truncate">{pl.name}</p>
                  <p className="text-white/50 text-xs">{(pl.songs?.length ?? 0)} songs</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Liked preview */}
        {favorites.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-musify-pink" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                Liked Songs
              </h2>
              <Link href="/favorites" className="text-musify-pink hover:text-musify-teal text-sm font-medium">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {(favorites as { _id: string; title?: string; artist?: string; coverImage?: string }[]).slice(0, 4).map((fav) => (
                <Link
                  key={fav._id}
                  href="/favorites"
                  className="p-4 rounded-xl bg-musify-card/60 border border-white/5 hover:bg-white/5 hover:border-musify-pink/20 transition group"
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden bg-white/5 mb-3">
                    <img
                      src={getCoverImageUrl(fav.coverImage, fav._id)}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                      onError={(e) => { (e.target as HTMLImageElement).src = getCoverImageUrl(undefined, fav._id); }}
                    />
                  </div>
                  <p className="text-white font-medium truncate">{fav.title || 'Unknown'}</p>
                  <p className="text-white/50 text-xs truncate">{fav.artist || '-'}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
