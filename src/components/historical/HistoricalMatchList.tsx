import React from 'react';
import type { Match } from '../../types/Match';
import { MatchPreview } from './MatchPreview';

interface Props {
  matches: Match[];
  onMatchSelect: (match: Match) => void;
}

export default function HistoricalMatchList({ matches, onMatchSelect }: Props) {
  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <MatchPreview 
          key={`${match.data}-${match.squadra_casa}-${match.squadra_trasferta}`}
          match={match}
          onAnalyze={() => onMatchSelect(match)}
        />
      ))}
    </div>
  );
}