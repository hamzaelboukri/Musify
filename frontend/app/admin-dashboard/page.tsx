'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminService } from '@/services/adminService';
import { AdminTable } from '@/components/AdminTable';

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [users, setUsers] = useState<unknown[]>([]);
  const [pendingSingers, setPendingSingers] = useState<unknown[]>([]);
  const [pendingSongs, setPendingSongs] = useState<unknown[]>([]);
  const [sessions, setSessions] = useState<unknown[]>([]);
  const [tab, setTab] = useState<'overview' | 'users' | 'singers' | 'songs' | 'sessions'>('overview');

  useEffect(() => {
    if (!loading && !user) router.replace('/');
    if (user?.role !== 'ADMIN') router.replace('/home');
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      adminService.getStats().then(({ data }) => setStats(data));
      adminService.getUsers().then(({ data }) => setUsers(data));
      adminService.getPendingSingers().then(({ data }) => setPendingSingers(data));
      adminService.getPendingSongs().then(({ data }) => setPendingSongs(data));
      adminService.getSessions().then(({ data }) => setSessions(data));
    }
  }, [user]);

  const refresh = () => {
    adminService.getStats().then(({ data }) => setStats(data));
    adminService.getUsers().then(({ data }) => setUsers(data));
    adminService.getPendingSingers().then(({ data }) => setPendingSingers(data));
    adminService.getPendingSongs().then(({ data }) => setPendingSongs(data));
    adminService.getSessions().then(({ data }) => setSessions(data));
  };

  if (loading) return <div className="p-8 text-center text-white/60">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">Admin Dashboard</h1>
      <div className="flex gap-2 mb-8 flex-wrap">
        {(['overview', 'users', 'singers', 'songs', 'sessions'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg capitalize ${
              tab === t ? 'bg-musify-accent text-black' : 'bg-musify-card text-white/80'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === 'overview' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-xl bg-musify-card">
            <p className="text-white/60">Total Users</p>
            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
          </div>
          <div className="p-6 rounded-xl bg-musify-card">
            <p className="text-white/60">Total Songs</p>
            <p className="text-3xl font-bold text-white">{stats.totalSongs}</p>
          </div>
          <div className="p-6 rounded-xl bg-musify-card">
            <p className="text-white/60">Total Plays</p>
            <p className="text-3xl font-bold text-white">{stats.totalPlays}</p>
          </div>
        </div>
      )}
      {tab === 'users' && (
        <AdminTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role' },
            { key: 'isBanned', label: 'Banned' },
          ]}
          data={(users as { name: string; email: string; role: string; isBanned: boolean; _id: string }[]).map(
            (u) => ({ ...u, isBanned: u.isBanned ? 'Yes' : 'No' })
          )}
          actions={(row) => {
            const r = row as { _id: string; isBanned: boolean };
            return (
              <button
                onClick={async () => {
                  await (r.isBanned ? adminService.unbanUser(r._id) : adminService.banUser(r._id));
                  refresh();
                }}
                className="text-sm text-amber-400 hover:text-amber-300"
              >
                {r.isBanned ? 'Unban' : 'Ban'}
              </button>
            );
          }}
        />
      )}
      {tab === 'singers' && (
        <AdminTable
          columns={[
            { key: 'stageName', label: 'Stage Name' },
            { key: 'userId.email', label: 'Email' },
          ]}
          data={(pendingSingers as { stageName: string; userId?: { email?: string }; _id: string }[]).map((s) => ({
            ...s,
            'userId.email': s.userId?.email ?? '-',
          }))}
          actions={(row) => (
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  await adminService.approveSinger((row as { _id: string })._id);
                  refresh();
                }}
                className="text-green-400 hover:text-green-300 text-sm"
              >
                Approve
              </button>
              <button
                onClick={async () => {
                  await adminService.rejectSinger((row as { _id: string })._id);
                  refresh();
                }}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Reject
              </button>
            </div>
          )}
        />
      )}
      {tab === 'songs' && (
        <AdminTable
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'artist', label: 'Artist' },
          ]}
          data={pendingSongs as { title: string; artist: string; _id: string }[]}
          actions={(row) => (
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  await adminService.approveSong((row as { _id: string })._id);
                  refresh();
                }}
                className="text-green-400 hover:text-green-300 text-sm"
              >
                Approve
              </button>
              <button
                onClick={async () => {
                  if (confirm('Delete this song?')) {
                    await adminService.deleteSong((row as { _id: string })._id);
                    refresh();
                  }
                }}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Delete
              </button>
            </div>
          )}
        />
      )}
      {tab === 'sessions' && (
        <AdminTable
          columns={[
            { key: 'userId.name', label: 'User' },
            { key: 'deviceId', label: 'Device' },
            { key: 'lastActivity', label: 'Last Activity' },
          ]}
          data={(sessions as { userId?: { name?: string }; deviceId: string; lastActivity: string }[]).map((s) => ({
            ...s,
            'userId.name': s.userId?.name ?? '-',
            lastActivity: new Date(s.lastActivity).toLocaleString(),
          }))}
        />
      )}
    </div>
  );
}
