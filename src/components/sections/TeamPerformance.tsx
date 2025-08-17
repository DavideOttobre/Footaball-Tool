import React from 'react';
import { useMatchStore } from '../../store/matchStore';
import TeamTrends from '../analysis/TeamTrends';
import DetailedGoalAnalysis from '../analysis/DetailedGoalAnalysis';
import type { Match } from '../../types/Match';

interface TeamPerformanceProps {
  homeTeam: string;
  awayTeam: string;
  matches?: Match[];
}

export default function TeamPerformance({ homeTeam, awayTeam, matches: propMatches }: TeamPerformanceProps) {
  const { matches: storeMatches } = useMatchStore();
  const matches = propMatches || storeMatches;
  const currentSeason = matches[0]?.stagione;
  const seasonMatches = matches.filter(m => m.stagione === currentSeason);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamTrends teamName={homeTeam} isHome={true} matches={matches} />
        <TeamTrends teamName={awayTeam} isHome={false} matches={matches} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DetailedGoalAnalysis 
          matches={seasonMatches.filter(m => 
            m.squadra_casa === homeTeam || m.squadra_trasferta === homeTeam
          )}
          teamName={homeTeam}
          isHome={true}
        />
        <DetailedGoalAnalysis 
          matches={seasonMatches.filter(m => 
            m.squadra_casa === awayTeam || m.squadra_trasferta === awayTeam
          )}
          teamName={awayTeam}
          isHome={false}
        />
      </div>
    </div>
  );
}