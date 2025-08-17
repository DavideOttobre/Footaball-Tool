import type { Match } from '../../types/Match';

interface SeasonStats {
  over05Percentage: number;
  over15Percentage: number;
  over25Percentage: number;
  bttsPercentage: number;
  winPercentage: number;
  drawPercentage: number;
  lossPercentage: number;
  avgGoalsScored: number;
  avgGoalsConceded: number;
}

export function calculateSeasonStats(
  matches: Match[], 
  teamName: string, 
  isHome: boolean
): SeasonStats {
  const totalMatches = matches.length;
  if (totalMatches === 0) {
    return {
      over05Percentage: 0,
      over15Percentage: 0,
      over25Percentage: 0,
      bttsPercentage: 0,
      winPercentage: 0,
      drawPercentage: 0,
      lossPercentage: 0,
      avgGoalsScored: 0,
      avgGoalsConceded: 0,
    };
  }

  let totalGoalsScored = 0;
  let totalGoalsConceded = 0;
  let over05Count = 0;
  let over15Count = 0;
  let over25Count = 0;
  let bttsCount = 0;
  let winsCount = 0;
  let drawsCount = 0;
  let lossesCount = 0;

  matches.forEach(match => {
    const goalsScored = isHome ? match.gol_casa : match.gol_trasferta;
    const goalsConceded = isHome ? match.gol_trasferta : match.gol_casa;
    const totalGoals = goalsScored + goalsConceded;

    totalGoalsScored += goalsScored;
    totalGoalsConceded += goalsConceded;

    if (totalGoals > 0) over05Count++;
    if (totalGoals > 1) over15Count++;
    if (totalGoals > 2) over25Count++;
    if (goalsScored > 0 && goalsConceded > 0) bttsCount++;

    if (goalsScored > goalsConceded) winsCount++;
    else if (goalsScored === goalsConceded) drawsCount++;
    else lossesCount++;
  });

  return {
    over05Percentage: (over05Count / totalMatches) * 100,
    over15Percentage: (over15Count / totalMatches) * 100,
    over25Percentage: (over25Count / totalMatches) * 100,
    bttsPercentage: (bttsCount / totalMatches) * 100,
    winPercentage: (winsCount / totalMatches) * 100,
    drawPercentage: (drawsCount / totalMatches) * 100,
    lossPercentage: (lossesCount / totalMatches) * 100,
    avgGoalsScored: totalGoalsScored / totalMatches,
    avgGoalsConceded: totalGoalsConceded / totalMatches,
  };
}