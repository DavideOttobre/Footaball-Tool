import React from 'react';
import { Bookmark } from 'lucide-react';
import { useBookmarkStore } from '../../store/bookmarkStore';

interface BookmarkButtonProps {
  matchId: string;
  category: 'statistics' | 'odds' | 'trends';
  type: string;
  value: number | string;
  label: string;
}

export default function BookmarkButton({ 
  matchId, 
  category, 
  type, 
  value,
  label 
}: BookmarkButtonProps) {
  const { bookmarks, addBookmark, removeBookmark } = useBookmarkStore();
  
  const isBookmarked = bookmarks.some(
    b => b.matchId === matchId && b.type === type
  );

  const handleClick = () => {
    if (isBookmarked) {
      const bookmark = bookmarks.find(
        b => b.matchId === matchId && b.type === type
      );
      if (bookmark) {
        removeBookmark(bookmark.id);
      }
    } else {
      addBookmark({
        matchId,
        category,
        type,
        value,
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm
        transition-colors duration-200
        ${isBookmarked 
          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
      `}
    >
      <Bookmark className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}