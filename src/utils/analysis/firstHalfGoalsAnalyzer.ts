import type { Match } from '../types/Match';

interface PatternAnalysis {
  factor: string;
  correlation: number;
  threshold: number;
  matches: number;
  totalMatches: number;
}

export function analyzeFirstHalfGoalsPatterns(
  matches: Match[],
  homeTeam: string,
  awayTeam: string
): PatternAnalysis[] {
  // Filtra le partite per squadra e venue
  const homeMatches = matches.filter(m => m.squadra_casa === homeTeam);
  const awayMatches = matches.filter(m => m.squadra_trasferta === awayTeam);

  const patterns: PatternAnalysis[] = [];

  // Analizza le statistiche pre-partita
  patterns.push(
    ...analyzeHomeTeamStats(homeMatches),
    ...analyzeAwayTeamStats(awayMatches),
    ...analyzeCombinedStats(homeMatches, awayMatches)
  );

  // Ordina per correlazione
  return patterns.sort((a, b) => b.correlation - a.correlation);
}

function analyzeHomeTeamStats(matches: Match[]): PatternAnalysis[] {
  const patterns: PatternAnalysis[] = [];
  const totalMatches = matches.length;
  if (totalMatches === 0) return patterns;

  // Analizza statistiche in casa
  const analyzeStat = (
    statName: string,
    getValue: (m: Match) => number,
    thresholds: number[]
  ) => {
    thresholds.forEach(threshold => {
      const matchesAboveThreshold = matches.filter(m => getValue(m) >= threshold);
      const goalsAboveThreshold = matchesAboveThreshold.filter(m =>
        m.gol_primo_tempo_casa + m.gol_primo_tempo_trasferta > 0
      );

      if (matchesAboveThreshold.length > 0) {
        patterns.push({
          factor: `Casa - ${statName} >= ${threshold}`,
          correlation: (goalsAboveThreshold.length / matchesAboveThreshold.length) * 100,
          threshold,
          matches: goalsAboveThreshold.length,
          totalMatches: matchesAboveThreshold.length
        });
      }
    });
  };

  // Statistiche specifiche casa
  analyzeStat(
    'Media gol 1°T',
    m => m['Stats Pre Match']?.[m.squadra_casa]?.media_segnare_gol_primo_tempo || 0,
    [0.5, 0.75, 1, 1.25]
  );

  analyzeStat(
    'Tiri in porta',
    m => m.tiri_porta_casa,
    [3, 4, 5, 6]
  );

  analyzeStat(
    'Possesso palla',
    m => m.possesso_palla_casa,
    [55, 60, 65]
  );

  return patterns;
}

function analyzeAwayTeamStats(matches: Match[]): PatternAnalysis[] {
  const patterns: PatternAnalysis[] = [];
  const totalMatches = matches.length;
  if (totalMatches === 0) return patterns;

  // Analizza statistiche in trasferta
  const analyzeStat = (
    statName: string,
    getValue: (m: Match) => number,
    thresholds: number[]
  ) => {
    thresholds.forEach(threshold => {
      const matchesAboveThreshold = matches.filter(m => getValue(m) >= threshold);
      const goalsAboveThreshold = matchesAboveThreshold.filter(m =>
        m.gol_primo_tempo_casa + m.gol_primo_tempo_trasferta > 0
      );

      if (matchesAboveThreshold.length > 0) {
        patterns.push({
          factor: `Trasferta - ${statName} >= ${threshold}`,
          correlation: (goalsAboveThreshold.length / matchesAboveThreshold.length) * 100,
          threshold,
          matches: goalsAboveThreshold.length,
          totalMatches: matchesAboveThreshold.length
        });
      }
    });
  };

  // Statistiche specifiche trasferta
  analyzeStat(
    'Media gol 1°T',
    m => m['Stats Pre Match']?.[m.squadra_trasferta]?.media_segnare_gol_primo_tempo || 0,
    [0.5, 0.75, 1, 1.25]
  );

  analyzeStat(
    'Tiri in porta',
    m => m.tiri_porta_trasferta,
    [3, 4, 5, 6]
  );

  analyzeStat(
    'Possesso palla',
    m => m.possesso_palla_trasferta,
    [45, 50, 55]
  );

  return patterns;
}

function analyzeCombinedStats(homeMatches: Match[], awayMatches: Match[]): PatternAnalysis[] {
  const patterns: PatternAnalysis[] = [];

  // Analizza pattern combinati
  const analyzeCombinedStat = (
    statName: string,
    condition: (home: Match, away: Match) => boolean
  ) => {
    let matchingPairs = 0;
    let goalPairs = 0;
    let totalPairs = 0;

    homeMatches.forEach(home => {
      awayMatches.forEach(away => {
        if (Math.abs(new Date(home.data).getTime() - new Date(away.data).getTime()) <= 30 * 24 * 60 * 60 * 1000) {
          totalPairs++;
          if (condition(home, away)) {
            matchingPairs++;
            if (home.gol_primo_tempo_casa + home.gol_primo_tempo_trasferta > 0 &&
                away.gol_primo_tempo_casa + away.gol_primo_tempo_trasferta > 0) {
              goalPairs++;
            }
          }
        }
      });
    });

    if (matchingPairs > 0) {
      patterns.push({
        factor: `Combinato - ${statName}`,
        correlation: (goalPairs / matchingPairs) * 100,
        threshold: 0,
        matches: goalPairs,
        totalMatches: matchingPairs
      });
    }
  };

  // Pattern combinati
  analyzeCombinedStat(
    'Entrambe le squadre over 0.5 1°T nelle ultime 3',
    (home, away) => {
      const homeStats = home['Stats Pre Match']?.[home.squadra_casa];
      const awayStats = away['Stats Pre Match']?.[away.squadra_trasferta];
      return homeStats?.media_segnare_gol_primo_tempo >= 0.5 &&
             awayStats?.media_segnare_gol_primo_tempo >= 0.5;
    }
  );

  analyzeCombinedStat(
    'Entrambe le squadre 3+ tiri in porta 1°T',
    (home, away) => 
      home.tiri_porta_casa >= 3 && away.tiri_porta_trasferta >= 3
  );

  return patterns;
}