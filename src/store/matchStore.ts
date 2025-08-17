
import { create } from 'zustand';
import type { Match } from '../types/Match';
import { calculateEloHistory, type EloHistoryStore } from '../utils/eloCalculator';

interface MatchStore {
  matches: Match[];
  eloHistory: EloHistoryStore;
  setMatches: (matches: Match[]) => void;
  selectedLeague: string | null;
  setSelectedLeague: (league: string) => void;
  selectedSeason: string | null;
  setSelectedSeason: (season: string) => void;
  homeOdds: { [key: string]: string };
  awayOdds: { [key: string]: string };
  setHomeOdds: (team: string, odds: string) => void;
  setAwayOdds: (team: string, odds: string) => void;
  persistMatches: boolean;
  setPersistMatches: (persist: boolean) => void;
}

export const useMatchStore = create<MatchStore>((set) => ({
  matches: [],
  eloHistory: new Map(),
  setMatches: (matches) => {
    // Ordina le partite per data, un prerequisito per il calcolo ELO
    const sortedMatches = [...matches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calcola la cronologia ELO
    const eloHistory = calculateEloHistory(sortedMatches);

    // Aggiorna lo stato con le partite e la cronologia ELO calcolata
    set({ matches: sortedMatches, eloHistory });
  },
  selectedLeague: null,
  setSelectedLeague: (league) => set({ selectedLeague: league }),
  selectedSeason: null,
  setSelectedSeason: (season) => set({ selectedSeason: season }),
  homeOdds: {},
  awayOdds: {},
  setHomeOdds: (team, odds) => set((state) => ({
    homeOdds: { ...state.homeOdds, [team]: odds }
  })),
  setAwayOdds: (team, odds) => set((state) => ({
    awayOdds: { ...state.awayOdds, [team]: odds }
  })),
  persistMatches: false,
  setPersistMatches: (persist) => set({ persistMatches: persist })
}));
