import { useState, useMemo } from 'react';
import type { Match } from '../types/Match';
import type { HistoricalFiltersType } from '../types/Historical';

export function useHistoricalFilters(matches: Match[]) {
  const [filters, setFilters] = useState<HistoricalFiltersType>({
    homeTeam: '',
    awayTeam: '',
    dateFrom: '',
    dateTo: '',
  });

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredMatches = useMemo(() => {
    let result = [...matches];

    if (filters.homeTeam) {
      result = result.filter(m => m.squadra_casa.includes(filters.homeTeam));
    }

    if (filters.awayTeam) {
      result = result.filter(m => m.squadra_trasferta.includes(filters.awayTeam));
    }

    if (filters.dateFrom) {
      result = result.filter(m => m.data >= filters.dateFrom);
    }

    if (filters.dateTo) {
      result = result.filter(m => m.data <= filters.dateTo);
    }

    return result.sort((a, b) => {
      const dateA = new Date(a.data).getTime();
      const dateB = new Date(b.data).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [matches, filters, sortOrder]);

  const resetFilters = () => {
    setFilters({
      homeTeam: '',
      awayTeam: '',
      dateFrom: '',
      dateTo: '',
    });
    setSortOrder('desc');
  };

  return {
    filters,
    setFilters,
    filteredMatches,
    resetFilters,
    sortOrder,
    setSortOrder,
  };
}