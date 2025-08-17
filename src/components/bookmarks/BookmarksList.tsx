import React, { useState } from 'react';
import { useBookmarkStore } from '../../store/bookmarkStore';
import { Trash2, Filter } from 'lucide-react';

export default function BookmarksList() {
  const { bookmarks, removeBookmark } = useBookmarkStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(
    new Set(bookmarks.map(b => b.category))
  );

  const filteredBookmarks = selectedCategory
    ? bookmarks.filter(b => b.category === selectedCategory)
    : bookmarks;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Dati Salvati</h2>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="text-sm border rounded-md"
          >
            <option value="">Tutte le categorie</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'statistics' ? 'Statistiche' :
                 category === 'odds' ? 'Quote' : 'Trend'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredBookmarks.map(bookmark => (
          <div 
            key={bookmark.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${bookmark.category === 'statistics' ? 'bg-blue-100 text-blue-700' :
                      bookmark.category === 'odds' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'}
                  `}>
                    {bookmark.category === 'statistics' ? 'Statistiche' :
                     bookmark.category === 'odds' ? 'Quote' : 'Trend'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(bookmark.timestamp)}
                  </span>
                </div>

                <p className="font-medium">{bookmark.type}</p>
                <p className="text-lg">{bookmark.value}</p>
                
                {bookmark.notes && (
                  <p className="mt-2 text-sm text-gray-600">
                    {bookmark.notes}
                  </p>
                )}
              </div>

              <button
                onClick={() => removeBookmark(bookmark.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredBookmarks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nessun dato salvato
            {selectedCategory && ' per questa categoria'}
          </div>
        )}
      </div>
    </div>
  );
}