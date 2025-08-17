import type { Match } from '../types/Match';

interface CombinedProbabilities {
  over05HT: number;
  over15ST: number;
  over25FT: number;
  btts: number;
  homeScoresFirst: number;
  goalsLast15: number;
  noDraw: number;
  goalBefore39: number;
  goalAfter39HT: number;
  goalBefore70With00HT: number;
  goalAfter80: number;
  matchCount: number;
}

export function calculateCombinedProbabilities(
  matches: Match[],
  homeTeam: string,
  awayTeam: string
): CombinedProbabilities {
  const currentSeason = matches[0]?.stagione;
  const seasonMatches = matches.filter(m => m.stagione === currentSeason);
  
  // Calcola le probabilità esistenti
  const over05HT = calculateFirstHalfProbability(seasonMatches, homeTeam, awayTeam);
  const over15ST = calculateSecondHalfProbability(seasonMatches, homeTeam, awayTeam);
  const over25FT = calculateFullMatchProbability(seasonMatches, homeTeam, awayTeam);
  const btts = calculateBTTSProbability(seasonMatches, homeTeam, awayTeam);
  const homeScoresFirst = calculateFirstScorerProbability(seasonMatches, homeTeam);
  const goalsLast15 = calculateLast15MinutesProbability(seasonMatches, homeTeam, awayTeam);
  const noDraw = calculateNoDrawProbability(seasonMatches, homeTeam, awayTeam);

  // Calcola le nuove probabilità
  const goalBefore39 = calculateGoalBefore39Probability(seasonMatches, homeTeam, awayTeam);
  const goalAfter39HT = calculateGoalAfter39HTProbability(seasonMatches, homeTeam, awayTeam);
  const goalBefore70With00HT = calculateGoalBefore70With00HTProbability(seasonMatches, homeTeam, awayTeam);
  const goalAfter80 = calculateGoalAfter80Probability(seasonMatches, homeTeam, awayTeam);

  return {
    over05HT,
    over15ST,
    over25FT,
    btts,
    homeScoresFirst,
    goalsLast15,
    noDraw,
    goalBefore39,
    goalAfter39HT,
    goalBefore70With00HT,
    goalAfter80,
    matchCount: seasonMatches.length
  };
}

function calculateFirstHalfProbability(matches: Match[], homeTeam: string, awayTeam: string): number {
  const homeMatches = matches.filter(m => m.squadra_casa === homeTeam);
  const awayMatches = matches.filter(m => m.squadra_trasferta === awayTeam);

  if (homeMatches.length === 0 || awayMatches.length === 0) return 0;

  const homeOver05HT = homeMatches.filter(m => 
    m.gol_primo_tempo_casa + m.gol_primo_tempo_trasferta > 0
  ).length / homeMatches.length;

  const awayOver05HT = awayMatches.filter(m => 
    m.gol_primo_tempo_casa + m.gol_primo_tempo_trasferta > 0
  ).length / awayMatches.length;

  return ((homeOver05HT * 0.6) + (awayOver05HT * 0.4)) * 100;
}

function calculateSecondHalfProbability(matches: Match[], homeTeam: string, awayTeam: string): number {
  const homeMatches = matches.filter(m => m.squadra_casa === homeTeam);
  const awayMatches = matches.filter(m => m.squadra_trasferta === awayTeam);

  if (homeMatches.length === 0 || awayMatches.length === 0) return 0;

  const homeOver15ST = homeMatches.filter(m => {
    const secondHalfGoals = (m.gol_casa - m.gol_primo_tempo_casa) + 
                           (m.gol_trasferta - m.gol_primo_tempo_trasferta);
    return secondHalfGoals > 1;
  }).length / homeMatches.length;

  const awayOver15ST = awayMatches.filter(m => {
    const secondHalfGoals = (m.gol_casa - m.gol_primo_tempo_casa) + 
                           (m.gol_trasferta - m.gol_primo_tempo_trasferta);
    return secondHalfGoals > 1;
  }).length / awayMatches.length;

  return ((homeOver15ST * 0.6) + (awayOver15ST * 0.4)) * 100;
}

function calculateFullMatchProbability(matches: Match[], homeTeam: string, awayTeam: string): number {
  const homeMatches = matches.filter(m => m.squadra_casa === homeTeam);
  const awayMatches = matches.filter(m => m.squadra_trasferta === awayTeam);

  if (homeMatches.length === 0 || awayMatches.length === 0) return 0;

  const homeOver25 = homeMatches.filter(m => 
    m.gol_casa + m.gol_trasferta > 2
  ).length / homeMatches.length;

  const awayOver25 = awayMatches.filter(m => 
    m.gol_casa + m.gol_trasferta > 2
  ).length / awayMatches.length;

  return ((homeOver25 * 0.6) + (awayOver25 * 0.4)) * 100;
}

function calculateBTTSProbability(matches: Match[], homeTeam: string, awayTeam: string): number {
  const homeMatches = matches.filter(m => m.squadra_casa === homeTeam);
  const awayMatches = matches.filter(m => m.squadra_trasferta === awayTeam);

  if (homeMatches.length === 0 || awayMatches.length === 0) return 0;

  const homeBTTS = homeMatches.filter(m => 
    m.gol_casa > 0 && m.gol_trasferta > 0
  ).length / homeMatches.length;

  const awayBTTS = awayMatches.filter(m => 
    m.gol_casa > 0 && m.gol_trasferta > 0
  ).length / awayMatches.length;

  return ((homeBTTS * 0.6) + (awayBTTS * 0.4)) * 100;
}

function calculateFirstScorerProbability(matches: Match[], teamName: string): number {
  const teamMatches = matches.filter(m => 
    m.squadra_casa === teamName || m.squadra_trasferta === teamName
  );

  if (teamMatches.length === 0) return 0;

  const firstScorer = teamMatches.filter(m => {
    const firstGoal = m.gol.sort((a, b) => parseInt(a.minuto) - parseInt(b.minuto))[0];
    return firstGoal && firstGoal.squadra === teamName;
  }).length;

  return (firstScorer / teamMatches.length) * 100;
}

function calculateLast15MinutesProbability(matches: Match[], homeTeam: string, awayTeam: string): number {
  const homeMatches = matches.filter(m => m.squadra_casa === homeTeam);
  const awayMatches = matches.filter(m => m.squadra_trasferta === awayTeam);

  if (homeMatches.length === 0 || awayMatches.length === 0) return 0;

  const homeLate = homeMatches.filter(m =>
    m.gol.some(g => parseInt(g.minuto) >= 75)
  ).length / homeMatches.length;

  const awayLate = awayMatches.filter(m =>
    m.gol.some(g => parseInt(g.minuto) >= 75)
  ).length / awayMatches.length;

  return ((homeLate * 0.6) + (awayLate * 0.4)) * 100;
}

function calculateNoDrawProbability(matches: Match[], homeTeam: string, awayTeam: string): number {
  const homeMatches = matches.filter(m => m.squadra_casa === homeTeam);
  const awayMatches = matches.filter(m => m.squadra_trasferta === awayTeam);

  if (homeMatches.length === 0 || awayMatches.length === 0) return 0;

  const homeNoDraw = homeMatches.filter(m =>
    m.gol_casa !== m.gol_trasferta
  ).length / homeMatches.length;

  const awayNoDraw = awayMatches.filter(m =>
    m.gol_casa !== m.gol_trasferta
  ).length / awayMatches.length;

  return ((homeNoDraw * 0.6) + (awayNoDraw * 0.4)) * 100;
}

function calculateGoalBefore39Probability(matches: Match[], homeTeam: string, awayTeam: string): number {
  const homeMatches = matches.filter(m => m.squadra_casa === homeTeam);
  const awayMatches = matches.filter(m => m.squadra_trasferta === awayTeam);

  if (homeMatches.length === 0 || awayMatches.length === 0) return 0;

  const homeGoalsBefore39 = homeMatches.filter(m => 
    m.gol.some(g => parseInt(g.minuto) <= 39)
  ).length / homeMatches.length;

  const awayGoalsBefore39 = awayMatches.filter(m => 
    m.gol.some(g => parseInt(g.minuto) <= 39)
  ).length / awayMatches.length;

  return ((homeGoalsBefore39 * 0.6) + (awayGoalsBefore39 * 0.4)) * 100;
}

function calculateGoalAfter39HTProbability(matches: Match[], homeTeam: string, awayTeam: string): number {
  const homeMatches = matches.filter(m => m.squadra_casa === homeTeam);
  const awayMatches = matches.filter(m => m.squadra_trasferta === awayTeam);

  if (homeMatches.length === 0 || awayMatches.length === 0) return 0;

  const homeGoalsAfter39 = homeMatches.filter(m => 
    m.gol.some(g => {
      const minute = parseInt(g.minuto);
      return minute > 39 && minute <= 45 || g.minuto.includes('45+');
    })
  ).length / homeMatches.length;

  const awayGoalsAfter39 = awayMatches.filter(m => 
    m.gol.some(g => {
      const minute = parseInt(g.minuto);
      return minute > 39 && minute <= 45 || g.minuto.includes('45+');
    })
  ).length / awayMatches.length;

  return ((homeGoalsAfter39 * 0.6) + (awayGoalsAfter39 * 0.4)) * 100;
}

function calculateGoalBefore70With00HTProbability(matches: Match[], homeTeam: string, awayTeam: string): number {
  const homeMatches = matches.filter(m => m.squadra_casa === homeTeam);
  const awayMatches = matches.filter(m => m.squadra_trasferta === awayTeam);

  // Calcola la probabilità per le partite in casa
  const homeRelevantMatches = homeMatches.filter(m => 
    m.gol_primo_tempo_casa === 0 && m.gol_primo_tempo_trasferta === 0
  );
  
  const homeProb = homeRelevantMatches.length > 0 
    ? homeRelevantMatches.filter(m => 
        m.gol.some(g => {
          const minute = parseInt(g.minuto);
          return minute > 45 && minute <= 70;
        })
      ).length / homeRelevantMatches.length
    : 0;

  // Calcola la probabilità per le partite in trasferta
  const awayRelevantMatches = awayMatches.filter(m => 
    m.gol_primo_tempo_casa === 0 && m.gol_primo_tempo_trasferta === 0
  );
  
  const awayProb = awayRelevantMatches.length > 0
    ? awayRelevantMatches.filter(m => 
        m.gol.some(g => {
          const minute = parseInt(g.minuto);
          return minute > 45 && minute <= 70;
        })
      ).length / awayRelevantMatches.length
    : 0;

  return ((homeProb * 0.6) + (awayProb * 0.4)) * 100;
}

function calculateGoalAfter80Probability(matches: Match[], homeTeam: string, awayTeam: string): number {
  const homeMatches = matches.filter(m => m.squadra_casa === homeTeam);
  const awayMatches = matches.filter(m => m.squadra_trasferta === awayTeam);

  if (homeMatches.length === 0 || awayMatches.length === 0) return 0;

  const homeGoalsAfter80 = homeMatches.filter(m => 
    m.gol.some(g => {
      const minute = parseInt(g.minuto);
      return minute >= 80 || g.minuto.includes('90+');
    })
  ).length / homeMatches.length;

  const awayGoalsAfter80 = awayMatches.filter(m => 
    m.gol.some(g => {
      const minute = parseInt(g.minuto);
      return minute >= 80 || g.minuto.includes('90+');
    })
  ).length / awayMatches.length;

  return ((homeGoalsAfter80 * 0.6) + (awayGoalsAfter80 * 0.4)) * 100;
}