import type { Match } from '../../types/Match';

interface HistoricalStats {
  averageGoals: number;
  over25Percentage: number;
  bttsPercentage: number;
  cleanSheetPercentage: number;
  goalDistribution: Array<{ name: string; value: number }>;
  resultDistribution: Array<{ name: string; value: number }>;
}

export function calculateHistoricalStats(matches: Match[]): HistoricalStats {
  const totalMatches = matches.length;
  if (totalMatches === 0) {
    return {
      averageGoals: 0,
      over25Percentage: 0,
      bttsPercentage: 0,
      cleanSheetPercentage: 0,
      goalDistribution: [],
      resultDistribution: [],
    };
  }

  const totalGoals = matches.reduce((sum, match) => 
    sum + match.gol_casa + match.gol_trasferta, 0
  );

  const over25Matches = matches.filter(m => 
    m.gol_casa + m.gol_trasferta > 2.5
  ).length;

  const bttsMatches = matches.filter(m => 
    m.gol_casa > 0 && m.gol_trasferta > 0
  ).length;

  const cleanSheetMatches = matches.filter(m => 
    m.gol_casa === 0 || m.gol_trasferta === 0
  ).length;

  const goalDistribution = calculateGoalDistribution(matches);
  const resultDistribution = calculateResultDistribution(matches);

  return {
    averageGoals: totalGoals / totalMatches,
    over25Percentage: (over25Matches / totalMatches) * 100,
    bttsPercentage: (bttsMatches / totalMatches) * 100,
    cleanSheetPercentage: (cleanSheetMatches / totalMatches) * 100,
    goalDistribution,
    resultDistribution,
  };
}

function calculateGoalDistribution(matches: Match[]) {
  const distribution = new Map<number, number>();

  matches.forEach(match => {
    const totalGoals = match.gol_casa + match.gol_trasferta;
    distribution.set(totalGoals, (distribution.get(totalGoals) || 0) + 1);
  });

  return Array.from(distribution.entries())
    .map(([goals, count]) => ({
      name: `${goals} gol`,
      value: count,
    }))
    .sort((a, b) => parseInt(a.name) - parseInt(b.name));
}

function calculateResultDistribution(matches: Match[]) {
  const distribution = new Map<string, number>();

  matches.forEach(match => {
    let result = '1';
    if (match.gol_casa === match.gol_trasferta) result = 'X';
    if (match.gol_casa < match.gol_trasferta) result = '2';
    distribution.set(result, (distribution.get(result) || 0) + 1);
  });

  return Array.from(distribution.entries())
    .map(([result, count]) => ({
      name: result,
      value: count,
    }))
    .sort((a, b) => b.value - a.value);
}