import type { Match } from '../../types/Match';

interface PreMatchProbabilities {
  over05HT: number;
  over05HTMatches: number;
  over15ST: number;
  over15STMatches: number;
  over25FT: number;
  over25FTMatches: number;
  btts: number;
  bttsMatches: number;
  homeTeamScoresFirst: number;
  homeTeamScoresFirstMatches: number;
  goalsLast15: number;
  goalsLast15Matches: number;
  noDraw: number;
  noDrawMatches: number;
  totalMatches: number;
  reliability: number;
  insights: string[];
}

export function calculatePreMatchProbabilities(
  matches: Match[],
  homeTeam: string,
  awayTeam: string
): PreMatchProbabilities {
  // Filter matches with similar pre-match stats
  const similarMatches = findSimilarMatches(matches, homeTeam, awayTeam);
  const totalMatches = similarMatches.length;

  if (totalMatches === 0) {
    return getEmptyProbabilities();
  }

  // Calculate probabilities
  const over05HTMatches = similarMatches.filter(m => 
    m.gol_primo_tempo_casa + m.gol_primo_tempo_trasferta > 0
  ).length;

  const over15STMatches = similarMatches.filter(m => {
    const secondHalfGoals = (m.gol_casa - m.gol_primo_tempo_casa) + 
                           (m.gol_trasferta - m.gol_primo_tempo_trasferta);
    return secondHalfGoals > 1;
  }).length;

  const over25FTMatches = similarMatches.filter(m => 
    m.gol_casa + m.gol_trasferta > 2
  ).length;

  const bttsMatches = similarMatches.filter(m => 
    m.gol_casa > 0 && m.gol_trasferta > 0
  ).length;

  const homeTeamScoresFirstMatches = similarMatches.filter(m => {
    const firstGoal = m.gol.sort((a, b) => parseInt(a.minuto) - parseInt(b.minuto))[0];
    return firstGoal && firstGoal.squadra === homeTeam;
  }).length;

  const goalsLast15Matches = similarMatches.filter(m =>
    m.gol.some(g => parseInt(g.minuto) >= 75)
  ).length;

  const noDrawMatches = similarMatches.filter(m =>
    m.gol_casa !== m.gol_trasferta
  ).length;

  // Calculate reliability based on sample size and stat consistency
  const reliability = calculateReliability(similarMatches);

  // Generate insights
  const insights = generateInsights(similarMatches, homeTeam, awayTeam);

  return {
    over05HT: over05HTMatches / totalMatches,
    over05HTMatches,
    over15ST: over15STMatches / totalMatches,
    over15STMatches,
    over25FT: over25FTMatches / totalMatches,
    over25FTMatches,
    btts: bttsMatches / totalMatches,
    bttsMatches,
    homeTeamScoresFirst: homeTeamScoresFirstMatches / totalMatches,
    homeTeamScoresFirstMatches,
    goalsLast15: goalsLast15Matches / totalMatches,
    goalsLast15Matches,
    noDraw: noDrawMatches / totalMatches,
    noDrawMatches,
    totalMatches,
    reliability,
    insights,
  };
}

function findSimilarMatches(matches: Match[], homeTeam: string, awayTeam: string): Match[] {
  // Get current match pre-match stats
  const currentMatch = matches.find(m => 
    m.squadra_casa === homeTeam && 
    m.squadra_trasferta === awayTeam
  );

  if (!currentMatch || !currentMatch['Stats Pre Match']) {
    return [];
  }

  const homeStats = currentMatch['Stats Pre Match'][homeTeam];
  const awayStats = currentMatch['Stats Pre Match'][awayTeam];

  // Find matches with similar pre-match stats
  return matches.filter(m => {
    if (!m['Stats Pre Match']) return false;

    const mHomeStats = m['Stats Pre Match'][m.squadra_casa];
    const mAwayStats = m['Stats Pre Match'][m.squadra_trasferta];

    if (!mHomeStats || !mAwayStats) return false;

    // Compare key stats with a tolerance
    const isSimilar = (a: number, b: number, tolerance = 0.15) => 
      Math.abs(a - b) <= tolerance;

    return isSimilar(mHomeStats.btts, homeStats.btts) &&
           isSimilar(mHomeStats.over_1_5, homeStats.over_1_5) &&
           isSimilar(mHomeStats.over_2_5, homeStats.over_2_5) &&
           isSimilar(mAwayStats.btts, awayStats.btts) &&
           isSimilar(mAwayStats.over_1_5, awayStats.over_1_5) &&
           isSimilar(mAwayStats.over_2_5, awayStats.over_2_5);
  });
}

function calculateReliability(matches: Match[]): number {
  const sampleSizeFactor = Math.min(matches.length / 30, 1); // Max reliability at 30 matches
  const statConsistencyFactor = calculateStatConsistency(matches);
  return sampleSizeFactor * statConsistencyFactor;
}

function calculateStatConsistency(matches: Match[]): number {
  if (matches.length < 2) return 0;

  // Calculate variance of key stats
  const variances = [
    calculateVariance(matches.map(m => m.gol_casa)),
    calculateVariance(matches.map(m => m.gol_trasferta)),
    calculateVariance(matches.map(m => m.gol_primo_tempo_casa)),
    calculateVariance(matches.map(m => m.gol_primo_tempo_trasferta)),
  ];

  // Normalize and invert variance (lower variance = higher consistency)
  const avgVariance = variances.reduce((a, b) => a + b, 0) / variances.length;
  return 1 / (1 + avgVariance);
}

function calculateVariance(numbers: number[]): number {
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const squareDiffs = numbers.map(n => Math.pow(n - mean, 2));
  return squareDiffs.reduce((a, b) => a + b, 0) / numbers.length;
}

function generateInsights(matches: Match[], homeTeam: string, awayTeam: string): string[] {
  const insights: string[] = [];

  // Analyze scoring patterns
  const firstHalfScoring = matches.filter(m => 
    m.gol_primo_tempo_casa + m.gol_primo_tempo_trasferta > 0
  ).length / matches.length;

  const secondHalfScoring = matches.filter(m => {
    const secondHalfGoals = (m.gol_casa - m.gol_primo_tempo_casa) + 
                           (m.gol_trasferta - m.gol_primo_tempo_trasferta);
    return secondHalfGoals > 0;
  }).length / matches.length;

  if (firstHalfScoring > 0.7) {
    insights.push('Alta probabilità di gol nel primo tempo');
  } else if (secondHalfScoring > 0.7) {
    insights.push('Alta probabilità di gol nel secondo tempo');
  }

  // Analyze team performance
  const homeTeamWins = matches.filter(m => 
    m.squadra_casa === homeTeam && m.gol_casa > m.gol_trasferta
  ).length / matches.length;

  if (homeTeamWins > 0.6) {
    insights.push(`${homeTeam} tende a vincere in queste condizioni`);
  }

  return insights;
}

function getEmptyProbabilities(): PreMatchProbabilities {
  return {
    over05HT: 0,
    over05HTMatches: 0,
    over15ST: 0,
    over15STMatches: 0,
    over25FT: 0,
    over25FTMatches: 0,
    btts: 0,
    bttsMatches: 0,
    homeTeamScoresFirst: 0,
    homeTeamScoresFirstMatches: 0,
    goalsLast15: 0,
    goalsLast15Matches: 0,
    noDraw: 0,
    noDrawMatches: 0,
    totalMatches: 0,
    reliability: 0,
    insights: ['Dati insufficienti per l\'analisi'],
  };
}
