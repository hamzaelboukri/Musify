'use client';

import Link from 'next/link';

export default function HowItWorksPage() {
  const steps = [
    {
      step: 1,
      title: 'Sign up',
      desc: 'Create an account as a Listener or Artist. Listeners enjoy music; Artists upload and share their tracks.',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
    },
    {
      step: 2,
      title: 'Discover & play',
      desc: 'Browse New Releases, Top hits, and Artists. Click Play all or any song to start listening. Use the player bar to skip, pause, or adjust volume.',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      ),
    },
    {
      step: 3,
      title: 'Build your library',
      desc: 'Like songs to save them. Create playlists in Library. Your Recently Played history is saved when you\'re logged in.',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
        </svg>
      ),
    },
    {
      step: 4,
      title: 'Artists: upload & grow',
      desc: 'Go to Dashboard, upload your tracks with cover art, create albums, and track your streams. Your songs appear in New Releases and Top hits.',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-full pb-24">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl mx-4 mt-4 mb-8 p-8 md:p-12 bg-gradient-to-br from-[#00d4ff]/20 via-[#00bfff]/10 to-[#8b5cf6]/20 border border-white/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d4ff]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#8b5cf6]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">How Musify works</h1>
          <p className="text-white/70 mt-2 text-lg max-w-2xl mx-auto">
            A quick guide to get the most out of the app
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="px-4 md:px-8 max-w-2xl mx-auto space-y-8">
        {steps.map((s, i) => (
          <div
            key={s.step}
            className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00d4ff]/30 transition"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00d4ff]/30 to-[#00bfff]/20 flex items-center justify-center text-[#00d4ff] shrink-0">
              {s.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#00d4ff] bg-[#00d4ff]/20 px-2 py-0.5 rounded">Step {s.step}</span>
                <h2 className="text-lg font-bold text-white">{s.title}</h2>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href="/"
            className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#00bfff] text-black font-bold text-center hover:opacity-90 hover:shadow-lg hover:shadow-[#00d4ff]/30 transition"
          >
            Start exploring
          </Link>
          <Link
            href="/register"
            className="flex-1 py-4 px-6 rounded-xl border border-white/20 text-white font-semibold text-center hover:bg-white/5 transition"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
