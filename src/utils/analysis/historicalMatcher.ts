import type { Match } from '../types/Match';

export interface SimilarityInfo {
  criteria: {
    name: string;
    targetValue: number;
    actualValue: number;
    match: number;
  }[];
  overallMatch: number;
}

export interface HistoricalMatch extends Match {
  verified: boolean;
  similarity: SimilarityInfo;
}

interface HistoricalMatches {
  [key: string]: HistoricalMatch[];
}

export function findSimilarHistoricalMatches(
  matches: Match[],
  currentStats: any
): HistoricalMatches {
  const historicalMatches: HistoricalMatches = {
    'Over 0.5 1°T': findMatchesForEvent(matches, currentStats.over05HT, 'over05HT'),
    'Over 1.5 2°T': findMatchesForEvent(matches, currentStats.over15ST, 'over15ST'),
    'Over 2.5': findMatchesForEvent(matches, currentStats.over25FT, 'over25FT'),
    'BTTS': findMatchesForEvent(matches, currentStats.btts, 'btts'),
    'Segna Prima Casa': findMatchesForEvent(matches, currentStats.homeScoresFirst, 'homeScoresFirst'),
    'Gol Ultimi 15\'': findMatchesForEvent(matches, currentStats.goalsLast15, 'goalsLast15'),
    'No Pareggio': findMatchesForEvent(matches, currentStats.noDraw, 'noDraw'),
  };

  return historicalMatches;
}

function findMatchesForEvent(
  matches: Match[], 
  probability: number,
  eventType: string
): HistoricalMatch[] {
  const similarMatches = matches.filter(m => {
    if (!m['Stats Pre Match']) return false;

    const homeStats = m['Stats Pre Match'][m.squadra_casa];
    const awayStats = m['Stats Pre Match'][m.squadra_trasferta];
    if (!homeStats || !awayStats) return false;

    // Calculate similarity criteria
    const similarity = calculateSimilarity(homeStats, awayStats, probability, eventType);
    if (similarity.overallMatch < 0.7) return false; // Minimum 70% match required

    // Add similarity info to the match
    (m as HistoricalMatch).similarity = similarity;
    
    return true;
  });

  return similarMatches.map(match => ({
    ...match,
    verified: checkEventOccurred(match, eventType)
  })) as HistoricalMatch[];
}

function calculateSimilarity(
  homeStats: any,
  awayStats: any,
  targetProbability: number,
  eventType: string
): SimilarityInfo {
  const criteria = [];
  let totalMatch = 0;

  switch (eventType) {
    case 'over05HT':
      criteria.push(
        {
          name: 'Media gol 1°T (Casa)',
          targetValue: targetProbability,
          actualValue: homeStats.media_segnare_gol_primo_tempo,
          match: calculateMatchPercentage(targetProbability, homeStats.media_segnare_gol_primo_tempo)
        },
        {
          name: 'Media gol 1°T (Trasferta)',
          targetValue: targetProbability,
          actualValue: awayStats.media_segnare_gol_primo_tempo,
          match: calculateMatchPercentage(targetProbability, awayStats.media_segnare_gol_primo_tempo)
        }
      );
      break;

    case 'over15ST':
      criteria.push(
        {
          name: 'Over 1.5 (Casa)',
          targetValue: targetProbability,
          actualValue: homeStats.over_1_5,
          match: calculateMatchPercentage(targetProbability, homeStats.over_1_5)
        },
        {
          name: 'Over 1.5 (Trasferta)',
          targetValue: targetProbability,
          actualValue: awayStats.over_1_5,
          match: calculateMatchPercentage(targetProbability, awayStats.over_1_5)
        }
      );
      break;

    case 'over25FT':
      criteria.push(
        {
          name: 'Over 2.5 (Casa)',
          targetValue: targetProbability,
          actualValue: homeStats.over_2_5,
          match: calculateMatchPercentage(targetProbability, homeStats.over_2_5)
        },
        {
          name: 'Over 2.5 (Trasferta)',
          targetValue: targetProbability,
          actualValue: awayStats.over_2_5,
          match: calculateMatchPercentage(targetProbability, awayStats.over_2_5)
        }
      );
      break;

    case 'btts':
      criteria.push(
        {
          name: 'BTTS % (Casa)',
          targetValue: targetProbability,
          actualValue: homeStats.btts,
          match: calculateMatchPercentage(targetProbability, homeStats.btts)
        },
        {
          name: 'BTTS % (Trasferta)',
          targetValue: targetProbability,
          actualValue: awayStats.btts,
          match: calculateMatchPercentage(targetProbability, awayStats.btts)
        }
      );
      break;

    case 'homeScoresFirst':
      criteria.push(
        {
          name: 'Prob. Segnare Primi (Casa)',
          targetValue: targetProbability,
          actualValue: homeStats.prob_segnare_primi,
          match: calculateMatchPercentage(targetProbability, homeStats.prob_segnare_primi)
        },
        {
          name: 'Prob. Subire Primi (Trasferta)',
          targetValue: 1 - targetProbability,
          actualValue: awayStats.prob_subire_primi,
          match: calculateMatchPercentage(1 - targetProbability, awayStats.prob_subire_primi)
        }
      );
      break;

    case 'goalsLast15':
      criteria.push(
        {
          name: 'Gol Ultimi 15\' (Casa)',
          targetValue: targetProbability,
          actualValue: homeStats.percentuale_gol_ultimi_15,
          match: calculateMatchPercentage(targetProbability, homeStats.percentuale_gol_ultimi_15)
        },
        {
          name: 'Gol Ultimi 15\' (Trasferta)',
          targetValue: targetProbability,
          actualValue: awayStats.percentuale_gol_ultimi_15,
          match: calculateMatchPercentage(targetProbability, awayStats.percentuale_gol_ultimi_15)
        }
      );
      break;

    case 'noDraw':
      criteria.push(
        {
          name: 'Rating Differenziale',
          targetValue: targetProbability,
          actualValue: Math.abs(homeStats.rating - awayStats.rating),
          match: calculateMatchPercentage(targetProbability, Math.abs(homeStats.rating - awayStats.rating))
        }
      );
      break;
  }

  totalMatch = criteria.reduce((sum, c) => sum + c.match, 0) / criteria.length;

  return {
    criteria,
    overallMatch: totalMatch
  };
}

function calculateMatchPercentage(target: number, actual: number): number {
  const diff = Math.abs(target - actual);
  const maxDiff = Math.max(target, 1 - target); // Maximum possible difference
  return 1 - (diff / maxDiff);
}

function checkEventOccurred(match: Match, eventType: string): boolean {
  switch (eventType) {
    case 'over05HT':
      return match.gol_primo_tempo_casa + match.gol_primo_tempo_trasferta > 0;

    case 'over15ST':
      const secondHalfGoals = (match.gol_casa - match.gol_primo_tempo_casa) + 
                             (match.gol_trasferta - match.gol_primo_tempo_trasferta);
      return secondHalfGoals > 1;

    case 'over25FT':
      return match.gol_casa + match.gol_trasferta > 2;

    case 'btts':
      return match.gol_casa > 0 && match.gol_trasferta > 0;

    case 'homeScoresFirst':
      const firstGoal = match.gol.sort((a, b) => parseInt(a.minuto) - parseInt(b.minuto))[0];
      return firstGoal && firstGoal.squadra === match.squadra_casa;

    case 'goalsLast15':
      return match.gol.some(g => parseInt(g.minuto) >= 75);

    case 'noDraw':
      return match.gol_casa !== match.gol_trasferta;

    default:
      return false;
  }
}