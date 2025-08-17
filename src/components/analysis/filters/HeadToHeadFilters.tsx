import React from 'react';
import { CheckSquare, Square } from 'lucide-react';

interface HeadToHeadFiltersProps {
  showDirectMatchesOnly: boolean;
  onDirectMatchesChange: (value: boolean) => void;
}

export default function HeadToHeadFilters({
  showDirectMatchesOnly,
  onDirectMatchesChange
}: HeadToHeadFiltersProps) {
  return (
    <div className="flex flex-col gap-3 mb-6 bg-gray-50 p-4 rounded-lg">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Filtri Partite</h4>
      
      <button 
        onClick={() => onDirectMatchesChange(!showDirectMatchesOnly)}
        className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
      >
        {showDirectMatchesOnly ? (
          <CheckSquare className="w-5 h-5" />
        ) : (
          <Square className="w-5 h-5" />
        )}
        <span>Solo scontri diretti (casa vs trasferta)</span>
      </button>
    </div>
  );
}