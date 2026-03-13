'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { singerService } from '@/services/singerService';
import { BackIcon, DeleteIcon, GridIcon, MusicIcon, ChartIcon, SettingsIcon, AlbumIcon } from '@/components/icons';
import { getCoverImageUrl } from '@/utils/coverImage';
import { albumService } from '@/services/albumService';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function smoothPath(points: { x: number; y: number }[], height: number): string {
  if (points.length < 2) return '';
  const pts = points.map((p) => ({ x: p.x, y: height - p.y }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const next = pts[i + 1] || curr;
    const cp1x = prev.x + (curr.x - (pts[i - 2] || prev).x) / 6;
    const cp1y = prev.y + (curr.y - (pts[i - 2] || prev).y) / 6;
    const cp2x = curr.x - (next.x - prev.x) / 6;
    const cp2y = curr.y - (next.y - prev.y) / 6;
    d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${curr.x} ${curr.y}`;
  }
  return d;
}

type Song = {
  _id: string;
  title: string;
  artist: string;
  playCount: number;
  isApproved: boolean;
  genre?: string;
  duration?: number;
  createdAt?: string;
  coverImage?: string;
  album?: string;
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
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<{ _id: string; stageName: string; isApproved: boolean; bio?: string; image?: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [songs, setSongs] = useState<Song[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<'1D'|'1W'|'1M'|'6M'|'1Y'>('6M');
  const [tableFilter, setTableFilter] = useState<'all'|'gainers'|'losers'>('all');
  const [watchFilter, setWatchFilter] = useState<'most'|'gainers'|'losers'>('most');
  const [applyForm, setApplyForm] = useState({ stageName: '', bio: '' });
  const [form, setForm] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    duration: 180,
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [songSort, setSongSort] = useState<'newest' | 'plays' | 'title'>('newest');
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [editForm, setEditForm] = useState({ title: '', genre: '', album: '' });
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [songsLoading, setSongsLoading] = useState(false);
  const [songsError, setSongsError] = useState<string | null>(null);
  const [songsPage, setSongsPage] = useState(1);
  const SONGS_PER_PAGE = 8;
  const [albums, setAlbums] = useState<{ _id: string; name: string; artist: string; coverImage?: string; songs: unknown[] }[]>([]);
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [albumForm, setAlbumForm] = useState({ name: '' });
  const [addToAlbumSong, setAddToAlbumSong] = useState<Song | null>(null);
  const [albumsLoading, setAlbumsLoading] = useState(false);
  const [albumSearchOpen, setAlbumSearchOpen] = useState(false);
  const [albumSearchQuery, setAlbumSearchQuery] = useState('');
  const [selectedAlbumForCreate, setSelectedAlbumForCreate] = useState<{ _id: string; name: string } | null>(null);

  const fetchMySongs = useCallback(() => {
    if (user?.role !== 'SINGER' || !profile?.isApproved) return;
    setSongsLoading(true);
    setSongsError(null);
    Promise.all([
      singerService.getMySongs(),
      singerService.getStats(),
    ])
      .then(([songsRes, statsRes]) => {
        const data = songsRes.data;
        setSongs(Array.isArray(data) ? data : []);
        setStats(statsRes.data as Stats);
      })
      .catch((err) => {
        setSongs([]);
        setSongsError(err?.response?.data?.message || err?.message || 'Failed to load songs. Please try again.');
      })
      .finally(() => setSongsLoading(false));
  }, [user?.role, profile?.isApproved]);

  const fetchMyAlbums = useCallback(() => {
    if (user?.role !== 'SINGER' || !profile?.isApproved) return;
    setAlbumsLoading(true);
    albumService.getMyAlbums()
      .then(({ data }) => setAlbums(Array.isArray(data) ? data : []))
      .catch(() => setAlbums([]))
      .finally(() => setAlbumsLoading(false));
  }, [user?.role, profile?.isApproved]);

  const CATEGORIES = ['Pop', 'Rock', 'Hip-Hop', 'R&B', 'Jazz', 'Electronic', 'Classical', 'Country', 'Reggae', 'Latin', 'Metal', 'Indie', 'Other'];
  const filteredCategories = CATEGORIES.filter((c) => c.toLowerCase().includes(categorySearch.toLowerCase().trim()));
  const filteredAlbums = albums.filter((a) => a.name.toLowerCase().includes(albumSearchQuery.toLowerCase().trim()));

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
    if (user && user.role !== 'SINGER' && user.role !== 'ADMIN') router.replace('/');
  }, [user, loading, router]);

  const activeNav = searchParams.get('nav') || 'overview';

  useEffect(() => {
    if (activeNav === 'songs' && songs.length === 0) setShowUpload(true);
  }, [activeNav, songs.length]);

  const closeModal = useCallback(() => {
    setShowUpload(false);
    setForm({ title: '', artist: profile?.stageName || '', album: '', genre: '', duration: 180 });
    setAudioFile(null);
    setImageFile(null);
    setCategoryOpen(false);
    setCategorySearch('');
    setAlbumSearchOpen(false);
    setAlbumSearchQuery('');
    setSelectedAlbumForCreate(null);
  }, [profile?.stageName]);

  useEffect(() => {
    if (showUpload && profile?.isApproved) fetchMyAlbums();
  }, [showUpload, profile?.isApproved, fetchMyAlbums]);
  useEffect(() => {
    if (!showUpload && !editingSong && !showCreateAlbum && !addToAlbumSong) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editingSong) setEditingSong(null);
        else if (addToAlbumSong) setAddToAlbumSong(null);
        else if (showCreateAlbum) setShowCreateAlbum(false);
        else closeModal();
      }
    };
    window.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [showUpload, editingSong, showCreateAlbum, addToAlbumSong, closeModal]);

  useEffect(() => {
    if (profile?.stageName) setForm((f) => ({ ...f, artist: profile.stageName }));
  }, [profile?.stageName]);

  useEffect(() => {
    if (user?.role === 'SINGER') {
      setProfileLoading(true);
      singerService
        .getMyProfile()
        .then(({ data }) => {
          setProfile(data);
          if (data?.isApproved) {
            singerService.getMySongs().then(({ data: s }) => setSongs(Array.isArray(s) ? s : [])).catch(() => setSongs([]));
            singerService.getStats().then(({ data: st }) => setStats(st as Stats)).catch(() => setStats(null));
          }
        })
        .catch(() => setProfile(null))
        .finally(() => setProfileLoading(false));
    } else {
      setProfileLoading(false);
    }
  }, [user]);

  // Refetch songs when navigating to Songs tab (ensures fresh data for management)
  useEffect(() => {
    if (activeNav === 'songs' && profile?.isApproved) {
      fetchMySongs();
    }
  }, [activeNav, profile?.isApproved, fetchMySongs]);

  useEffect(() => {
    if (activeNav === 'albums' && profile?.isApproved) {
      fetchMyAlbums();
    }
  }, [activeNav, profile?.isApproved, fetchMyAlbums]);

  // Reset to page 1 when songs or sort changes
  useEffect(() => {
    setSongsPage(1);
  }, [songs.length, songSort]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !audioFile) return;
    setUploading(true);
    try {
      const { data: audioData } = await singerService.uploadAudio(audioFile);
      let coverImage: string | undefined;
      if (imageFile) {
        const { data: imageData } = await singerService.uploadImage(imageFile);
        coverImage = imageData.url;
      }
      const albumName = selectedAlbumForCreate?.name || form.album || '';
      const { data: newSong } = await singerService.uploadSong({
        ...form,
        artist: form.artist || profile.stageName,
        singerId: profile._id,
        audioUrl: audioData.url,
        coverImage,
        album: albumName,
      });
      if (selectedAlbumForCreate && (newSong as { _id?: string })?._id) {
        await albumService.addSong(selectedAlbumForCreate._id, (newSong as { _id: string })._id);
      }
      singerService.getMySongs().then(({ data }) => setSongs(data as Song[]));
      singerService.getStats().then(({ data }) => setStats(data as Stats));
      fetchMyAlbums();
      setShowUpload(false);
      setForm({ title: '', artist: profile.stageName, album: '', genre: '', duration: 180 });
      setAudioFile(null);
      setImageFile(null);
      setCategoryOpen(false);
      setCategorySearch('');
      setSelectedAlbumForCreate(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumForm.name.trim()) return;
    try {
      await albumService.create({ name: albumForm.name.trim() });
      fetchMyAlbums();
      setShowCreateAlbum(false);
      setAlbumForm({ name: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSongToAlbum = async (albumId: string) => {
    if (!addToAlbumSong) return;
    try {
      await albumService.addSong(albumId, addToAlbumSong._id);
      fetchMyAlbums();
      fetchMySongs();
      setAddToAlbumSong(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSong) return;
    try {
      let coverImage: string | undefined;
      if (editImageFile) {
        const { data: imageData } = await singerService.uploadImage(editImageFile);
        coverImage = imageData.url;
      }
      await singerService.updateSong(editingSong._id, {
        title: editForm.title,
        genre: editForm.genre,
        album: editForm.album,
        ...(coverImage && { coverImage }),
      });
      fetchMySongs();
      setEditingSong(null);
      setEditImageFile(null);
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

  if (loading || (user?.role === 'SINGER' && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-musify-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-musify-teal/30 border-t-musify-teal animate-spin" />
          <p className="text-musify-text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (user?.role === 'SINGER' && !profile) {
    return (
      <div className="min-h-full bg-musify-dark">
        <header className="sticky top-0 z-10 px-6 py-4 bg-musify-sidebar/95 backdrop-blur border-b border-white/10">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-musify-text-muted hover:text-white hover:bg-white/5 text-sm font-medium transition">
            <BackIcon size="sm" />
            Back to Musify
          </Link>
        </header>
        <div className="flex items-center justify-center p-8 min-h-[calc(100vh-60px)]">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <div className="inline-flex w-16 h-16 rounded-2xl bg-musify-teal/20 items-center justify-center mb-4">
                <svg className="w-8 h-8 text-musify-teal" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">Become an Artist</h1>
              <p className="text-musify-text-muted mt-2">Create your stage identity and start sharing your music</p>
            </div>
            <form onSubmit={handleApply} className="space-y-4 p-6 rounded-2xl bg-musify-card border border-white/10">
              <input
                value={applyForm.stageName}
                onChange={(e) => setApplyForm((f) => ({ ...f, stageName: e.target.value }))}
                placeholder="Stage Name"
                required
                className="w-full px-4 py-3 rounded-xl bg-musify-dark border border-white/10 text-white placeholder-musify-text-muted focus:outline-none focus:ring-2 focus:ring-musify-teal/50 focus:border-musify-teal"
              />
              <textarea
                value={applyForm.bio}
                onChange={(e) => setApplyForm((f) => ({ ...f, bio: e.target.value }))}
                placeholder="Bio (optional)"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-musify-dark border border-white/10 text-white placeholder-musify-text-muted focus:outline-none focus:ring-2 focus:ring-musify-teal/50 focus:border-musify-teal resize-none"
              />
              <button type="submit" className="w-full py-3 rounded-xl bg-musify-teal hover:bg-musify-accent-hover text-white font-semibold transition">
                Apply
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role === 'SINGER' && profile && !profile.isApproved) {
    return (
      <div className="min-h-full bg-musify-dark">
        <header className="sticky top-0 z-10 px-6 py-4 bg-musify-sidebar/95 backdrop-blur border-b border-white/10">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-musify-text-muted hover:text-white hover:bg-white/5 text-sm font-medium transition">
            <BackIcon size="sm" />
            Back to Musify
          </Link>
        </header>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-8">
          <div className="max-w-md w-full text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-amber-500/20 flex items-center justify-center">
              <svg className="w-12 h-12 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Pending Approval</h1>
            <p className="text-musify-text-muted mb-6">
              Your artist application is under review. An admin will approve your account soon.
            </p>
            <p className="text-musify-text-muted text-sm">Stage name: <span className="text-white/80 font-medium">{profile.stageName}</span></p>
            <Link href="/" className="inline-block mt-8 px-6 py-3 rounded-xl bg-musify-teal/20 text-musify-teal hover:bg-musify-teal/30 font-medium transition">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const weeklyStreams = (() => {
    const total = stats?.totalPlays ?? 0;
    const base = Math.floor(total / 7);
    const remainder = total % 7;
    return DAYS.map((_, i) => base + (i < remainder ? 1 : 0));
  })();
  const maxStreams = Math.max(...weeklyStreams, 1);
  const weekTotal = weeklyStreams.reduce((a, b) => a + b, 0);

  // KPI - song statistics (not streams)
  const totalPlays = stats?.totalPlays ?? 0;
  const kpis = [
    { label: 'Total Song Plays', value: totalPlays.toLocaleString(), change: totalPlays > 0 ? 12.5 : 0, positive: true },
    { label: 'Songs This Week', value: weekTotal.toLocaleString(), change: weekTotal > 0 ? 8.2 : 0, positive: weekTotal > 0 },
    { label: 'Songs Approved', value: `${stats?.approvedSongs ?? 0} / ${stats?.totalSongs ?? 0}`, change: approvedPct > 0 ? 6.5 : 0, positive: true },
    { label: 'Total Songs', value: String(stats?.totalSongs ?? 0), change: (stats?.totalSongs ?? 0) > 0 ? 3.4 : 0, positive: true },
  ];

  const topSongs = (stats?.topSongs ?? songs)
    .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
    .slice(0, 5);

  const portfolioSongs = topSongs.slice(0, 5);

  return (
    <div className="min-h-screen flex bg-musify-dark">
      {/* Platform sidebar */}
      <aside className="w-56 shrink-0 bg-musify-sidebar flex flex-col border-r border-white/10">
        <div className="p-4 border-b border-white/10">
          <Link href="/singer-dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">Musify</span>
          </Link>
        </div>
        <nav className="flex-1 py-4 px-3">
          <p className="px-3 py-1.5 text-xs font-medium text-musify-text-muted uppercase tracking-wider">Main Menu</p>
          <div className="space-y-0.5 mt-1">
            <Link href="/singer-dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${!['songs','streams','profile'].includes(activeNav) ? 'bg-musify-teal text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}>
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <GridIcon className="h-4 w-4" />
              </div>
              Dashboard
            </Link>
            <Link href="/singer-dashboard?nav=songs" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${activeNav === 'songs' ? 'bg-musify-teal text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}>
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <MusicIcon className="h-4 w-4" />
              </div>
              Songs
            </Link>
            <Link href="/singer-dashboard?nav=albums" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${activeNav === 'albums' ? 'bg-musify-teal text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}>
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <AlbumIcon className="h-4 w-4" />
              </div>
              Albums
            </Link>
            <Link href="/singer-dashboard?nav=streams" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${activeNav === 'streams' ? 'bg-musify-teal text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}>
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <ChartIcon className="h-4 w-4" />
              </div>
              Analytics
            </Link>
            <Link href="/singer-dashboard?nav=profile" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${activeNav === 'profile' ? 'bg-musify-teal text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}>
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <SettingsIcon className="h-4 w-4" />
              </div>
              Profile
            </Link>
          </div>
          <p className="px-3 py-1.5 text-xs font-medium text-musify-text-muted uppercase tracking-wider mt-6">Support</p>
          <div className="space-y-0.5 mt-1">
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/80 hover:bg-white/5 hover:text-white transition">
              <BackIcon className="h-4 w-4" />
              Back to App
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Platform header */}
        <header className="sticky top-0 z-10 bg-musify-dark/95 backdrop-blur border-b border-white/10 px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {['Dashboard', 'Songs', 'Albums', 'Analytics'].map((tab, i) => {
                  const tabs = ['overview', 'songs', 'albums', 'streams'] as const;
                  const nav = tabs[i] || 'overview';
                  const href = i === 0 ? '/singer-dashboard' : `/singer-dashboard?nav=${nav}`;
                  const isActive = (i === 0 && !['songs','albums','streams','profile'].includes(activeNav)) || activeNav === nav;
                  return (
                    <Link key={tab} href={href} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive ? 'bg-musify-teal text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                      {tab}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex-1 max-w-md mx-6">
              <div className="relative">
                <input type="text" placeholder="Search your music..." className="w-full pl-4 pr-4 py-2.5 rounded-xl bg-musify-dark border border-white/10 text-white placeholder-musify-text-muted focus:outline-none focus:ring-2 focus:ring-musify-teal/50 focus:border-musify-teal text-sm" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              {profile?.isApproved && (
                <button onClick={() => setShowUpload(true)} className="px-4 py-2 rounded-xl bg-musify-teal hover:bg-musify-accent-hover text-white font-medium text-sm transition flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Create Song
                </button>
              )}
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{profile?.stageName || user?.name || 'Artist'}</p>
                  <p className="text-xs text-musify-text-muted">{user?.email || ''}</p>
                </div>
                <Link href="/singer-dashboard?nav=profile" className="w-10 h-10 rounded-full bg-musify-teal/20 flex items-center justify-center text-musify-teal font-bold">
                  {profile?.stageName?.[0]?.toUpperCase() || user?.name?.[0] || '?'}
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          {/* SONGS PAGE: Upload form + songs list */}
          {activeNav === 'songs' && (
            <>
              {/* Artist header + Songs management */}
              <div className="mb-6">
                <div className="rounded-2xl bg-musify-card border border-white/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-musify-teal/30 to-musify-purple/20 flex items-center justify-center text-2xl font-bold text-musify-teal">
                      {profile?.stageName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{profile?.stageName || 'Artist'}</h2>
                      <p className="text-musify-text-muted text-sm">{songs.length} song{songs.length !== 1 ? 's' : ''} · {(stats?.totalPlays ?? 0).toLocaleString()} total plays</p>
                    </div>
                  </div>
                  <button onClick={() => setShowUpload(true)} className="px-5 py-2.5 rounded-xl bg-musify-teal hover:bg-musify-accent-hover text-white font-medium text-sm transition flex items-center gap-2 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Create Song
                  </button>
                </div>
              </div>

              <div className="rounded-3xl upload-card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-white">Manage Your Songs</h3>
                    <p className="text-musify-text-muted text-sm mt-0.5">View, edit, sort, and delete your tracks</p>
                  </div>
                  {songs.length > 0 && (
                    <div className="flex items-center gap-3">
                      <button onClick={fetchMySongs} disabled={songsLoading} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-musify-text-muted hover:text-white transition disabled:opacity-50" title="Refresh songs">
                        <svg className={`w-5 h-5 ${songsLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="text-musify-text-muted text-sm">Sort by:</span>
                        <select value={songSort} onChange={(e) => setSongSort(e.target.value as 'newest' | 'plays' | 'title')} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-musify-teal/50">
                          <option value="newest">Newest first</option>
                          <option value="plays">Most plays</option>
                          <option value="title">Title A-Z</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
                {songsLoading ? (
                  <div className="py-20 px-6 text-center rounded-2xl border border-white/10 bg-white/5">
                    <div className="w-12 h-12 rounded-full border-2 border-musify-teal/30 border-t-musify-teal animate-spin mx-auto mb-4" />
                    <p className="text-musify-text-muted">Loading your songs...</p>
                  </div>
                ) : songs.length === 0 ? (
                  <div className="py-20 px-6 text-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5">
                    {songsError && (
                      <div className="mb-4 p-4 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 text-sm">
                        {songsError}
                      </div>
                    )}
                    <div className="w-20 h-20 rounded-2xl bg-musify-teal/20 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-musify-teal" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">Your songs will appear here</h4>
                    <p className="text-musify-text-muted text-sm mb-6 max-w-sm mx-auto">This is where you see and manage all your tracks. Load your songs or create a new one.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button onClick={fetchMySongs} disabled={songsLoading} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium transition inline-flex items-center gap-2 disabled:opacity-50">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Load my songs
                      </button>
                      <button onClick={() => setShowUpload(true)} className="px-8 py-3.5 rounded-xl bg-musify-teal hover:bg-musify-accent-hover text-white font-semibold transition inline-flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Create Song
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[...songs]
                        .sort((a, b) => {
                          if (songSort === 'newest') return (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime());
                          if (songSort === 'plays') return (b.playCount || 0) - (a.playCount || 0);
                          return (a.title || '').localeCompare(b.title || '');
                        })
                        .slice((songsPage - 1) * SONGS_PER_PAGE, songsPage * SONGS_PER_PAGE)
                        .map((song) => (
                          <div key={song._id} className="group rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-musify-teal/30 hover:bg-white/[0.07] transition-all duration-200">
                            <div className="relative aspect-square">
                              <img src={getCoverImageUrl(song.coverImage)} alt={song.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className={`text-xs font-medium px-2 py-1 rounded-lg ${song.isApproved ? 'bg-musify-teal/90 text-white' : 'bg-amber-500/90 text-white'}`}>{song.isApproved ? 'Live' : 'Pending'}</span>
                                <div className="flex gap-1">
                                  <button onClick={(e) => { e.stopPropagation(); setAddToAlbumSong(song); }} className="p-2 rounded-lg bg-black/50 hover:bg-musify-purple/80 text-white" title="Add to album">
                                    <AlbumIcon className="w-4 h-4" />
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); setEditingSong(song); setEditForm({ title: song.title, genre: song.genre || '', album: song.album || '' }); setEditImageFile(null); }} className="p-2 rounded-lg bg-black/50 hover:bg-musify-teal/80 text-white" title="Edit">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                  </button>
                                  <button onClick={async (e) => { e.stopPropagation(); if (confirm('Delete this song?')) { await singerService.deleteSong(song._id); fetchMySongs(); } }} className="p-2 rounded-lg bg-black/50 hover:bg-musify-pink/80 text-white" title="Delete">
                                    <DeleteIcon size="sm" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="p-4">
                              <p className="font-semibold text-white truncate">{song.title}</p>
                              <p className="text-musify-text-muted text-sm truncate mt-0.5">{song.artist}</p>
                              <div className="flex items-center justify-between mt-2 text-xs text-musify-text-muted">
                                <span>{song.genre || '—'}</span>
                                <span>{(song.playCount || 0).toLocaleString()} plays</span>
                              </div>
                              {song.duration != null && <p className="text-musify-text-muted text-xs mt-1">{Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}</p>}
                            </div>
                          </div>
                        ))}
                    </div>
                    {Math.ceil(songs.length / SONGS_PER_PAGE) > 1 && (
                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                        <p className="text-musify-text-muted text-sm">
                          Showing {((songsPage - 1) * SONGS_PER_PAGE) + 1}–{Math.min(songsPage * SONGS_PER_PAGE, songs.length)} of {songs.length} songs
                        </p>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSongsPage((p) => Math.max(1, p - 1))} disabled={songsPage <= 1} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition">
                            Previous
                          </button>
                          <span className="px-4 py-2 rounded-xl bg-musify-teal/20 text-musify-teal text-sm font-medium">
                            Page {songsPage} of {Math.ceil(songs.length / SONGS_PER_PAGE)}
                          </span>
                          <button onClick={() => setSongsPage((p) => Math.min(Math.ceil(songs.length / SONGS_PER_PAGE), p + 1))} disabled={songsPage >= Math.ceil(songs.length / SONGS_PER_PAGE)} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition">
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Edit Song Modal */}
              {editingSong && (
                <div className="modal-overlay" onClick={() => setEditingSong(null)} role="dialog" aria-modal="true">
                  <div className="modal-content relative p-8" onClick={(e) => e.stopPropagation()}>
                    <button type="button" onClick={() => setEditingSong(null)} className="modal-close-btn" aria-label="Close">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <form onSubmit={handleEditSong} className="space-y-6">
                      <div className="flex items-center gap-3 pb-4 border-b border-white/10 pr-12">
                        <div className="w-12 h-12 rounded-2xl bg-musify-teal/20 flex items-center justify-center shrink-0">
                          <svg className="w-6 h-6 text-musify-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">Edit Song</h2>
                          <p className="text-sm text-musify-text-muted">{editingSong.title}</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">Song Name</label>
                        <input value={editForm.title} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} required className="w-full px-4 py-3 rounded-xl input-premium text-white focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">Category</label>
                        <input value={editForm.genre} onChange={(e) => setEditForm((f) => ({ ...f, genre: e.target.value }))} placeholder="e.g. Pop, Rock" className="w-full px-4 py-3 rounded-xl input-premium text-white placeholder-musify-text-muted focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">Album</label>
                        <input value={editForm.album} onChange={(e) => setEditForm((f) => ({ ...f, album: e.target.value }))} placeholder="e.g. My First Album" className="w-full px-4 py-3 rounded-xl input-premium text-white placeholder-musify-text-muted focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">Cover Image</label>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 shrink-0">
                            {editImageFile ? (
                              <img src={URL.createObjectURL(editImageFile)} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <img src={getCoverImageUrl(editingSong.coverImage)} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                            )}
                          </div>
                          <div className="file-zone rounded-xl p-4 flex-1">
                            <label className="flex flex-col items-center justify-center cursor-pointer gap-2">
                              <span className="text-sm text-musify-text-muted">{editImageFile ? editImageFile.name : 'Click to add or change cover'}</span>
                              <input type="file" accept=".jpg,.jpeg,.png,.gif,.webp" onChange={(e) => setEditImageFile(e.target.files?.[0] || null)} className="hidden" />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                        <button type="submit" className="px-8 py-3.5 rounded-xl btn-upload-premium text-white font-semibold transition">Save Changes</button>
                        <button type="button" onClick={() => setEditingSong(null)} className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/90 font-medium transition">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ALBUMS PAGE */}
          {activeNav === 'albums' && (
            <>
              <div className="mb-6">
                <div className="rounded-2xl bg-musify-card border border-white/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">My Albums</h2>
                    <p className="text-musify-text-muted text-sm mt-0.5">Create albums and add your songs</p>
                  </div>
                  <button onClick={() => setShowCreateAlbum(true)} className="px-5 py-2.5 rounded-xl bg-musify-teal hover:bg-musify-accent-hover text-white font-medium text-sm transition flex items-center gap-2 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Create Album
                  </button>
                </div>
              </div>
              <div className="rounded-2xl bg-musify-card border border-white/10 p-6">
                {albumsLoading ? (
                  <div className="flex justify-center py-12">
                    <span className="w-10 h-10 border-2 border-musify-teal/40 border-t-musify-teal rounded-full animate-spin" />
                  </div>
                ) : albums.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-musify-teal/20 flex items-center justify-center mx-auto mb-4">
                      <AlbumIcon className="w-8 h-8 text-musify-teal" />
                    </div>
                    <p className="text-white font-medium">No albums yet</p>
                    <p className="text-musify-text-muted text-sm mt-1">Create an album and add your songs to it</p>
                    <button onClick={() => setShowCreateAlbum(true)} className="mt-4 px-6 py-2.5 rounded-xl bg-musify-teal hover:bg-musify-accent-hover text-white font-medium text-sm transition">
                      Create Album
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {albums.map((album) => {
                      const songCount = Array.isArray(album.songs) ? album.songs.length : 0;
                      const firstSong = Array.isArray(album.songs) && album.songs.length > 0 ? (album.songs[0] as { coverImage?: string }) : null;
                      const coverUrl = album.coverImage || firstSong?.coverImage;
                      return (
                        <div key={album._id} className="rounded-xl bg-white/5 border border-white/10 p-4 hover:border-musify-teal/30 transition">
                          <Link href={`/album?album=${encodeURIComponent(album.name)}&artist=${encodeURIComponent(album.artist)}`} className="block">
                            <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-white/5">
                              <img src={getCoverImageUrl(coverUrl)} alt={album.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                            </div>
                            <h3 className="font-semibold text-white truncate">{album.name}</h3>
                            <p className="text-sm text-musify-text-muted">{songCount} song{songCount !== 1 ? 's' : ''}</p>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* STATISTICS PAGE: Song statistics */}
          {activeNav === 'streams' && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {kpis.map((kpi, i) => (
                  <div key={i} className="rounded-2xl bg-musify-card border border-white/10 p-6">
                    <p className="text-sm font-medium text-musify-text-muted mb-1">{kpi.label}</p>
                    <p className="text-3xl font-bold text-white">{kpi.value}</p>
                    {(kpi.change !== 0) && (
                      <p className={`text-sm font-medium mt-2 flex items-center gap-1 ${kpi.positive ? 'text-musify-teal' : 'text-musify-pink'}`}>
                        {kpi.positive ? <span>↑</span> : <span>↓</span>}+{kpi.change}% for 7 last days
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl bg-musify-card border border-white/10 p-6">
                  <p className="text-sm font-medium text-musify-text-muted mb-1">Song Plays</p>
                  <p className="text-3xl font-bold text-white mb-1">{(stats?.totalPlays ?? 0).toLocaleString()}</p>
                  <p className="text-sm font-medium text-musify-teal mb-6">+{weekTotal > 0 ? Math.round((weekTotal / 7) * 10) : 0}% for 7 last days</p>
                  <div className="h-40">
                    <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                      <defs>
                        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {(() => {
                        const w = 400; const h = 100; const pad = 10;
                        const prevWeek = weeklyStreams.map((v) => Math.max(0, Math.floor(v * 0.75)));
                        const maxVal = Math.max(...weeklyStreams, ...prevWeek, 1);
                        const pts1 = weeklyStreams.map((v, i) => ({ x: pad + (i / (DAYS.length - 1)) * (w - 2 * pad), y: (v / maxVal) * (h - 2 * pad) }));
                        const chartH = h - pad;
                        return (
                          <>
                            <path d={smoothPath(pts1, chartH) + ' L ' + pts1[pts1.length - 1].x + ' ' + chartH + ' L ' + pts1[0].x + ' ' + chartH + ' Z'} fill="url(#blueGrad)" />
                            <path d={smoothPath(pts1, chartH)} fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="neon-teal" />
                            {DAYS.map((d, i) => (
                              <text key={d} x={pad + (i / (DAYS.length - 1)) * (w - 2 * pad)} y={115} fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle">{d}</text>
                            ))}
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                </div>
                <div className="rounded-2xl bg-musify-card border border-white/10 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Approval status</h3>
                  <div className="relative w-40 h-40 mx-auto">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray={`${approvedPct} ${100 - approvedPct}`} strokeLinecap="round" className="neon-teal" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-2xl font-bold text-white">{approvedPct}%</p>
                      <p className="text-musify-text-muted text-xs">Approved</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* DASHBOARD (overview): Song statistics - platform design */}
          {!['songs', 'albums', 'streams', 'profile'].includes(activeNav) && (
            <>
              {/* Welcome banner */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Welcome, {profile?.stageName || user?.name || 'Artist'}</h2>
                <p className="text-musify-text-muted mt-1">Here&apos;s your music portfolio overview</p>
              </div>

              {/* Total Song Plays card - with subtle texture */}
              <div className="rounded-2xl bg-musify-card border border-white/10 p-6 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse 80% 50% at 0% 0%, #06b6d4, transparent 60%)' }} />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-musify-text-muted text-sm mb-1">Total Song Plays</p>
                    <p className="text-4xl font-bold text-white">{totalPlays.toLocaleString()}</p>
                    <p className="text-sm mt-2 flex items-center gap-1">
                      <span className="text-musify-teal">↑ Return +{weekTotal > 0 ? Math.round((weekTotal / 7) * 10) : 0}%</span>
                      <span className="text-musify-text-muted">({weekTotal.toLocaleString()} this week)</span>
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {(['1D','1W','1M','6M','1Y'] as const).map((p) => (
                      <button key={p} onClick={() => setChartPeriod(p)} className={`px-3 py-1.5 rounded-xl text-sm font-medium transition ${chartPeriod === p ? 'bg-musify-teal text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>{p}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* My Portfolio - song cards */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">My Portfolio</h3>
                <Link href="/singer-dashboard?nav=songs" className="text-sm text-musify-teal hover:underline">See all</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                {portfolioSongs.length === 0 ? (
                  <div className="col-span-full rounded-2xl bg-musify-card border border-white/10 p-8 text-center">
                    <p className="text-musify-text-muted">No songs yet. <Link href="/singer-dashboard?nav=songs" className="text-musify-teal hover:underline">Upload your first track</Link></p>
                  </div>
                ) : (
                  portfolioSongs.map((song) => (
                    <div key={song._id} className="rounded-2xl bg-musify-card border border-white/10 p-4">
                      <div className="w-12 h-12 rounded-xl bg-musify-teal/20 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-musify-teal" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                      <p className="font-semibold text-white truncate">{song.title}</p>
                      <p className="text-musify-teal text-sm mt-1">+{(song.playCount || 0) > 0 ? '12' : '0'}%</p>
                      <p className="text-musify-text-muted text-xs mt-1">{song.artist}</p>
                      <p className="text-musify-text-muted text-xs">{(song.playCount || 0).toLocaleString()} plays</p>
                    </div>
                  ))
                )}
              </div>

              {/* Portfolio Performance chart */}
              <div className="rounded-2xl bg-musify-card border border-white/10 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Song Performance</h3>
                  <div className="flex gap-1">
                    {(['1D','1W','1M','6M','1Y'] as const).map((p) => (
                      <button key={p} onClick={() => setChartPeriod(p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${chartPeriod === p ? 'bg-musify-teal text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>{p}</button>
                    ))}
                  </div>
                </div>
                <div className="h-48">
                  <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <linearGradient id="dashBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {(() => {
                      const w = 400; const h = 100; const pad = 10;
                      const maxVal = Math.max(...weeklyStreams, 1);
                      const pts1 = weeklyStreams.map((v, i) => ({ x: pad + (i / (DAYS.length - 1)) * (w - 2 * pad), y: (v / maxVal) * (h - 2 * pad) }));
                      const chartH = h - pad;
                      const peakIdx = weeklyStreams.indexOf(Math.max(...weeklyStreams));
                      const peak = pts1[peakIdx];
                      return (
                        <>
                          <path d={smoothPath(pts1, chartH) + ' L ' + pts1[pts1.length - 1].x + ' ' + chartH + ' L ' + pts1[0].x + ' ' + chartH + ' Z'} fill="url(#dashBlueGrad)" />
                          <path d={smoothPath(pts1, chartH)} fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="neon-teal" />
                          {peak && <circle cx={peak.x} cy={chartH - peak.y} r="5" fill="white" className="neon-blue" />}
                          {DAYS.map((d, i) => (
                            <text key={d} x={pad + (i / (DAYS.length - 1)) * (w - 2 * pad)} y={115} fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle">{d}</text>
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>

              {/* Portfolio Overview table + Watchlist */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl bg-musify-card border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Portfolio Overview</h3>
                    <div className="flex gap-1">
                      {(['all','gainers','losers'] as const).map((f) => (
                        <button key={f} onClick={() => setTableFilter(f)} className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition ${tableFilter === f ? 'bg-musify-teal text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>{f}</button>
                      ))}
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-musify-text-muted text-left border-b border-white/5">
                          <th className="pb-3 font-medium">Song</th>
                          <th className="pb-3 font-medium">Plays</th>
                          <th className="pb-3 font-medium">Change</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topSongs.length === 0 ? (
                          <tr><td colSpan={4} className="py-8 text-center text-musify-text-muted">No songs yet</td></tr>
                        ) : (
                          topSongs.map((song) => (
                          <tr key={song._id} className="border-b border-white/5 last:border-0">
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-musify-teal/20 flex items-center justify-center shrink-0">
                                  <svg className="w-4 h-4 text-musify-teal" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                </div>
                                <div>
                                  <p className="font-medium text-white">{song.title}</p>
                                  <p className="text-musify-text-muted text-xs">{song.artist}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 text-white">{(song.playCount || 0).toLocaleString()}</td>
                            <td className="py-3 text-musify-teal">+{(song.playCount || 0) > 0 ? '12' : '0'}%</td>
                            <td className="py-3">
                              <span className={`text-xs px-2 py-0.5 rounded ${song.isApproved ? 'bg-musify-teal/20 text-musify-teal' : 'bg-amber-500/20 text-amber-400'}`}>{song.isApproved ? 'Live' : 'Pending'}</span>
                            </td>
                          </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="rounded-2xl bg-musify-card border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Watchlist</h3>
                    <div className="flex gap-1">
                      {(['most','gainers','losers'] as const).map((f) => (
                        <button key={f} onClick={() => setWatchFilter(f)} className={`px-2 py-1 rounded-lg text-xs font-medium capitalize transition ${watchFilter === f ? 'bg-musify-teal text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>{f === 'most' ? 'Most Viewed' : f}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {topSongs.slice(0, 4).map((song) => (
                      <div key={song._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition">
                        <div className="w-10 h-10 rounded-lg bg-musify-teal/20 flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-musify-teal" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">{song.title}</p>
                          <p className="text-musify-text-muted text-xs">{song.artist}</p>
                        </div>
                        <span className="text-musify-teal text-sm font-medium">+{(song.playCount || 0) > 0 ? '12' : '0'}%</span>
                      </div>
                    ))}
                    {topSongs.length === 0 && (
                      <p className="text-musify-text-muted text-sm py-4 text-center">No songs in watchlist</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* PROFILE PAGE */}
          {activeNav === 'profile' && (
            <div className="rounded-2xl bg-musify-card border border-white/10 p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-musify-teal/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-musify-teal">{profile?.stageName?.[0]?.toUpperCase() || '?'}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{profile?.stageName || 'Artist'}</h3>
              <p className="text-musify-text-muted text-sm">{user?.email}</p>
            </div>
          )}
        </div>
      </main>

      {/* Create Album Modal */}
      {showCreateAlbum && (
        <div className="modal-overlay" onClick={() => { setShowCreateAlbum(false); setAlbumForm({ name: '' }); }} role="dialog" aria-modal="true">
          <div className="modal-content relative p-8 max-w-md" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => { setShowCreateAlbum(false); setAlbumForm({ name: '' }); }} className="modal-close-btn" aria-label="Close">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <form onSubmit={handleCreateAlbum} className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10 pr-12">
                <div className="w-12 h-12 rounded-2xl bg-musify-purple/20 flex items-center justify-center shrink-0">
                  <AlbumIcon className="w-6 h-6 text-musify-purple" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Create Album</h2>
                  <p className="text-sm text-musify-text-muted">Give your album a name</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Album Name</label>
                <input placeholder="e.g. Summer Vibes 2024" value={albumForm.name} onChange={(e) => setAlbumForm({ name: e.target.value })} required className="w-full px-4 py-3 rounded-xl input-premium text-white placeholder-musify-text-muted focus:outline-none" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button type="submit" className="px-8 py-3.5 rounded-xl btn-upload-premium text-white font-semibold transition">Create Album</button>
                <button type="button" onClick={() => { setShowCreateAlbum(false); setAlbumForm({ name: '' }); }} className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/90 font-medium transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add to Album Modal */}
      {addToAlbumSong && (
        <div className="modal-overlay" onClick={() => setAddToAlbumSong(null)} role="dialog" aria-modal="true">
          <div className="modal-content relative p-8 max-w-md" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setAddToAlbumSong(null)} className="modal-close-btn" aria-label="Close">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10 pr-12">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 shrink-0">
                  <img src={getCoverImageUrl(addToAlbumSong.coverImage)} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Add to Album</h2>
                  <p className="text-sm text-musify-text-muted">{addToAlbumSong.title}</p>
                </div>
              </div>
              {albums.length === 0 ? (
                <p className="text-musify-text-muted text-sm">No albums yet. Create an album first.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {albums.map((album) => {
                    const songList = (album.songs || []) as { _id?: string; coverImage?: string }[];
                    const isInAlbum = songList.some((s) => s?._id === addToAlbumSong._id);
                    const firstSong = songList[0];
                    const coverUrl = album.coverImage || firstSong?.coverImage;
                    return (
                      <button
                        key={album._id}
                        type="button"
                        onClick={() => !isInAlbum && handleAddSongToAlbum(album._id)}
                        disabled={isInAlbum}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition ${isInAlbum ? 'bg-white/5 text-musify-text-muted cursor-not-allowed' : 'bg-white/5 hover:bg-musify-teal/20 text-white'}`}
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 shrink-0">
                          <img src={getCoverImageUrl(coverUrl)} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{album.name}</p>
                          <p className="text-sm text-musify-text-muted">{songList.length} songs</p>
                        </div>
                        {isInAlbum ? <span className="text-xs text-musify-teal">Already in album</span> : <span className="text-musify-teal text-sm">Add</span>}
                      </button>
                    );
                  })}
                </div>
              )}
              <button type="button" onClick={() => setAddToAlbumSong(null)} className="w-full px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/90 font-medium transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Song Modal - popup overlay (visible from any tab) */}
      {showUpload && (
        <div className="modal-overlay" onClick={closeModal} role="dialog" aria-modal="true" aria-labelledby="create-song-title">
          <div className="modal-content relative p-8" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={closeModal} className="modal-close-btn" aria-label="Close">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10 pr-12">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-musify-teal/30 to-musify-purple/20 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-musify-teal" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg>
                </div>
                <div>
                  <h2 id="create-song-title" className="text-xl font-bold text-white">Create New Song</h2>
                  <p className="text-sm text-musify-text-muted">Upload your track and cover art</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Song Name</label>
                  <input placeholder="Enter song title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required className="w-full px-4 py-3 rounded-xl input-premium text-white placeholder-musify-text-muted focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Artist (you)</label>
                  <input value={form.artist || profile?.stageName || ''} readOnly placeholder="Your stage name" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 cursor-not-allowed" />
                </div>
                <div className="sm:col-span-2 relative">
                  <label className="block text-sm font-medium text-white/90 mb-2">Add to Album</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={albumSearchOpen ? albumSearchQuery : (selectedAlbumForCreate?.name || form.album || '')}
                      onChange={(e) => {
                        setAlbumSearchQuery(e.target.value);
                        setAlbumSearchOpen(true);
                        if (!albumSearchOpen) setAlbumSearchQuery('');
                      }}
                      onFocus={() => {
                        setAlbumSearchOpen(true);
                        setAlbumSearchQuery('');
                      }}
                      onBlur={() => setTimeout(() => setAlbumSearchOpen(false), 150)}
                      placeholder="Search album to add song to..."
                      className="w-full px-4 py-3 pl-10 rounded-xl input-premium text-white placeholder-musify-text-muted focus:outline-none"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-musify-text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {selectedAlbumForCreate && !albumSearchOpen && (
                      <button type="button" onClick={() => { setSelectedAlbumForCreate(null); setForm((f) => ({ ...f, album: '' })); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-musify-text-muted hover:text-white" title="Clear">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                    {albumSearchOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 py-2 rounded-xl bg-musify-card border border-white/10 shadow-xl max-h-56 overflow-y-auto z-10">
                        {filteredAlbums.length === 0 ? (
                          <p className="px-4 py-3 text-musify-text-muted text-sm">No album found. Create one in the Albums tab.</p>
                        ) : (
                          filteredAlbums.map((alb) => (
                            <button
                              key={alb._id}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setSelectedAlbumForCreate({ _id: alb._id, name: alb.name });
                                setForm((f) => ({ ...f, album: alb.name }));
                                setAlbumSearchOpen(false);
                                setAlbumSearchQuery('');
                              }}
                              className={`w-full px-4 py-2.5 text-left text-sm transition flex items-center gap-3 ${selectedAlbumForCreate?._id === alb._id ? 'bg-musify-teal/30 text-musify-teal' : 'text-white hover:bg-white/10'}`}
                            >
                              <span className="flex-1 truncate">{alb.name}</span>
                              <span className="text-musify-text-muted text-xs">{(alb.songs || []).length} songs</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2 relative">
                  <label className="block text-sm font-medium text-white/90 mb-2">Category</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={categoryOpen ? categorySearch : form.genre}
                      onChange={(e) => {
                        setCategorySearch(e.target.value);
                        setCategoryOpen(true);
                      }}
                      onFocus={() => {
                        setCategoryOpen(true);
                        setCategorySearch('');
                      }}
                      onBlur={() => setTimeout(() => setCategoryOpen(false), 150)}
                      placeholder="Search category..."
                      className="w-full px-4 py-3 pl-10 rounded-xl input-premium text-white placeholder-musify-text-muted focus:outline-none"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-musify-text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {categoryOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 py-2 rounded-xl bg-musify-card border border-white/10 shadow-xl max-h-56 overflow-y-auto z-10">
                        {filteredCategories.length === 0 ? (
                          <p className="px-4 py-3 text-musify-text-muted text-sm">No category found</p>
                        ) : (
                          filteredCategories.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setForm((f) => ({ ...f, genre: cat }));
                                setCategoryOpen(false);
                                setCategorySearch('');
                              }}
                              className={`w-full px-4 py-2.5 text-left text-sm transition ${form.genre === cat ? 'bg-musify-teal/30 text-musify-teal' : 'text-white hover:bg-white/10'}`}
                            >
                              {cat}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="file-zone rounded-2xl p-6">
                  <label className="flex flex-col items-center justify-center cursor-pointer gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-musify-teal/20 flex items-center justify-center">
                      <svg className="w-7 h-7 text-musify-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-white">MP3 Song File</p>
                      <p className="text-sm text-musify-text-muted mt-0.5">{audioFile ? audioFile.name : 'Click or drag to upload'}</p>
                    </div>
                    <input
                      type="file"
                      accept=".mp3,.m4a,.wav,.ogg"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setAudioFile(file);
                        if (file) {
                          const audio = new Audio();
                          audio.src = URL.createObjectURL(file);
                          audio.onloadedmetadata = () => {
                            setForm((f) => ({ ...f, duration: Math.round(audio.duration) || 180 }));
                            URL.revokeObjectURL(audio.src);
                          };
                          audio.onerror = () => setForm((f) => ({ ...f, duration: 180 }));
                        }
                      }}
                      required
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Cover Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/10">
                      {imageFile ? (
                        <img src={URL.createObjectURL(imageFile)} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-musify-text-muted">
                          <svg className="w-8 h-8 mb-1 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          <span className="text-xs">No cover</span>
                        </div>
                      )}
                    </div>
                    <div className="file-zone rounded-xl p-4 flex-1">
                      <label className="flex flex-col items-center justify-center cursor-pointer gap-2">
                        <span className="text-sm text-musify-text-muted">{imageFile ? imageFile.name : 'Click to add cover (JPG, PNG)'}</span>
                        <input type="file" accept=".jpg,.jpeg,.png,.gif,.webp" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button type="submit" disabled={uploading} className="px-8 py-3.5 rounded-xl btn-upload-premium text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      Upload Song
                    </span>
                  )}
                </button>
                <button type="button" onClick={closeModal} className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/90 font-medium transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
