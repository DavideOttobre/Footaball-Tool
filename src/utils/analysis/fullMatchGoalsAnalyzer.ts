import type { Match } from '../types/Match';

interface PatternAnalysis {
  factor: string;
  correlation: number;
  threshold: number;
  matches: number;
  totalMatches: number;
}

export function analyzeFullMatchGoalsPatterns(
  matches: Match[],
  homeTeam: string,
  awayTeam: string
): PatternAnalysis[] {
  const homeMatches = matches.filter(m => m.squadra_casa === homeTeam);
  const awayMatches = matches.filter(m => m.squadra_trasferta === awayTeam);

  const patterns: PatternAnalysis[] = [];

  patterns.push(
    ...analyzeHomeTeamStats(homeMatches),
    ...analyzeAwayTeamStats(awayMatches),
    ...analyzeCombinedStats(homeMatches, awayMatches),
    ...analyzeHalfTimePatterns(matches)
  );

  return patterns.sort((a, b) => b.correlation - a.correlation);
}

function analyzeHomeTeamStats(matches: Match[]): PatternAnalysis[] {
  const patterns: PatternAnalysis[] = [];
  const totalMatches = matches.length;
  if (totalMatches === 0) return patterns;

  const analyzeStat = (
    statName: string,
    getValue: (m: Match) => number,
    thresholds: number[]
  ) => {
    thresholds.forEach(threshold => {
      const matchesAboveThreshold = matches.filter(m => getValue(m) >= threshold);
      const goalsAboveThreshold = matchesAboveThreshold.filter(m => 
        m.gol_casa + m.gol_trasferta > 2
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

  analyzeStat(
    'Media gol totale',
    m => m['Stats Pre Match']?.[m.squadra_casa]?.over_2_5 || 0,
    [0.5, 0.75, 1, 1.25]
  );

  analyzeStat(
    'Tiri totali',
    m => m.tiri_casa,
    [12, 15, 18]
  );

  analyzeStat(
    'Attacchi pericolosi',
    m => m.attacchi_pericolosi_casa,
    [25, 30, 35]
  );

  return patterns;
}

function analyzeAwayTeamStats(matches: Match[]): PatternAnalysis[] {
  const patterns: PatternAnalysis[] = [];
  const totalMatches = matches.length;
  if (totalMatches === 0) return patterns;

  const analyzeStat = (
    statName: string,
    getValue: (m: Match) => number,
    thresholds: number[]
  ) => {
    thresholds.forEach(threshold => {
      const matchesAboveThreshold = matches.filter(m => getValue(m) >= threshold);
      const goalsAboveThreshold = matchesAboveThreshold.filter(m => 
        m.gol_casa + m.gol_trasferta > 2
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

  analyzeStat(
    'Media gol totale',
    m => m['Stats Pre Match']?.[m.squadra_trasferta]?.over_2_5 || 0,
    [0.5, 0.75, 1, 1.25]
  );

  analyzeStat(
    'Tiri totali',
    m => m.tiri_trasferta,
    [10, 12, 15]
  );

  analyzeStat(
    'Attacchi pericolosi',
    m => m.attacchi_pericolosi_trasferta,
    [20, 25, 30]
  );

  return patterns;
}

function analyzeCombinedStats(homeMatches: Match[], awayMatches: Match[]): PatternAnalysis[] {
  const patterns: PatternAnalysis[] = [];

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
            if (home.gol_casa + home.gol_trasferta > 2) {
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

  analyzeCombinedStat(
    'Entrambe over 2.5 nelle ultime 3',
    (home, away) => {
      const homeStats = home['Stats Pre Match']?.[home.squadra_casa];
      const awayStats = away['Stats Pre Match']?.[away.squadra_trasferta];
      return homeStats?.over_2_5 >= 0.5 && awayStats?.over_2_5 >= 0.5;
    }
  );

  analyzeCombinedStat(
    'Entrambe 6+ tiri in porta',
    (home, away) => 
      home.tiri_porta_casa >= 6 && away.tiri_porta_trasferta >= 6
  );

  return patterns;
}

function analyzeHalfTimePatterns(matches: Match[]): PatternAnalysis[] {
  const patterns: PatternAnalysis[] = [];
  const totalMatches = matches.length;
  if (totalMatches === 0) return patterns;

  // Analizza pattern basati sui gol del primo tempo
  const analyzeFirstHalfGoals = (
    minGoals: number,
    maxGoals: number
  ) => {
    const matchesInRange = matches.filter(m => {
      const firstHalfGoals = m.gol_primo_tempo_casa + m.gol_primo_tempo_trasferta;
      return firstHalfGoals >= minGoals && firstHalfGoals <= maxGoals;
    });

    const over25Matches = matchesInRange.filter(m => 
      m.gol_casa + m.gol_trasferta > 2
    );

    if (matchesInRange.length > 0) {
      patterns.push({
        factor: `Gol 1°T: ${minGoals}-${maxGoals}`,
        correlation: (over25Matches.length / matchesInRange.length) * 100,
        threshold: 0,
        matches: over25Matches.length,
        totalMatches: matchesInRange.length
      });
    }
  };

  analyzeFirstHalfGoals(0, 0);
  analyzeFirstHalfGoals(1, 1);
  analyzeFirstHalfGoals(2, 2);
  analyzeFirstHalfGoals(3, Infinity);

  return patterns;
}