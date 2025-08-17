import React from 'react';
import CurrentSeasonAnalysis from '../analysis/CurrentSeasonAnalysis';
import type { Match } from '../../types/Match';

interface CurrentSeasonAnalysisSectionProps {
  homeTeam: string;
  awayTeam: string;
  matches?: Match[];
}

export default function CurrentSeasonAnalysisSection({ 
  homeTeam, 
  awayTeam,
  matches 
}: CurrentSeasonAnalysisSectionProps) {
  return (
    <div className="space-y-6">
      <CurrentSeasonAnalysis 
        homeTeam={homeTeam} 
        awayTeam={awayTeam}
        matches={matches}
      />
    </div>
  );
}