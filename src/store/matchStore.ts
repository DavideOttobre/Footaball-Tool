import { create } from 'zustand';
import type { Match } from '../types/Match';

interface MatchStore {
  matches: Match[];
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
  setMatches: (matches) => set({ matches }),
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