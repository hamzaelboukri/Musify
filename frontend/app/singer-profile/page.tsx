'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SingerProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace('/login');
      else if (user.role === 'SINGER') router.replace('/singer-dashboard?tab=profile');
      else router.replace('/profile');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-musify-dark">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-musify-teal/30 border-t-musify-teal animate-spin" />
        <p className="text-white/70">Redirecting...</p>
      </div>
    </div>
  );
}
