import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Analysis } from '../types/Analysis';
import type { Match } from '../types/Match';

interface AnalysisStore {
  analyses: Analysis[];
  currentMatches: Match[] | null;
  addAnalysis: (analysis: Omit<Analysis, 'id' | 'timestamp'>) => void;
  removeAnalysis: (id: string) => void;
  updateAnalysis: (id: string, data: Partial<Analysis>) => void;
  setCurrentMatches: (matches: Match[]) => void;
  getAnalysisByDate: (date: string) => Analysis[];
  getAnalysisByTeam: (teamName: string) => Analysis[];
}

const MAX_ANALYSES = 50; // Limite massimo di analisi salvate

export const useAnalysisStore = create<AnalysisStore>()(
  persist(
    (set, get) => ({
      analyses: [],
      currentMatches: null,
      
      addAnalysis: (analysis) => set((state) => {
        // Mantiene solo le ultime MAX_ANALYSES analisi
        const newAnalyses = [
          {
            ...analysis,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
          },
          ...state.analyses,
        ].slice(0, MAX_ANALYSES);

        return { analyses: newAnalyses };
      }),

      removeAnalysis: (id) => set((state) => ({
        analyses: state.analyses.filter((a) => a.id !== id),
      })),

      updateAnalysis: (id, data) => set((state) => ({
        analyses: state.analyses.map((a) => 
          a.id === id ? { ...a, ...data } : a
        ),
      })),

      setCurrentMatches: (matches) => {
        // Memorizza solo i dati essenziali delle partite
        const essentialMatches = matches.map(match => ({
          data: match.data,
          squadra_casa: match.squadra_casa,
          squadra_trasferta: match.squadra_trasferta,
          gol_casa: match.gol_casa,
          gol_trasferta: match.gol_trasferta,
          campionato: match.campionato,
          stagione: match.stagione,
        }));
        set({ currentMatches: essentialMatches as Match[] });
      },

      getAnalysisByDate: (date) => 
        get().analyses.filter((a) => a.date === date),

      getAnalysisByTeam: (teamName) =>
        get().analyses.filter((a) => 
          a.homeTeam === teamName || a.awayTeam === teamName
        ),
    }),
    {
      name: 'soccer-analysis-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          try {
            const value = localStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          } catch (error) {
            console.warn('Error reading from localStorage:', error);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.warn('Error writing to localStorage:', error);
            // Se il salvataggio fallisce, rimuovi alcune analisi vecchie
            const currentData = localStorage.getItem(name);
            if (currentData) {
              const parsedData = JSON.parse(currentData);
              if (parsedData.state && Array.isArray(parsedData.state.analyses)) {
                parsedData.state.analyses = parsedData.state.analyses.slice(0, MAX_ANALYSES / 2);
                localStorage.setItem(name, JSON.stringify(parsedData));
              }
            }
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
      partialize: (state) => ({
        analyses: state.analyses,
        // Non persistere i currentMatches per risparmiare spazio
      }),
    }
  )
);