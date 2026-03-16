'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { adminService } from '@/services/adminService';
import { AdminTable } from '@/components/AdminTable';
import { AdminFilter } from '@/components/AdminFilter';

type Tab = 'overview' | 'users' | 'singers' | 'songs' | 'sessions';

const OverviewIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const SingersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
  </svg>
);

const SongsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
  </svg>
);

const SessionsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
  </svg>
);

const TotalIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
  </svg>
);

const HeadphonesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
  </svg>
);

const MicIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
  </svg>
);

const AdminIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
  </svg>
);

const BanIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const WifiIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
  </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
  </svg>
);

const BackIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
);

const HelpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
  </svg>
);

const ArrowUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
  </svg>
);

const AddIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const ArrowUpRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M7 17V7h2v6.59L16.59 5 19 7.41 11.41 15H7z" />
  </svg>
);

function KPICard({
  label,
  value,
  sub,
  icon,
  primary,
}: {
  label: string;
  value: number;
  sub?: string;
  icon: React.ReactNode;
  primary?: boolean;
}) {
  if (primary) {
    return (
      <div className="group relative overflow-hidden rounded-3xl bg-musify-teal p-6 shadow-lg shadow-cyan-900/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-900/40 hover:scale-[1.02]">
        <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-white/20" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-white/90 text-xs font-semibold uppercase tracking-wider">{label}</p>
            <p className="text-4xl font-bold text-white mt-2 tracking-tight tabular-nums">{value.toLocaleString()}</p>
            {sub && <p className="text-white/80 text-sm mt-1.5">{sub}</p>}
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 [&>svg]:text-white">
            {icon}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-musify-card border border-white/10 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-white/20 hover:bg-musify-card-hover">
      <div className="absolute right-4 top-4 w-12 h-12 rounded-full bg-musify-teal/20 flex items-center justify-center [&>svg]:text-musify-teal">
        {icon}
      </div>
      <div className="relative">
        <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-bold text-white mt-2 tracking-tight tabular-nums">{value.toLocaleString()}</p>
        {sub && <p className="text-white/50 text-sm mt-1.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user, loading, logout } = useAuth();
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [users, setUsers] = useState<unknown[]>([]);
  const [pendingSingers, setPendingSingers] = useState<unknown[]>([]);
  const [allSongs, setAllSongs] = useState<unknown[]>([]);
  const [sessions, setSessions] = useState<unknown[]>([]);
  const [tab, setTab] = useState<Tab>('overview');
  // Filters
  const [userSearch, setUserSearch] = useState('');
  const [userRole, setUserRole] = useState('all');
  const [userBanned, setUserBanned] = useState('all');
  const [singerSearch, setSingerSearch] = useState('');
  const [songSearch, setSongSearch] = useState('');
  const [sessionSearch, setSessionSearch] = useState('');
  const [overviewSearch, setOverviewSearch] = useState('');
  const [banLoadingId, setBanLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) window.location.href = '/login';
    if (user?.role !== 'ADMIN') window.location.href = '/';
  }, [user, loading]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      adminService.getStats().then(({ data }) => setStats(data));
      adminService.getUsers().then(({ data }) => setUsers(data));
      adminService.getPendingSingers().then(({ data }) => setPendingSingers(data));
      adminService.getAllSongs().then(({ data }) => setAllSongs(data));
      adminService.getSessions().then(({ data }) => setSessions(data));
    }
  }, [user]);

  const refresh = () => {
    adminService.getStats().then(({ data }) => setStats(data));
    adminService.getUsers().then(({ data }) => setUsers(data));
    adminService.getPendingSingers().then(({ data }) => setPendingSingers(data));
    adminService.getAllSongs().then(({ data }) => setAllSongs(data));
    adminService.getSessions().then(({ data }) => setSessions(data));
  };

  // Filtered data
  const filteredUsers = (users as { name: string; email: string; role: string; isBanned: boolean; _id: string }[])
    .map((u) => ({ ...u, isBanned: u.isBanned ? 'Yes' : 'No' }))
    .filter((u) => {
      const q = userSearch.toLowerCase();
      const matchSearch = !q || (u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
      const matchRole = userRole === 'all' || u.role === userRole;
      const matchBanned = userBanned === 'all' || (userBanned === 'yes' && u.isBanned === 'Yes') || (userBanned === 'no' && u.isBanned === 'No');
      return matchSearch && matchRole && matchBanned;
    });

  const pendingSingersMapped = (pendingSingers as { stageName: string; userId?: { email?: string }; _id: string }[]).map(
    (s) => ({ ...s, 'userId.email': s.userId?.email ?? '-' })
  );
  const filteredSingers = pendingSingersMapped.filter((s) => {
    const q = singerSearch.toLowerCase();
    return !q || (s.stageName?.toLowerCase().includes(q) || (s.userId?.email ?? '').toLowerCase().includes(q));
  });

  const filteredSongs = (allSongs as { title: string; artist: string; _id: string }[]).filter((s) => {
    const q = songSearch.toLowerCase();
    return !q || (s.title?.toLowerCase().includes(q) || s.artist?.toLowerCase().includes(q));
  });

  const sessionsMapped = (sessions as { userId?: { name?: string }; deviceId: string; lastActivity: string }[]).map(
    (s) => ({
      ...s,
      'userId.name': s.userId?.name ?? '-',
      lastActivity: new Date(s.lastActivity).toLocaleString(),
    })
  );
  const filteredSessions = sessionsMapped.filter((s) => {
    const q = sessionSearch.toLowerCase();
    return !q || ((s['userId.name'] ?? '').toLowerCase().includes(q) || (s.deviceId ?? '').toLowerCase().includes(q));
  });

  const filteredRecentSongs = (allSongs as { title: string; artist: string }[]).filter((s) => {
    const q = overviewSearch.toLowerCase();
    return !q || (s.title?.toLowerCase().includes(q) || s.artist?.toLowerCase().includes(q));
  }).slice(0, 4);
  const filteredRecentSessions = sessionsMapped.filter((s) => {
    const q = overviewSearch.toLowerCase();
    return !q || ((s['userId.name'] ?? '').toLowerCase().includes(q) || (s.deviceId ?? '').toLowerCase().includes(q));
  }).slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-musify-dark">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl border-2 border-musify-teal/20 border-t-musify-teal animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium">Loading dashboard</p>
            <p className="text-white/50 text-sm mt-1">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: OverviewIcon },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'singers', label: 'Singers', icon: SingersIcon },
    { id: 'songs', label: 'Songs', icon: SongsIcon },
    { id: 'sessions', label: 'Sessions', icon: SessionsIcon },
  ];

  return (
    <div className="min-h-screen flex bg-musify-dark">
      {/* Sidebar - same as platform */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 z-30 bg-musify-sidebar flex flex-col border-r border-white/5">
        <Link href="/" className="p-6 flex items-center gap-3 hover:opacity-90 transition">
          <img src="/musify-logo.png" alt="Musify" className="w-10 h-10 object-contain" />
          <span className="text-xl font-bold bg-gradient-to-r from-musify-teal to-musify-purple bg-clip-text text-transparent">
            Musify<span className="text-musify-teal">.</span>
          </span>
        </Link>

        <div className="px-3 py-2 border-b border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-musify-text-secondary hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <BackIcon className="w-5 h-5" />
            <span className="font-medium">Back to Musify</span>
          </Link>
        </div>

        <div className="px-3 py-4 flex-1">
          <div className="flex items-center gap-3 px-3 py-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-musify-teal/20 flex items-center justify-center">
              <ShieldIcon className="w-4 h-4 text-musify-teal" />
            </div>
            <span className="font-bold text-white">Admin</span>
          </div>
          <p className="px-3 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">MENU</p>
          <nav className="space-y-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative w-full flex items-center gap-4 py-3 pl-6 pr-4 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-musify-frosted text-white'
                      : 'text-musify-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-musify-teal" />
                  )}
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-musify-teal' : ''}`} />
                  <span className="font-semibold">{t.label}</span>
                </button>
              );
            })}
          </nav>
          <p className="px-3 mt-6 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">GENERAL</p>
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-4 py-3 pl-6 pr-4 rounded-xl text-musify-text-secondary hover:text-white hover:bg-white/5 transition">
              <SettingsIcon className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
            <button className="w-full flex items-center gap-4 py-3 pl-6 pr-4 rounded-xl text-musify-text-secondary hover:text-white hover:bg-white/5 transition">
              <HelpIcon className="w-5 h-5" />
              <span className="font-medium">Help</span>
            </button>
            <button onClick={async () => { await logout(); window.location.href = '/'; }} className="w-full flex items-center gap-4 py-3 pl-6 pr-4 rounded-xl text-musify-text-secondary hover:text-white hover:bg-white/5 transition text-left">
              <LogoutIcon className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </div>
        <div className="p-4 m-3 rounded-2xl bg-musify-teal">
          <p className="font-bold text-sm text-white">Musify Admin</p>
          <p className="text-white/90 text-xs mt-1">Manage your platform with ease.</p>
          <Link href="/" className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/30 text-white text-xs font-medium hover:bg-white/10 transition">
            Back to App
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 overflow-auto bg-musify-dark min-h-screen flex flex-col">
        {/* Top header bar */}
        <div className="sticky top-0 z-20 flex items-center gap-4 px-8 py-4 bg-musify-dark/95 backdrop-blur border-b border-white/5">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-musify-card border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-musify-teal/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-xs">⌘F</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition">
              <MailIcon className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition relative">
              <BellIcon className="w-5 h-5" />
              {(pendingSingers as unknown[]).length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-musify-teal" />
              )}
            </button>
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-white/10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-musify-teal to-musify-purple flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{user?.name ?? 'Admin'}</p>
                <p className="text-white/50 text-xs">{user?.email ?? ''}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white capitalize tracking-tight">
              {tab === 'overview' ? 'Dashboard' : tab}
            </h1>
            <p className="text-white/50 text-sm mt-1">
              {tab === 'overview' ? 'Plan, prioritize, and manage your platform with ease.' : `Manage ${tab} across the platform`}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={refresh}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-musify-teal hover:bg-musify-accent-hover text-white font-medium transition-all duration-200"
            >
              <AddIcon className="w-4 h-4" />
              Refresh Data
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-musify-card border border-musify-teal/50 text-musify-teal hover:bg-musify-teal/10 font-medium transition-all duration-200">
              Export Data
            </button>
          </div>
        </div>

        {tab === 'overview' && stats && (
          <>
          <div className="mb-6 rounded-2xl bg-musify-card border border-white/10 overflow-hidden">
            <AdminFilter
              searchPlaceholder="Search songs, artists, sessions..."
              searchValue={overviewSearch}
              onSearchChange={setOverviewSearch}
              onClear={() => setOverviewSearch('')}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Row 1: KPI Cards */}
            <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <KPICard label="Total Users" value={stats.totalUsers ?? 0} icon={<TotalIcon className="w-7 h-7" />} primary />
              <KPICard label="Listeners" value={stats.listeners ?? 0} icon={<HeadphonesIcon className="w-6 h-6" />} sub="Active listeners" />
              <KPICard label="Artists" value={stats.artists ?? 0} icon={<MicIcon className="w-6 h-6" />} sub="Approved singers" />
              <KPICard label="Pending" value={stats.pendingSingers ?? 0} icon={<ClockIcon className="w-6 h-6" />} sub="Singers awaiting approval" />
            </div>

            {/* Row 2: Analytics + Reminders */}
            <div className="rounded-3xl bg-musify-card border border-white/10 p-6">
              <h3 className="text-white font-bold mb-4">Platform Analytics</h3>
              <div className="space-y-4">
                {['USER', 'SINGER', 'ADMIN'].map((role, i) => {
                  const count = role === 'USER' ? (stats.listeners ?? 0) : role === 'SINGER' ? (stats.artists ?? 0) : (stats.admins ?? 0);
                  const max = Math.max(stats.listeners ?? 0, stats.artists ?? 0, stats.admins ?? 0, 1);
                  const pct = Math.round((count / max) * 100);
                  const colors = role === 'USER' ? 'bg-musify-teal' : role === 'SINGER' ? 'bg-musify-purple' : 'bg-rose-500';
                  return (
                    <div key={role}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/80">{role}</span>
                        <span className="text-white font-medium">{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className={`h-full rounded-full ${colors} transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-3xl bg-musify-card border border-white/10 p-6">
              <h3 className="text-white font-bold mb-4">Pending Approvals</h3>
              <p className="text-white/70 text-sm mb-4">
                {(pendingSingers as unknown[]).length > 0
                  ? `${(pendingSingers as unknown[]).length} singers need approval`
                  : 'No pending approvals'}
              </p>
              <button onClick={() => setTab('singers')} className="w-full py-3 rounded-xl bg-musify-teal hover:bg-musify-accent-hover text-white font-medium flex items-center justify-center gap-2">
                <PlayIcon className="w-4 h-4" />
                Review Now
              </button>
            </div>

            {/* Row 3: Recent Songs + Active Sessions */}
            <div className="rounded-3xl bg-musify-card border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">Recent Songs</h3>
                <button onClick={() => setTab('songs')} className="text-musify-teal text-sm font-medium hover:underline">View all</button>
              </div>
              <div className="space-y-3">
                {filteredRecentSongs.length > 0 ? (
                  filteredRecentSongs.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                      <div className="w-8 h-8 rounded-lg bg-musify-teal/20 flex items-center justify-center">
                        <SongsIcon className="w-4 h-4 text-musify-teal" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{s.title}</p>
                        <p className="text-white/50 text-xs">{s.artist}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white/50 text-sm">No songs yet</p>
                )}
              </div>
            </div>
            <div className="rounded-3xl bg-musify-card border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">Active Sessions</h3>
                <button onClick={() => setTab('sessions')} className="text-musify-teal text-sm font-medium hover:underline">View all</button>
              </div>
              <div className="space-y-3">
                {filteredRecentSessions.length > 0 ? (
                  filteredRecentSessions.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                      <div className="w-10 h-10 rounded-full bg-musify-purple/20 flex items-center justify-center text-musify-purple font-bold text-sm">
                        {s.userId?.name?.charAt(0) ?? '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{s.userId?.name ?? 'Unknown'}</p>
                        <span className="inline-flex px-2 py-0.5 rounded-lg text-xs font-medium bg-musify-teal/20 text-musify-teal">Online</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white/50 text-sm">No active sessions</p>
                )}
              </div>
            </div>

            {/* Row 4: Progress + Time Tracker style */}
            <div className="rounded-3xl bg-musify-card border border-white/10 p-6">
              <h3 className="text-white font-bold mb-4">Content Progress</h3>
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="url(#teal)"
                      strokeWidth="2"
                      strokeDasharray={`${((stats.totalSongs ?? 0) / Math.max((stats.totalSongs ?? 0) + (stats.pendingSongs ?? 0), 1)) * 100}, 100`}
                    />
                    <defs>
                      <linearGradient id="teal" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {((stats.totalSongs ?? 0) + (stats.pendingSongs ?? 0)) ? Math.round(((stats.totalSongs ?? 0) / ((stats.totalSongs ?? 0) + (stats.pendingSongs ?? 0))) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-musify-teal" />
                    <span className="text-white/80 text-sm">Approved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-white/80 text-sm">Pending</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 rounded-3xl bg-musify-teal p-6">
              <h3 className="text-white font-bold mb-4">Active Now</h3>
              <p className="text-5xl font-bold text-white tabular-nums">{(sessions as unknown[]).length}</p>
              <p className="text-white/80 text-sm mt-1">Users online</p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setTab('sessions')} className="p-3 rounded-xl bg-white/20 hover:bg-white/30 transition">
                  <WifiIcon className="w-5 h-5 text-white" />
                </button>
                <button onClick={refresh} className="p-3 rounded-xl bg-white/20 hover:bg-white/30 transition">
                  <RefreshIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
          </>
        )}

        {tab === 'users' && (
          <>
            {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              <KPICard label="Total Users" value={stats.totalUsers ?? 0} icon={<TotalIcon className="w-7 h-7" />} primary />
              <KPICard label="Listeners" value={stats.listeners ?? 0} icon={<HeadphonesIcon className="w-6 h-6" />} />
              <KPICard label="Artists" value={stats.artists ?? 0} icon={<MicIcon className="w-6 h-6" />} />
              <KPICard label="Admins" value={stats.admins ?? 0} icon={<AdminIcon className="w-6 h-6" />} />
              <KPICard label="Banned" value={stats.bannedUsers ?? 0} icon={<BanIcon className="w-6 h-6" />} />
            </div>
            )}
            <div className="rounded-3xl bg-musify-card border border-white/10 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-white/10 bg-white/5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-musify-teal/20 flex items-center justify-center">
                <UsersIcon className="w-4 h-4 text-musify-teal" />
              </div>
              <h2 className="text-lg font-bold text-white">All Users</h2>
            </div>
            <AdminFilter
              searchPlaceholder="Search by name or email..."
              searchValue={userSearch}
              onSearchChange={setUserSearch}
              roleFilter={{ value: userRole, onChange: setUserRole }}
              bannedFilter={{ value: userBanned, onChange: setUserBanned }}
              resultCount={filteredUsers.length}
              totalCount={(users as unknown[]).length}
              onClear={() => { setUserSearch(''); setUserRole('all'); setUserBanned('all'); }}
            />
            <AdminTable
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                {
                  key: 'role',
                  label: 'Role',
                  render: (v) => {
                    const role = String(v ?? '');
                    const styles =
                      role === 'ADMIN'
                        ? 'bg-rose-500/20 text-rose-400'
                        : role === 'SINGER'
                          ? 'bg-musify-purple/20 text-musify-purple'
                          : 'bg-musify-teal/20 text-musify-teal';
                    return (
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${styles}`}>
                        {role}
                      </span>
                    );
                  },
                },
                {
                  key: 'isBanned',
                  label: 'Banned',
                  render: (v) => (
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        v === 'Yes' ? 'bg-amber-500/20 text-amber-400' : 'bg-musify-teal/20 text-musify-teal'
                      }`}
                    >
                      {String(v ?? '-')}
                    </span>
                  ),
                },
              ]}
              data={filteredUsers}
              actions={(row) => {
                const r = row as { _id: string; isBanned: string; role: string };
                const isBanned = r.isBanned === 'Yes';
                const isSelf = r._id === user?.id;
                const isLoading = banLoadingId === r._id;
                const handleBanUnban = async () => {
                  if (isSelf && !isBanned) {
                    alert('You cannot ban yourself.');
                    return;
                  }
                  if (!isBanned && !confirm(`Ban ${(row as { name?: string }).name ?? 'this user'}? They will no longer be able to sign in.`)) return;
                  setBanLoadingId(r._id);
                  try {
                    await (isBanned ? adminService.unbanUser(r._id) : adminService.banUser(r._id));
                    refresh();
                  } catch (err: unknown) {
                    const msg = err && typeof err === 'object' && 'response' in err && (err as { response?: { data?: { message?: string } } }).response?.data?.message;
                    alert(msg || 'Failed to update user. Please try again.');
                  } finally {
                    setBanLoadingId(null);
                  }
                };
                return (
                  <button
                    onClick={handleBanUnban}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isLoading
                        ? 'bg-white/10 text-white/50 cursor-not-allowed'
                        : isBanned
                          ? 'bg-musify-teal/20 text-musify-teal hover:bg-musify-teal/30'
                          : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                    }`}
                  >
                    {isLoading ? '...' : isBanned ? 'Unban' : 'Ban'}
                  </button>
                );
              }}
            />
          </div>
          </>
        )}

        {tab === 'singers' && (
          <>
            {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <KPICard label="Total Singers" value={(stats.totalSingers ?? 0) + (stats.pendingSingers ?? 0)} icon={<SingersIcon className="w-7 h-7" />} primary />
              <KPICard label="Approved" value={stats.totalSingers ?? 0} icon={<CheckIcon className="w-6 h-6" />} />
              <KPICard label="Pending" value={stats.pendingSingers ?? 0} icon={<ClockIcon className="w-6 h-6" />} />
            </div>
            )}
            <div className="rounded-3xl bg-musify-card border border-white/10 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-white/10 bg-white/5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-musify-purple/20 flex items-center justify-center">
                <SingersIcon className="w-4 h-4 text-musify-purple" />
              </div>
              <h2 className="text-lg font-bold text-white">Pending Singers</h2>
            </div>
            <AdminFilter
              searchPlaceholder="Search by stage name or email..."
              searchValue={singerSearch}
              onSearchChange={setSingerSearch}
              resultCount={filteredSingers.length}
              totalCount={(pendingSingers as unknown[]).length}
              onClear={() => setSingerSearch('')}
            />
            <AdminTable
              columns={[
                { key: 'stageName', label: 'Stage Name' },
                { key: 'userId.email', label: 'Email' },
              ]}
              data={filteredSingers}
              actions={(row) => (
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={async () => {
                      await adminService.approveSinger((row as { _id: string })._id);
                      refresh();
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 bg-musify-teal/20 text-musify-teal hover:bg-musify-teal/30"
                  >
                    Approve
                  </button>
                  <button
                    onClick={async () => {
                      await adminService.rejectSinger((row as { _id: string })._id);
                      refresh();
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                  >
                    Reject
                  </button>
                </div>
              )}
            />
          </div>
          </>
        )}

        {tab === 'songs' && (
          <>
            {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <KPICard label="Total Songs" value={stats.totalSongs ?? 0} icon={<SongsIcon className="w-7 h-7" />} primary />
              <KPICard label="Total Plays" value={stats.totalPlays ?? 0} icon={<PlayIcon className="w-6 h-6" />} />
            </div>
            )}
            <div className="rounded-3xl bg-musify-card border border-white/10 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-white/10 bg-white/5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-musify-teal/20 flex items-center justify-center">
                <SongsIcon className="w-4 h-4 text-musify-teal" />
              </div>
              <h2 className="text-lg font-bold text-white">All Songs</h2>
            </div>
            <AdminFilter
              searchPlaceholder="Search by title or artist..."
              searchValue={songSearch}
              onSearchChange={setSongSearch}
              resultCount={filteredSongs.length}
              totalCount={(allSongs as unknown[]).length}
              onClear={() => setSongSearch('')}
            />
            <AdminTable
              columns={[
                { key: 'title', label: 'Title' },
                { key: 'artist', label: 'Artist' },
              ]}
              data={filteredSongs}
              actions={(row) => (
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={async () => {
                      if (confirm('Delete this song?')) {
                        await adminService.deleteSong((row as { _id: string })._id);
                        refresh();
                      }
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                  >
                    Delete
                  </button>
                </div>
              )}
            />
          </div>
          </>
        )}

        {tab === 'sessions' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <KPICard label="Active Sessions" value={(sessions as unknown[]).length} sub="Users online now" icon={<WifiIcon className="w-7 h-7" />} primary />
            </div>
            <div className="rounded-3xl bg-musify-card border border-white/10 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-white/10 bg-white/5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-musify-teal/20 flex items-center justify-center">
                <SessionsIcon className="w-4 h-4 text-musify-teal" />
              </div>
              <h2 className="text-lg font-bold text-white">Active Sessions</h2>
            </div>
            <AdminFilter
              searchPlaceholder="Search by user or device..."
              searchValue={sessionSearch}
              onSearchChange={setSessionSearch}
              resultCount={filteredSessions.length}
              totalCount={(sessions as unknown[]).length}
              onClear={() => setSessionSearch('')}
            />
            <AdminTable
              columns={[
                { key: 'userId.name', label: 'User' },
                { key: 'deviceId', label: 'Device' },
                { key: 'lastActivity', label: 'Last Activity' },
              ]}
              data={filteredSessions}
            />
          </div>
          </>
        )}
        </div>
      </main>
    </div>
  );
}
