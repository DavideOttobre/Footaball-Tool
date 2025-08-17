import React from 'react';
import { Calendar, ArrowUpDown, X } from 'lucide-react';
import { TeamAutocomplete } from './TeamAutocomplete';
import { DateRangePicker } from './DateRangePicker';
import type { HistoricalFiltersType } from '../../types/Historical';

interface Props {
  filters: HistoricalFiltersType;
  onFiltersChange: (filters: HistoricalFiltersType) => void;
  onReset: () => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

export default function HistoricalFilters({
  filters,
  onFiltersChange,
  onReset,
  sortOrder,
  onSortOrderChange
}: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TeamAutocomplete
          label="Squadra Casa"
          value={filters.homeTeam}
          onChange={(value) => onFiltersChange({ ...filters, homeTeam: value })}
        />
        
        <TeamAutocomplete
          label="Squadra Trasferta"
          value={filters.awayTeam}
          onChange={(value) => onFiltersChange({ ...filters, awayTeam: value })}
        />

        <DateRangePicker
          startDate={filters.dateFrom}
          endDate={filters.dateTo}
          onStartDateChange={(date) => onFiltersChange({ ...filters, dateFrom: date })}
          onEndDateChange={(date) => onFiltersChange({ ...filters, dateTo: date })}
        />

        <div className="flex items-end gap-4">
          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>{sortOrder === 'asc' ? 'Più recenti' : 'Meno recenti'}</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <X className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}