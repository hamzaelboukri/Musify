'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { singerService } from '@/services/singerService';
import {
  SearchIcon,
  UserIcon,
  ChevronDownIcon,
  BackIcon,
  GridIcon,
  MusicIcon,
  ChartIcon,
  SettingsIcon,
  UploadIcon,
  MoreVerticalIcon,
  InfoIcon,
  PlayIcon,
  DeleteIcon,
} from '@/components/icons';

type Song = {
  _id: string;
  title: string;
  artist: string;
  playCount: number;
  isApproved: boolean;
  genre?: string;
  createdAt?: string;
};

type Stats = {
  totalSongs: number;
  totalPlays: number;
  approvedSongs: number;
  pendingSongs: number;
  topSongs?: Song[];
};

export default function SingerDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<{ _id: string; stageName: string; isApproved: boolean } | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [applyForm, setApplyForm] = useState({ stageName: '', bio: '' });
  const [form, setForm] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 180,
  });

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
    if (user && user.role !== 'SINGER' && user.role !== 'ADMIN') router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'SINGER') {
      singerService.getMyProfile().then(({ data }) => setProfile(data)).catch(() => setProfile(null));
      singerService.getMySongs().then(({ data }) => setSongs(data as Song[])).catch(() => setSongs([]));
      singerService.getStats().then(({ data }) => setStats(data as Stats)).catch(() => setStats(null));
    }
  }, [user]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      await singerService.uploadSong({
        ...form,
        singerId: profile._id,
      });
      singerService.getMySongs().then(({ data }) => setSongs(data as Song[]));
      singerService.getStats().then(({ data }) => setStats(data as Stats));
      setShowUpload(false);
      setForm({ title: '', artist: profile.stageName, album: '', genre: '', audioUrl: form.audioUrl, duration: 180 });
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyForm.stageName.trim()) return;
    try {
      const { data } = await singerService.apply({
        stageName: applyForm.stageName.trim(),
        bio: applyForm.bio.trim() || undefined,
      });
      setProfile(data);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (d?: string) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—');
  const approvedPct = stats ? (stats.totalSongs ? Math.round((stats.approvedSongs / stats.totalSongs) * 100) : 0) : 0;
  const pendingPct = stats ? (stats.totalSongs ? Math.round((stats.pendingSongs / stats.totalSongs) * 100) : 0) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-musify-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-musify-teal/30 border-t-musify-teal animate-spin" />
          <p className="text-white/70">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Apply form
  if (user?.role === 'SINGER' && !profile) {
    return (
      <div className="min-h-full bg-musify-dark">
        <header className="sticky top-0 z-10 px-6 py-4 bg-musify-dark/95 backdrop-blur border-b border-white/10">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 text-sm font-medium transition">
            <BackIcon size="sm" />
            Back to Musify
          </Link>
        </header>
        <div className="flex items-center justify-center p-8 min-h-[calc(100vh-60px)]">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-musify-teal to-musify-purple items-center justify-center mb-4 shadow-lg shadow-musify-teal/30">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">Become an Artist</h1>
              <p className="text-white/70 mt-2">Create your stage identity and start sharing your music</p>
            </div>
            <form onSubmit={handleApply} className="space-y-4 p-6 rounded-2xl bg-musify-card border border-white/10 shadow-xl">
              <input
                value={applyForm.stageName}
                onChange={(e) => setApplyForm((f) => ({ ...f, stageName: e.target.value }))}
                placeholder="Stage Name"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-musify-teal/50 focus:border-musify-teal"
              />
              <textarea
                value={applyForm.bio}
                onChange={(e) => setApplyForm((f) => ({ ...f, bio: e.target.value }))}
                placeholder="Bio (optional)"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-musify-teal/50 focus:border-musify-teal resize-none"
              />
              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-musify-teal to-musify-purple hover:opacity-90 text-white font-semibold shadow-lg shadow-musify-teal/30 transition">
                Apply
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard - reference design
  const filteredSongs = songs.filter(
    (s) => !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const recentSongs = filteredSongs.slice(0, 6);

  return (
    <div className="min-h-screen flex bg-musify-dark">
      {/* Sidebar */}
      <aside className="w-20 shrink-0 bg-musify-sidebar flex flex-col items-center py-6 border-r border-white/5">
        <Link href="/" className="mb-8">
          <img src="/musify-logo.png" alt="Musify" className="w-10 h-10 object-contain" />
        </Link>
        <nav className="flex flex-col items-center gap-2 flex-1">
          {[
            { href: '/singer-dashboard', icon: GridIcon, label: 'Dashboard' },
            { href: '/singer-dashboard', icon: MusicIcon, label: 'Songs' },
            { href: '/singer-dashboard', icon: ChartIcon, label: 'Stats' },
            { href: '/profile', icon: SettingsIcon, label: 'Settings' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              title={item.label}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition"
            >
              <item.icon className="w-6 h-6" />
            </Link>
          ))}
        </nav>
        <Link href="/" className="mt-auto p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition" title="Back to Musify">
          <BackIcon size="lg" />
        </Link>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-musify-dark/95 backdrop-blur border-b border-white/5 px-6 py-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-musify-teal to-musify-purple flex items-center justify-center text-white font-bold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Greetings! Start your day with {profile?.stageName || 'Artist'}</h1>
                <p className="text-white/60 text-sm">Artist Dashboard</p>
              </div>
            </div>
            <div className="flex-1 max-w-md mx-auto">
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size="md" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-musify-teal/50 focus:border-musify-teal"
                />
              </div>
            </div>
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium transition"
            >
              <UserIcon size="md" />
              My account
              <ChevronDownIcon size="sm" className="ml-0.5 opacity-70" />
            </Link>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          {profile && !profile.isApproved && (
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-200 text-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
              Pending approval – songs will be public once approved
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: Cards + Recent Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cards - Reference design */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Cards</h2>
                  <button
                    onClick={() => setShowUpload(!showUpload)}
                    className="text-musify-teal hover:text-musify-accent-hover text-sm font-medium"
                  >
                    {showUpload ? 'Cancel' : '+ Upload Song'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-musify-card border border-white/10 p-6 text-white shadow-lg overflow-hidden relative">
                    <button className="absolute top-4 right-4 p-1 rounded-lg text-white/50 hover:text-white/80">
                      <MoreVerticalIcon size="sm" />
                    </button>
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
                    <p className="text-white/70 text-sm mb-1">Total Plays</p>
                    <p className="text-2xl font-bold">{stats?.totalPlays ?? 0}</p>
                    <p className="text-white/50 text-xs mt-2">All time streams</p>
                  </div>
                  <div className="rounded-2xl bg-musify-card border border-musify-teal/30 p-6 shadow-lg overflow-hidden relative">
                    <button className="absolute top-4 right-4 p-1 rounded-lg text-white/50 hover:text-white/80">
                      <MoreVerticalIcon size="sm" />
                    </button>
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2306b6d4\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
                    <p className="text-white/70 text-sm mb-1">Total Songs</p>
                    <p className="text-2xl font-bold text-white">{stats?.totalSongs ?? 0}</p>
                    <p className="text-white/50 text-xs mt-2">In your catalog</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  {[
                    { label: 'Upload', icon: UploadIcon, primary: true },
                    { label: 'Songs', icon: MusicIcon, primary: false },
                    { label: 'Stats', icon: ChartIcon, primary: false },
                    { label: 'Profile', icon: SettingsIcon, primary: false },
                  ].map((a) => (
                    <Link
                      key={a.label}
                      href={a.label === 'Upload' ? '#' : a.label === 'Profile' ? '/profile' : '/singer-dashboard'}
                      onClick={a.label === 'Upload' ? () => setShowUpload(true) : undefined}
                      className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition ${
                        a.primary
                          ? 'bg-musify-teal/30 hover:bg-musify-teal/40 text-white border border-musify-teal/40'
                          : 'bg-white/5 hover:bg-white/10 text-white/90 border border-white/10'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        a.primary ? 'bg-musify-teal/40' : 'bg-white/10'
                      }`}>
                        <a.icon className={a.primary ? 'w-6 h-6 text-white' : 'w-5 h-5 text-white/80'} size={a.primary ? 'lg' : 'md'} />
                      </div>
                      <span className="text-xs font-medium">{a.label}</span>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Upload form */}
              {showUpload && (
                <form onSubmit={handleUpload} className="p-6 rounded-2xl bg-musify-card border border-white/10 shadow-xl space-y-4">
                  <h3 className="text-lg font-semibold text-white">New Song</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-musify-teal/50" />
                    <input placeholder="Artist" value={form.artist} onChange={(e) => setForm((f) => ({ ...f, artist: e.target.value }))} required className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-musify-teal/50" />
                    <input placeholder="Genre" value={form.genre} onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-musify-teal/50" />
                    <input type="number" placeholder="Duration (seconds)" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: parseInt(e.target.value) || 0 }))} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-musify-teal/50" />
                  </div>
                  <input placeholder="Audio URL" value={form.audioUrl} onChange={(e) => setForm((f) => ({ ...f, audioUrl: e.target.value }))} required className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-musify-teal/50" />
                  <button type="submit" className="px-6 py-2.5 rounded-xl bg-musify-teal hover:bg-musify-accent-hover text-white font-medium transition">Upload</button>
                </form>
              )}

              {/* Recent Sales - Reference design table */}
              <section className="rounded-2xl bg-musify-card border border-white/10 shadow-xl overflow-hidden">
                <h2 className="text-lg font-semibold text-white px-6 py-4 border-b border-white/10">Recent Sales</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 text-left">
                        <th className="px-6 py-3 text-white/60 text-xs font-medium uppercase tracking-wider">Sender</th>
                        <th className="px-6 py-3 text-white/60 text-xs font-medium uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-white/60 text-xs font-medium uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-white/60 text-xs font-medium uppercase tracking-wider text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {recentSongs.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-white/50 text-center">
                            No songs yet. Upload your first track!
                          </td>
                        </tr>
                      ) : (
                        recentSongs.map((song) => (
                          <tr key={song._id} className="hover:bg-white/5 transition group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-musify-teal/20 flex items-center justify-center text-musify-teal font-bold shrink-0">
                                  {song.title?.[0]?.toUpperCase() || '?'}
                                </div>
                                <span className="font-medium text-white">{song.title}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-white/60 text-sm">{formatDate(song.createdAt)}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                                song.isApproved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${song.isApproved ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                {song.isApproved ? 'Success' : 'Pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span className="font-medium text-white">-{song.playCount || 0} plays</span>
                                <button
                                  onClick={async () => {
                                    if (confirm('Delete this song?')) {
                                      await singerService.deleteSong(song._id);
                                      singerService.getMySongs().then(({ data }) => setSongs(data as Song[]));
                                      singerService.getStats().then(({ data }) => setStats(data as Stats));
                                    }
                                  }}
                                  className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition"
                                >
                                  <DeleteIcon size="sm" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Right column: Statistic - Reference design */}
            <div className="space-y-6">
              <div className="rounded-2xl bg-musify-card border border-white/10 shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-white">Statistic</h2>
                    <button className="p-1 rounded-lg text-white/40 hover:text-white/70">
                      <InfoIcon size="sm" />
                    </button>
                  </div>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm">
                    This week
                    <ChevronDownIcon size="xs" />
                  </button>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="3"
                      />
                      {stats?.totalSongs ? (
                        <>
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="3"
                            strokeDasharray={`${approvedPct} ${100 - approvedPct}`}
                            strokeLinecap="round"
                          />
                          {pendingPct > 0 && (
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#8b5cf6"
                              strokeWidth="3"
                              strokeDasharray={`${pendingPct} ${100 - pendingPct}`}
                              strokeDashoffset={-approvedPct}
                              strokeLinecap="round"
                            />
                          )}
                        </>
                      ) : (
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="3"
                        />
                      )}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-2xl font-bold text-white">{stats?.totalSongs ?? 0}</p>
                      <p className="text-white/50 text-sm">Total Songs</p>
                    </div>
                  </div>
                  <div className="flex gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-musify-teal" />
                      <span className="text-white/70 text-sm">Approved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-musify-purple" />
                      <span className="text-white/70 text-sm">Pending</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  {(stats?.topSongs ?? []).slice(0, 4).map((song) => (
                    <div key={song._id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-musify-teal/20 flex items-center justify-center">
                          <PlayIcon className="text-musify-teal" size="md" />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{song.title}</p>
                          <p className="text-white/50 text-xs">{song.playCount || 0} plays</p>
                        </div>
                      </div>
                      <span className="text-white/70 font-medium text-sm">-{song.playCount || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
