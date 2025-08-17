import React from 'react';
import type { Match } from '../types/Match';

interface MatchListProps {
  matches: Match[];
}

export default function MatchList({ matches }: MatchListProps) {
  return (
    <div className="space-y-4">
      {matches.map((match, index) => (
        <div key={index} className="border-b pb-4 last:border-b-0">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">{match.data}</span>
            <span className="text-sm font-medium text-gray-900">{match.campionato}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{match.squadra_casa}</p>
              <p className="font-medium text-gray-900">{match.squadra_trasferta}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">{match.gol_casa}</p>
              <p className="font-bold text-gray-900">{match.gol_trasferta}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}