/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        musify: {
          dark: '#121212',
          darker: '#0a0a0a',
          sidebar: '#181818',
          card: '#1f1f1f',
          'card-hover': '#2a2a2a',
          accent: '#06b6d4',
          'accent-hover': '#22d3ee',
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
