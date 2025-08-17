import React from 'react';
import HeadToHead from '../analysis/HeadToHead';

interface HistoricalAnalysisProps {
  homeTeam: string;
  awayTeam: string;
}

export default function HistoricalAnalysis({ homeTeam, awayTeam }: HistoricalAnalysisProps) {
  return (
    <div className="space-y-6">
      <HeadToHead homeTeam={homeTeam} awayTeam={awayTeam} />
    </div>
  );
}