'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

const ONBOARDING_ITEMS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    ),
    title: 'Stream unlimited music',
    desc: 'Discover new releases, top hits, and explore by genre.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      </svg>
    ),
    title: 'Create playlists & like songs',
    desc: 'Build your library and save your favorites.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>
    ),
    title: 'Artists: upload & share',
    desc: 'Share your music with the world and track your streams.',
  },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'SINGER'>('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ name, email, password, role });
      router.replace('/');
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/10 via-transparent to-[#8b5cf6]/10" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#00d4ff]/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#8b5cf6]/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative flex flex-col lg:flex-row w-full min-h-screen">
        {/* Left: Onboarding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20 py-16">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#00bfff] flex items-center justify-center shadow-lg shadow-[#00d4ff]/30">
                <img src="/musify-logo.png" alt="Musify" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-2xl font-bold text-white">Musify</span>
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold text-white tracking-tight leading-tight">
              Join the music community
            </h1>
            <p className="text-white/60 mt-4 text-lg">
              Create your free account and start discovering music or sharing your own.
            </p>
            <div className="mt-12 space-y-6">
              {ONBOARDING_ITEMS.map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-[#00d4ff]/20 flex items-center justify-center text-[#00d4ff] shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-white/50 text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="flex-1 flex items-center justify-center px-4 py-12 lg:py-0">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#00bfff] flex items-center justify-center shadow-lg shadow-[#00d4ff]/30">
                <img src="/musify-logo.png" alt="Musify" className="w-9 h-9 object-contain" />
              </div>
              <h1 className="text-xl font-bold text-white mt-3">Create account</h1>
              <p className="text-white/50 text-sm mt-1">Join Musify and start listening</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#00d4ff]/50 focus:ring-2 focus:ring-[#00d4ff]/20 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#00d4ff]/50 focus:ring-2 focus:ring-[#00d4ff]/20 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
                  <input
                    type="password"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#00d4ff]/50 focus:ring-2 focus:ring-[#00d4ff]/20 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">I am a</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('USER')}
                      className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all ${
                        role === 'USER'
                          ? 'border-[#00d4ff] bg-[#00d4ff]/10 text-white'
                          : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/[0.07]'
                      }`}
                    >
                      <svg className="w-7 h-7 text-[#00d4ff]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      <span className="font-semibold text-sm">Listener</span>
                      <span className="text-xs opacity-80">Enjoy music</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('SINGER')}
                      className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all ${
                        role === 'SINGER'
                          ? 'border-[#00d4ff] bg-[#00d4ff]/10 text-white'
                          : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/[0.07]'
                      }`}
                    >
                      <svg className="w-7 h-7 text-[#00d4ff]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                      </svg>
                      <span className="font-semibold text-sm">Artist</span>
                      <span className="text-xs opacity-80">Upload & share</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#00bfff] text-black font-bold text-base hover:opacity-90 hover:shadow-lg hover:shadow-[#00d4ff]/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    'Create account'
                  )}
                </button>
              </form>

              <p className="text-center text-white/50 text-sm mt-5">
                Already have an account?{' '}
                <Link href="/login" className="text-[#00d4ff] hover:text-[#00bfff] font-medium transition">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
