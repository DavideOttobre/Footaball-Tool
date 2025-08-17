import React from 'react';
import type { Match } from '../../../types/Match';
import { formatMatchDate } from '../../../utils/formatting';

interface HeadToHeadMatchesProps {
  matches: Match[];
  homeTeam: string;
  awayTeam: string;
}

export default function HeadToHeadMatches({ matches, homeTeam, awayTeam }: HeadToHeadMatchesProps) {
  return (
    <div className="space-y-4">
      {matches.map((match, index) => (
        <div 
          key={`${match.data}-${match.squadra_casa}-${match.squadra_trasferta}`}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">{formatMatchDate(match.data)}</span>
            <span className="text-sm font-medium text-gray-600">{match.campionato}</span>
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

          {match.gol.length > 0 && (
            <div className="mt-2 text-sm text-gray-500">
              <p className="text-xs font-medium mb-1">Timeline gol:</p>
              {match.gol.map((goal, idx) => (
                <span key={idx} className="inline-block mr-2">
                  {goal.squadra === match.squadra_casa ? '🔵' : '🔴'} {goal.minuto}'
                </span>
              ))}
            </div>
          )}
        </div>
      ))}

      {matches.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nessun precedente trovato tra le due squadre
        </div>
      )}
    </div>
  );
}