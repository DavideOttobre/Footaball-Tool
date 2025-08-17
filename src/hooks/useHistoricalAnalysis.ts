import { useMemo } from 'react';
import { useMatchStore } from '../store/matchStore';
import type { Match } from '../types/Match';

export function useHistoricalAnalysis(selectedMatch: Match) {
  const { matches } = useMatchStore();
  
  const matchesUntilDate = useMemo(() => {
    const selectedDate = new Date(selectedMatch.data);
    return matches.filter(match => {
      const matchDate = new Date(match.data);
      // Exclude the selected match and future matches
      return matchDate < selectedDate;
    }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, [selectedMatch, matches]);

  const currentSeasonMatches = useMemo(() => {
    return matchesUntilDate.filter(m => m.stagione === selectedMatch.stagione);
  }, [matchesUntilDate, selectedMatch]);

  const recentHomeMatches = useMemo(() => {
    return currentSeasonMatches
      .filter(m => m.squadra_casa === selectedMatch.squadra_casa)
      .slice(0, 5);
  }, [currentSeasonMatches, selectedMatch]);

  const recentAwayMatches = useMemo(() => {
    return currentSeasonMatches
      .filter(m => m.squadra_trasferta === selectedMatch.squadra_trasferta)
      .slice(0, 5);
  }, [currentSeasonMatches, selectedMatch]);

  const headToHead = useMemo(() => {
    return matchesUntilDate.filter(m => 
      (m.squadra_casa === selectedMatch.squadra_casa && m.squadra_trasferta === selectedMatch.squadra_trasferta) ||
      (m.squadra_casa === selectedMatch.squadra_trasferta && m.squadra_trasferta === selectedMatch.squadra_casa)
    );
  }, [matchesUntilDate, selectedMatch]);

  return {
    matchesUntilDate,
    currentSeasonMatches,
    recentHomeMatches,
    recentAwayMatches,
    headToHead
  };
}