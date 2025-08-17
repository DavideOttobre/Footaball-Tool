import type { Match } from '../types/Match';

export interface MatchSource {
  label: string;
  matches: Match[];
}

export function getGoalScoringMatches(matches: Match[], teamName: string, isHome: boolean): MatchSource {
  const teamMatches = matches.filter(m => 
    isHome ? m.squadra_casa === teamName : m.squadra_trasferta === teamName
  );

  const scoringMatches = teamMatches.filter(m => 
    isHome ? m.gol_casa > 0 : m.gol_trasferta > 0
  );

  return {
    label: `Partite con gol segnati - ${teamName}`,
    matches: scoringMatches
  };
}

export function getGoalConcedingMatches(matches: Match[], teamName: string, isHome: boolean): MatchSource {
  const teamMatches = matches.filter(m => 
    isHome ? m.squadra_casa === teamName : m.squadra_trasferta === teamName
  );

  const concedingMatches = teamMatches.filter(m => 
    isHome ? m.gol_trasferta > 0 : m.gol_casa > 0
  );

  return {
    label: `Partite con gol subiti - ${teamName}`,
    matches: concedingMatches
  };
}

export function getFirstHalfScoringMatches(matches: Match[], teamName: string, isHome: boolean): MatchSource {
  const teamMatches = matches.filter(m => 
    isHome ? m.squadra_casa === teamName : m.squadra_trasferta === teamName
  );

  const firstHalfScoring = teamMatches.filter(m => 
    isHome ? m.gol_primo_tempo_casa > 0 : m.gol_primo_tempo_trasferta > 0
  );

  return {
    label: `Partite con gol nel primo tempo - ${teamName}`,
    matches: firstHalfScoring
  };
}

export function getSecondHalfScoringMatches(matches: Match[], teamName: string, isHome: boolean): MatchSource {
  const teamMatches = matches.filter(m => 
    isHome ? m.squadra_casa === teamName : m.squadra_trasferta === teamName
  );

  const secondHalfScoring = teamMatches.filter(m => {
    const secondHalfGoals = isHome 
      ? m.gol_casa - m.gol_primo_tempo_casa 
      : m.gol_trasferta - m.gol_primo_tempo_trasferta;
    return secondHalfGoals > 0;
  });

  return {
    label: `Partite con gol nel secondo tempo - ${teamName}`,
    matches: secondHalfScoring
  };
}

export function getTimeframeMatches(matches: Match[], teamName: string, startMinute: number, endMinute: number): MatchSource {
  const timeframeMatches = matches.filter(m => 
    m.gol.some(g => {
      const minute = parseInt(g.minuto);
      return g.squadra === teamName && minute >= startMinute && minute <= endMinute;
    })
  );

  return {
    label: `Partite con gol tra il ${startMinute}' e il ${endMinute}' - ${teamName}`,
    matches: timeframeMatches
  };
}

export function getHeadToHeadMatches(matches: Match[], homeTeam: string, awayTeam: string): MatchSource {
  const h2hMatches = matches.filter(m => 
    (m.squadra_casa === homeTeam && m.squadra_trasferta === awayTeam) ||
    (m.squadra_casa === awayTeam && m.squadra_trasferta === homeTeam)
  );

  return {
    label: `Scontri diretti - ${homeTeam} vs ${awayTeam}`,
    matches: h2hMatches
  };
}