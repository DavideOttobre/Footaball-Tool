import React from 'react';
import { useMatchAnalysis } from '../../hooks/useMatchAnalysis';
import PositionComparison from './sections/PositionComparison';
import FormComparison from './sections/FormComparison';
import GoalComparison from './sections/GoalComparison';
import BettingOpportunities from './sections/BettingOpportunities';

interface TeamComparisonProps {
  homeTeam: string;
  awayTeam: string;
}

export default function TeamComparison({ homeTeam, awayTeam }: TeamComparisonProps) {
  const { homeTeam: homeStats, awayTeam: awayStats, patterns } = useMatchAnalysis(matches, homeTeam, awayTeam);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Confronto Statistico</h2>
      
      {/* Confronto Posizioni */}
      <PositionComparison 
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homeStats={homeStats}
        awayStats={awayStats}
      />

      {/* Confronto Forma Recente */}
      <FormComparison 
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homeStats={homeStats}
        awayStats={awayStats}
      />

      {/* Confronto Gol */}
      <GoalComparison 
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homeStats={homeStats}
        awayStats={awayStats}
      />

      {/* Opportunità di Betting */}
      <BettingOpportunities 
        patterns={patterns}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
      />
    </div>
  );
}