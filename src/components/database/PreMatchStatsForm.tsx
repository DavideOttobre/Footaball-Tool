import React from 'react';
import type { PreMatchStatsQuery } from '../../types/Database';

interface PreMatchStatsFormProps {
  onSearch: (query: PreMatchStatsQuery) => void;
}

export default function PreMatchStatsForm({ onSearch }: PreMatchStatsFormProps) {
  const [query, setQuery] = React.useState<PreMatchStatsQuery>({
    btts: { min: 0, max: 100 },
    over15: { min: 0, max: 100 },
    over25: { min: 0, max: 100 },
    avgGoalsFirstHalf: { min: 0, max: 5 },
    avgGoalsConcededFirstHalf: { min: 0, max: 5 },
    probScoringFirst: { min: 0, max: 100 },
    probConcedingFirst: { min: 0, max: 100 }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (field: keyof PreMatchStatsQuery, subfield: 'min' | 'max', value: string) => {
    setQuery(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subfield]: Number(value)
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(query).map(([field, range]) => (
          <div key={field} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {formatFieldName(field)}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max={field.includes('avg') ? '5' : '100'}
                step="0.1"
                value={range.min}
                onChange={(e) => handleChange(field as keyof PreMatchStatsQuery, 'min', e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Min"
              />
              <span>-</span>
              <input
                type="number"
                min="0"
                max={field.includes('avg') ? '5' : '100'}
                step="0.1"
                value={range.max}
                onChange={(e) => handleChange(field as keyof PreMatchStatsQuery, 'max', e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Cerca Partite
        </button>
      </div>
    </form>
  );
}

function formatFieldName(field: string): string {
  const names: Record<string, string> = {
    btts: 'BTTS %',
    over15: 'Over 1.5 %',
    over25: 'Over 2.5 %',
    avgGoalsFirstHalf: 'Media Gol 1°T',
    avgGoalsConcededFirstHalf: 'Media Gol Subiti 1°T',
    probScoringFirst: 'Prob. Segnare Primi',
    probConcedingFirst: 'Prob. Subire Primi'
  };
  return names[field] || field;
}