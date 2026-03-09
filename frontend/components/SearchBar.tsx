'use client';

import { useState } from 'react';

type SearchBarProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
};

export function SearchBar({ onSearch, placeholder = 'Search songs...' }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 rounded-full bg-musify-card border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-musify-accent transition"
        />
        <button
          type="submit"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
}
