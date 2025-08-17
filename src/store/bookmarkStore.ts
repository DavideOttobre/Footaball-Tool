import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Match } from '../types/Match';

interface Bookmark {
  id: string;
  matchId: string;
  category: 'statistics' | 'odds' | 'trends';
  type: string;
  value: number | string;
  notes?: string;
  timestamp: number;
}

interface BookmarkStore {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'timestamp'>) => void;
  removeBookmark: (id: string) => void;
  updateBookmark: (id: string, data: Partial<Bookmark>) => void;
  getBookmarksByMatch: (matchId: string) => Bookmark[];
  getBookmarksByCategory: (category: Bookmark['category']) => Bookmark[];
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      
      addBookmark: (bookmark) => set((state) => ({
        bookmarks: [...state.bookmarks, {
          ...bookmark,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        }],
      })),

      removeBookmark: (id) => set((state) => ({
        bookmarks: state.bookmarks.filter((b) => b.id !== id),
      })),

      updateBookmark: (id, data) => set((state) => ({
        bookmarks: state.bookmarks.map((b) => 
          b.id === id ? { ...b, ...data } : b
        ),
      })),

      getBookmarksByMatch: (matchId) => 
        get().bookmarks.filter((b) => b.matchId === matchId),

      getBookmarksByCategory: (category) =>
        get().bookmarks.filter((b) => b.category === category),
    }),
    {
      name: 'match-bookmarks',
    }
  )
);