import React from 'react';
import { Search } from 'lucide-react';
import type { Match } from '../../types/Match';
import { formatMatchDate } from '../../utils/formatting';

interface Props {
  match: Match;
  onAnalyze: () => void;
}

export function MatchPreview({ match, onAnalyze }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-sm text-gray-500">{formatMatchDate(match.data)}</span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm font-medium text-gray-600">{match.campionato}</span>
        </div>
        <button
          onClick={onAnalyze}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Analizza</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-right">
          <p className="font-medium">{match.squadra_casa}</p>
          <p className="text-sm text-gray-500">
            ({match.gol_primo_tempo_casa} - {match.gol_casa - match.gol_primo_tempo_casa})
          </p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">{match.gol_casa} - {match.gol_trasferta}</p>
          <p className="text-xs text-gray-500">Finale</p>
        </div>
        <div className="text-left">
          <p className="font-medium">{match.squadra_trasferta}</p>
          <p className="text-sm text-gray-500">
            ({match.gol_primo_tempo_trasferta} - {match.gol_trasferta - match.gol_primo_tempo_trasferta})
          </p>
        </div>
      </div>
    </div>
  );
}