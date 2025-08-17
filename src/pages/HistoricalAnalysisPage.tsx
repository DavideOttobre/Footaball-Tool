import React, { useState } from 'react';
import { useMatchStore } from '../store/matchStore';
import HistoricalFilters from '../components/historical/HistoricalFilters';
import HistoricalMatchList from '../components/historical/HistoricalMatchList';
import { MatchAnalysis } from '../components/historical/MatchAnalysis';
import { useHistoricalFilters } from '../hooks/useHistoricalFilters';
import type { Match } from '../types/Match';

export default function HistoricalAnalysisPage() {
  const { matches } = useMatchStore();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const {
    filters,
    setFilters,
    filteredMatches,
    resetFilters,
    sortOrder,
    setSortOrder
  } = useHistoricalFilters(matches);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analisi Storica</h1>
          <p className="mt-2 text-gray-600">
            Seleziona una partita per visualizzare le statistiche al momento in cui è stata giocata
          </p>
        </div>

        <div className="space-y-8">
          <HistoricalFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={resetFilters}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />

          {filteredMatches.length > 0 ? (
            <HistoricalMatchList 
              matches={filteredMatches}
              onMatchSelect={setSelectedMatch}
            />
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">Nessuna partita trovata con i filtri selezionati</p>
            </div>
          )}
        </div>
      </div>

      {selectedMatch && (
        <MatchAnalysis 
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
}