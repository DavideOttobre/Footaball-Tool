import { useMemo } from 'react';
import type { Match } from '../types/Match';
import { calculateTeamPerformance } from '../utils/statistics/teamStats';
import { calculateGoalStats } from '../utils/statistics/goalStats';
import { analyzePatterns } from '../utils/predictions/patternAnalysis';

export function useMatchAnalysis(matches: Match[], homeTeam: string, awayTeam: string) {
  const homeTeamStats = useMemo(() => 
    calculateTeamPerformance(matches, homeTeam),
    [matches, homeTeam]
  );

  const awayTeamStats = useMemo(() => 
    calculateTeamPerformance(matches, awayTeam),
    [matches, awayTeam]
  );

  const homeTeamGoals = useMemo(() => 
    calculateGoalStats(matches, homeTeam),
    [matches, homeTeam]
  );

  const awayTeamGoals = useMemo(() => 
    calculateGoalStats(matches, awayTeam),
    [matches, awayTeam]
  );

  const patterns = useMemo(() => 
    analyzePatterns(matches, homeTeam, awayTeam),
    [matches, homeTeam, awayTeam]
  );

  return {
    homeTeam: {
      ...homeTeamStats,
      goals: homeTeamGoals,
    },
    awayTeam: {
      ...awayTeamStats,
      goals: awayTeamGoals,
    },
    patterns,
  };
}