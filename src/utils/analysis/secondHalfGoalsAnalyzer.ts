import type { Match } from '../types/Match';

interface PatternAnalysis {
  factor: string;
  correlation: number;
  threshold: number;
  matches: number;
  totalMatches: number;
}

export function analyzeSecondHalfGoalsPatterns(
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
    ...analyzeFirstHalfScorePatterns(matches)
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
      const goalsAboveThreshold = matchesAboveThreshold.filter(m => {
        const secondHalfGoals = (m.gol_casa - m.gol_primo_tempo_casa) + 
                               (m.gol_trasferta - m.gol_primo_tempo_trasferta);
        return secondHalfGoals > 1;
      });

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
    'Media gol 2°T',
    m => {
      const stats = m['Stats Pre Match']?.[m.squadra_casa];
      return stats ? (stats.over_2_5 - stats.over_1_5) / 2 : 0;
    },
    [0.5, 0.75, 1, 1.25]
  );

  analyzeStat(
    'Tiri totali',
    m => m.tiri_casa,
    [10, 12, 15]
  );

  analyzeStat(
    'Attacchi pericolosi',
    m => m.attacchi_pericolosi_casa,
    [20, 25, 30]
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
      const goalsAboveThreshold = matchesAboveThreshold.filter(m => {
        const secondHalfGoals = (m.gol_casa - m.gol_primo_tempo_casa) + 
                               (m.gol_trasferta - m.gol_primo_tempo_trasferta);
        return secondHalfGoals > 1;
      });

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
    'Media gol 2°T',
    m => {
      const stats = m['Stats Pre Match']?.[m.squadra_trasferta];
      return stats ? (stats.over_2_5 - stats.over_1_5) / 2 : 0;
    },
    [0.5, 0.75, 1, 1.25]
  );

  analyzeStat(
    'Tiri totali',
    m => m.tiri_trasferta,
    [8, 10, 12]
  );

  analyzeStat(
    'Attacchi pericolosi',
    m => m.attacchi_pericolosi_trasferta,
    [15, 20, 25]
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
            const secondHalfGoals = (home.gol_casa - home.gol_primo_tempo_casa) + 
                                  (home.gol_trasferta - home.gol_primo_tempo_trasferta);
            if (secondHalfGoals > 1) {
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
    'Entrambe over 1.5 nelle ultime 3',
    (home, away) => {
      const homeStats = home['Stats Pre Match']?.[home.squadra_casa];
      const awayStats = away['Stats Pre Match']?.[away.squadra_trasferta];
      return homeStats?.over_1_5 >= 0.5 && awayStats?.over_1_5 >= 0.5;
    }
  );

  analyzeCombinedStat(
    'Entrambe 5+ tiri in porta',
    (home, away) => 
      home.tiri_porta_casa >= 5 && away.tiri_porta_trasferta >= 5
  );

  return patterns;
}

function analyzeFirstHalfScorePatterns(matches: Match[]): PatternAnalysis[] {
  const patterns: PatternAnalysis[] = [];
  const totalMatches = matches.length;
  if (totalMatches === 0) return patterns;

  // Analizza pattern basati sul risultato del primo tempo
  const analyzeFirstHalfScore = (
    homeScore: number,
    awayScore: number
  ) => {
    const matchesWithScore = matches.filter(m => 
      m.gol_primo_tempo_casa === homeScore && 
      m.gol_primo_tempo_trasferta === awayScore
    );

    const over15SecondHalf = matchesWithScore.filter(m => {
      const secondHalfGoals = (m.gol_casa - m.gol_primo_tempo_casa) + 
                             (m.gol_trasferta - m.gol_primo_tempo_trasferta);
      return secondHalfGoals > 1;
    });

    if (matchesWithScore.length > 0) {
      patterns.push({
        factor: `Risultato 1°T: ${homeScore}-${awayScore}`,
        correlation: (over15SecondHalf.length / matchesWithScore.length) * 100,
        threshold: 0,
        matches: over15SecondHalf.length,
        totalMatches: matchesWithScore.length
      });
    }
  };

  // Analizza i risultati più comuni del primo tempo
  analyzeFirstHalfScore(0, 0);
  analyzeFirstHalfScore(1, 0);
  analyzeFirstHalfScore(0, 1);
  analyzeFirstHalfScore(1, 1);

  return patterns;
}