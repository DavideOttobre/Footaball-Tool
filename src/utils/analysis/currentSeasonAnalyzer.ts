import type { Match } from '../types/Match';
import { calculateCombinedProbabilities } from './probabilityCalculator';

interface CurrentSeasonStats {
  over05HT: number;
  over15ST: number;
  over25FT: number;
  btts: number;
  homeScoresFirst: number;
  goalsLast15: number;
  noDraw: number;
}

export function calculateCurrentSeasonStats(
  matches: Match[],
  homeTeam: string,
  awayTeam: string
): CurrentSeasonStats {
  const probabilities = calculateCombinedProbabilities(matches, homeTeam, awayTeam);

  return {
    over05HT: probabilities.over05HT,
    over15ST: probabilities.over15ST,
    over25FT: probabilities.over25FT,
    btts: calculateBTTSProb(matches, homeTeam, awayTeam),
    homeScoresFirst: calculateHomeScoresFirstProb(matches, homeTeam, awayTeam),
    goalsLast15: calculateGoalsLast15Prob(matches, homeTeam, awayTeam),
    noDraw: calculateNoDrawProb(matches, homeTeam, awayTeam)
  };
}

function calculateBTTSProb(matches: Match[], homeTeam: string, awayTeam: string): number {
  const { over05HT: homeProb } = calculateCombinedProbabilities(matches, homeTeam, awayTeam);
  const { over05HT: awayProb } = calculateCombinedProbabilities(matches, awayTeam, homeTeam);
  return (homeProb * awayProb) / 100; // Convert from percentages to probability
}

function calculateHomeScoresFirstProb(matches: Match[], homeTeam: string, awayTeam: string): number {
  const { over05HT: homeProb } = calculateCombinedProbabilities(matches, homeTeam, awayTeam);
  const { over05HT: awayProb } = calculateCombinedProbabilities(matches, awayTeam, homeTeam);
  return (homeProb / (homeProb + awayProb)) * 100;
}

function calculateGoalsLast15Prob(matches: Match[], homeTeam: string, awayTeam: string): number {
  const last15Matches = matches.filter(m => 
    m.gol.some(g => parseInt(g.minuto) >= 75)
  );
  const { over05HT } = calculateCombinedProbabilities(last15Matches, homeTeam, awayTeam);
  return over05HT;
}

function calculateNoDrawProb(matches: Match[], homeTeam: string, awayTeam: string): number {
  const { over05HT: homeProb } = calculateCombinedProbabilities(matches, homeTeam, awayTeam);
  const { over05HT: awayProb } = calculateCombinedProbabilities(matches, awayTeam, homeTeam);
  return Math.min((homeProb + awayProb) * 0.8, 100); // Adjust for no draw probability
}