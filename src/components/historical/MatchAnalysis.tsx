import React from 'react';
import { X } from 'lucide-react';
import type { Match } from '../../types/Match';
import { useHistoricalAnalysis } from '../../hooks/useHistoricalAnalysis';
import { formatMatchDate } from '../../utils/formatting';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import AnalysisTabs from './tabs/AnalysisTabs';

interface Props {
  match: Match;
  onClose: () => void;
}

export function MatchAnalysis({ match, onClose }: Props) {
  const { 
    matchesUntilDate, 
    currentSeasonMatches,
    recentHomeMatches,
    recentAwayMatches,
    headToHead 
  } = useHistoricalAnalysis(match);

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 overflow-y-auto">
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Analisi {match.squadra_casa} - {match.squadra_trasferta}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Statistiche al {formatMatchDate(match.data)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Basato su {matchesUntilDate.length} partite precedenti
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <AnalysisTabs 
                match={match}
                matchesUntilDate={matchesUntilDate}
                currentSeasonMatches={currentSeasonMatches}
                recentHomeMatches={recentHomeMatches}
                recentAwayMatches={recentAwayMatches}
                headToHead={headToHead}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}