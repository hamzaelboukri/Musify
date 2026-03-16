'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@/components/icons';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-6 h-6 flex items-center justify-center text-current hover:text-amber-400 transition group shrink-0"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <SunIcon size="sm" className="group-hover:scale-110 transition-transform" />
      ) : (
        <MoonIcon size="sm" className="group-hover:scale-110 transition-transform text-indigo-400" />
      )}
    </button>
  );
}
