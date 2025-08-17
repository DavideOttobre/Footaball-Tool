import type { Match } from '../../../types/Match';

function calculateMatchPoints(match: Match, teamName: string): number {
  const isHome = match.squadra_casa === teamName;
  const teamGoals = isHome ? match.gol_casa : match.gol_trasferta;
  const opponentGoals = isHome ? match.gol_trasferta : match.gol_casa;

  if (teamGoals > opponentGoals) return 3;
  if (teamGoals === opponentGoals) return 1;
  return 0;
}

export function calculateScoringPatternStats(matches: Match[], teamName: string) {
  const totalMatches = matches.length;
  if (totalMatches === 0) {
    return {
      scoredFirst: { count: 0, percentage: 0, averagePoints: 0 },
      concededFirst: { count: 0, percentage: 0, averagePoints: 0 }
    };
  }

  const stats = matches.reduce((acc, match) => {
    const firstGoal = match.gol.sort((a, b) => parseInt(a.minuto) - parseInt(b.minuto))[0];
    if (!firstGoal) return acc;

    const isTeamGoal = firstGoal.squadra === teamName;
    const matchPoints = calculateMatchPoints(match, teamName);

    if (isTeamGoal) {
      acc.scoredFirst.count++;
      acc.scoredFirst.points += matchPoints;
    } else {
      acc.concededFirst.count++;
      acc.concededFirst.points += matchPoints;
    }

    return acc;
  }, {
    scoredFirst: { count: 0, points: 0 },
    concededFirst: { count: 0, points: 0 }
  });

  return {
    scoredFirst: {
      count: stats.scoredFirst.count,
      percentage: (stats.scoredFirst.count / totalMatches) * 100,
      averagePoints: stats.scoredFirst.count > 0 
        ? stats.scoredFirst.points / stats.scoredFirst.count 
        : 0
    },
    concededFirst: {
      count: stats.concededFirst.count,
      percentage: (stats.concededFirst.count / totalMatches) * 100,
      averagePoints: stats.concededFirst.count > 0 
        ? stats.concededFirst.points / stats.concededFirst.count 
        : 0
    }
  };
}