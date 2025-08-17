import React from 'react';
import type { Match } from '../../../types/Match';

interface RecentMatchesProps {
  matches: Match[];
  teamName: string;
}

export default function RecentMatches({ matches, teamName }: RecentMatchesProps) {
  return (
    <div className="space-y-4">
      {matches.map((match, index) => (
        <div key={index} className="border-b pb-4 last:border-b-0">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">{match.data}</span>
            <span className="text-sm font-medium text-gray-600">{match.campionato}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-right">
              <p className="font-medium">{match.squadra_casa}</p>
              <p className="text-sm text-gray-500">
                ({match.gol_primo_tempo_casa} - {match.gol_casa - match.gol_primo_tempo_casa})
              </p>
            </div>
            <div className="text-center">
              <p className="font-bold">{match.gol_casa} - {match.gol_trasferta}</p>
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
                  {goal.squadra === teamName ? '🔵' : '🔴'} {goal.minuto}'
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}