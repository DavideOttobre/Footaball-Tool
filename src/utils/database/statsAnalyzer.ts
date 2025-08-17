import type { Match } from '../../types/Match';
import type { PreMatchStatsQuery } from '../../types/Database';

export function analyzeMatchesWithStats(matches: Match[], query: PreMatchStatsQuery): Match[] {
  return matches.filter(match => {
    const homeStats = match['Stats Pre Match']?.[match.squadra_casa];
    const awayStats = match['Stats Pre Match']?.[match.squadra_trasferta];

    if (!homeStats || !awayStats) return false;

    return (
      isInRange(homeStats.btts, query.btts) &&
      isInRange(awayStats.btts, query.btts) &&
      isInRange(homeStats.over_1_5, query.over15) &&
      isInRange(awayStats.over_1_5, query.over15) &&
      isInRange(homeStats.over_2_5, query.over25) &&
      isInRange(awayStats.over_2_5, query.over25) &&
      isInRange(homeStats.media_segnare_gol_primo_tempo, query.avgGoalsFirstHalf) &&
      isInRange(awayStats.media_segnare_gol_primo_tempo, query.avgGoalsFirstHalf) &&
      isInRange(homeStats.media_subire_gol_primo_tempo, query.avgGoalsConcededFirstHalf) &&
      isInRange(awayStats.media_subire_gol_primo_tempo, query.avgGoalsConcededFirstHalf) &&
      isInRange(homeStats.prob_segnare_primi, query.probScoringFirst) &&
      isInRange(awayStats.prob_segnare_primi, query.probScoringFirst) &&
      isInRange(homeStats.prob_subire_primi, query.probConcedingFirst) &&
      isInRange(awayStats.prob_subire_primi, query.probConcedingFirst)
    );
  });
}

function isInRange(value: number, range: { min: number; max: number }): boolean {
  // Converti le percentuali in decimali per il confronto
  const min = range.min / (range.max > 5 ? 100 : 1);
  const max = range.max / (range.max > 5 ? 100 : 1);
  return value >= min && value <= max;
}