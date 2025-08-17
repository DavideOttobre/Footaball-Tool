import type { Match } from '../types/Match';
import type { DetailedTeamStats } from './types';
import { calculateZeroZeroStats } from './calculators/zeroZeroStats';
import { calculatePositionStats } from './calculators/positionStats';
import { calculateScoringPatternStats } from './calculators/scoringPatternStats';

export function calculateDetailedTeamStats(
  allMatches: Match[], 
  teamName: string, 
  context: 'all' | 'home' | 'away'
): DetailedTeamStats {
  // Filter matches based on context
  const teamMatches = allMatches.filter(m => {
    switch (context) {
      case 'home':
        return m.squadra_casa === teamName;
      case 'away':
        return m.squadra_trasferta === teamName;
      case 'all':
        return m.squadra_casa === teamName || m.squadra_trasferta === teamName;
    }
  });

  if (teamMatches.length === 0) {
    return {
      zeroZeroStats: {
        firstHalf: { count: 0, percentage: 0 },
        fullTime: { count: 0, percentage: 0 }
      },
      positions: { firstHalf: 0, secondHalf: 0 },
      scoringPattern: {
        scoredFirst: { count: 0, percentage: 0, averagePoints: 0 },
        concededFirst: { count: 0, percentage: 0, averagePoints: 0 }
      }
    };
  }

  return {
    zeroZeroStats: calculateZeroZeroStats(teamMatches),
    positions: calculatePositionStats(allMatches, teamName, context),
    scoringPattern: calculateScoringPatternStats(teamMatches, teamName)
  };
}