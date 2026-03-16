/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        musify: {
          dark: '#121212',
          darker: '#0a0a0a',
          sidebar: '#000000',
          card: '#181818',
          'card-hover': '#282828',
          accent: '#1DB954',
          'accent-hover': '#1ed760',
          spotify: '#1DB954',
          purple: '#8b5cf6',
          pink: '#ec4899',
          'pink-soft': '#f472b6',
          teal: '#06b6d4',
          'text-primary': '#ffffff',
          'text-secondary': '#a1a1aa',
          'text-muted': '#71717a',
          frosted: 'rgba(6, 182, 212, 0.15)',
          // Admin dashboard light theme (Musify teal/purple)
          'admin-sidebar': '#f4f4f5',
          'admin-bg': '#fafafa',
          'admin-card': '#ffffff',
          // Podcaster-style (singer dashboard - dark green theme)
          podcaster: {
            bg: '#0f1414',
            sidebar: '#121A1A',
            card: '#1A2525',
            accent: '#00FF80',
            'accent-dim': '#00cc66',
            negative: '#FF0057',
            muted: '#6b7b7b',
          },
          // Premium Dark / Neon-Dark (singer dashboard)
          premium: {
            bg: '#0D0D0F',
            'bg-alt': '#111114',
            sidebar: '#121215',
            card: '#1A1A1E',
            'card-elevated': '#1E1E24',
            accent: '#007BFF',
            'accent-glow': '#00A3FF',
            positive: '#00E676',
            negative: '#FF5252',
            muted: '#9CA3AF',
          },
          // Bento / dappr-style (singer dashboard)
          bento: {
            bg: '#eef1f5',
            'bg-card': '#e4e8ed',
            'bg-elevated': '#ffffff',
            dark: '#1a1d21',
            'dark-card': '#252930',
            positive: '#22c55e',
            negative: '#f43f5e',
            muted: '#64748b',
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
