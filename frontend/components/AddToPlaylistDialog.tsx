'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { playlistService } from '@/services/playlistService';
import { useAuth } from '@/contexts/AuthContext';

type Song = {
  _id: string;
  title: string;
  artist?: string;
  coverImage?: string;
};

type ContextType = {
  open: (song: Song) => void;
};

const AddToPlaylistContext = createContext<ContextType | null>(null);

export function useAddToPlaylist() {
  return useContext(AddToPlaylistContext);
}

export function AddToPlaylistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [song, setSong] = useState<Song | null>(null);
  const [playlists, setPlaylists] = useState<{ _id: string; name: string; songs?: unknown[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const open = useCallback((s: Song) => {
    setSong(s);
    setNewName('');
    setAddedId(null);
  }, []);

  const close = useCallback(() => {
    setSong(null);
    setAdding(null);
    setAddedId(null);
  }, []);

  useEffect(() => {
    if (song && user) {
      setLoading(true);
      playlistService
        .getAll()
        .then(({ data }) => setPlaylists((data as { _id: string; name: string; songs?: unknown[] }[]) || []))
        .finally(() => setLoading(false));
    }
  }, [song, user]);

  const addToPlaylist = async (playlistId: string) => {
    if (!song) return;
    setAdding(playlistId);
    try {
      await playlistService.addSong(playlistId, song._id);
      setAddedId(playlistId);
      setTimeout(() => close(), 600);
    } catch {
      setAdding(null);
    }
  };

  const createAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !song) return;
    setCreating(true);
    try {
      const { data } = await playlistService.create(newName.trim());
      const newId = (data as { _id: string })._id;
      await playlistService.addSong(newId, song._id);
      setAddedId(newId);
      setTimeout(() => close(), 600);
    } catch {
      setCreating(false);
    }
  };

  return (
    <AddToPlaylistContext.Provider value={{ open }}>
      {children}
      {song && (
        <AddToPlaylistDialog
          song={song}
          playlists={playlists}
          loading={loading}
          adding={adding}
          addedId={addedId}
          newName={newName}
          setNewName={setNewName}
          creating={creating}
          onAdd={addToPlaylist}
          onCreate={createAndAdd}
          onClose={close}
        />
      )}
    </AddToPlaylistContext.Provider>
  );
}

type DialogProps = {
  song: Song;
  playlists: { _id: string; name: string; songs?: unknown[] }[];
  loading: boolean;
  adding: string | null;
  addedId: string | null;
  newName: string;
  setNewName: (v: string) => void;
  creating: boolean;
  onAdd: (playlistId: string) => void;
  onCreate: (e: React.FormEvent) => void;
  onClose: () => void;
};

function AddToPlaylistDialog({
  song,
  playlists,
  loading,
  adding,
  addedId,
  newName,
  setNewName,
  creating,
  onAdd,
  onCreate,
  onClose,
}: DialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        aria-hidden
      />
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-b from-musify-card to-musify-darker animate-[slideUp_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Song preview header */}
        <div className="relative p-6 pb-4">
          <div className="flex gap-4 items-center">
            <div className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-white/5 shadow-lg ring-1 ring-white/10">
              <img
                src={song.coverImage || '/placeholder.svg'}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-musify-teal/90 mb-1">Adding song</p>
              <h3 className="text-lg font-bold text-white truncate">{song.title}</h3>
              {song.artist && <p className="text-white/60 text-sm truncate">{song.artist}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* Playlists list */}
        <div className="px-4 max-h-56 overflow-y-auto scrollbar-hide">
          {loading ? (
            <div className="py-12 flex flex-col items-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-musify-teal/30 border-t-musify-teal animate-spin" />
              <p className="text-white/50 text-sm">Loading playlists...</p>
            </div>
          ) : playlists.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/5 flex items-center justify-center">
                <svg className="w-7 h-7 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
              </div>
              <p className="text-white/70 font-medium">No playlists yet</p>
              <p className="text-white/50 text-sm mt-1">Create one below</p>
            </div>
          ) : (
            <div className="space-y-1 py-2">
              {playlists.map((pl) => {
                const isAdding = adding === pl._id;
                const isAdded = addedId === pl._id;
                return (
                  <button
                    key={pl._id}
                    onClick={() => onAdd(pl._id)}
                    disabled={!!adding}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                      isAdded
                        ? 'bg-musify-teal/20 border border-musify-teal/30'
                        : 'hover:bg-white/5 border border-transparent'
                    } disabled:opacity-60`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-musify-teal/20 to-musify-purple/20 flex items-center justify-center shrink-0">
                      {isAdded ? (
                        <svg className="w-5 h-5 text-musify-teal" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-musify-teal/70" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-white font-medium truncate">{pl.name}</p>
                      <p className="text-white/50 text-xs">{(pl.songs?.length ?? 0)} songs</p>
                    </div>
                    {isAdding && (
                      <div className="w-5 h-5 rounded-full border-2 border-musify-teal/50 border-t-musify-teal animate-spin shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Create new playlist */}
        <div className="p-4 pt-2 border-t border-white/5 bg-black/20">
          <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3">Or create new</p>
          <form onSubmit={onCreate} className="flex gap-2">
            <input
              type="text"
              placeholder="Playlist name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-musify-teal focus:ring-2 focus:ring-musify-teal/20 transition"
            />
            <button
              type="submit"
              disabled={!newName.trim() || creating}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-musify-teal to-musify-purple hover:opacity-90 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {creating ? (
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
              )}
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
