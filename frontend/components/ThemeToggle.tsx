'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@/components/icons';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-12 h-12 rounded-xl flex items-center justify-center text-zinc-600 dark:text-white/60 hover:text-amber-500 dark:hover:text-amber-400/90 hover:bg-zinc-200/80 dark:hover:bg-white/5 transition group"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <SunIcon size="lg" className="group-hover:scale-110 transition-transform" />
      ) : (
        <MoonIcon size="lg" className="group-hover:scale-110 transition-transform text-indigo-500 dark:text-indigo-300/90" />
      )}
    </button>
  );
}
