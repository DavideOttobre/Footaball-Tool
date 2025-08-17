import type { Match } from '../types/Match';

interface TeamStats {
  avgGoalsScored: number;
  avgGoalsConceded: number;
  goalDistribution: Array<{
    minute: number;
    goals: number;
  }>;
}

interface TeamAnalysis {
  currentSeason: TeamStats;
  historical: TeamStats;
}

interface FirstHalfAnalysis {
  home: TeamAnalysis;
  away: TeamAnalysis;
  resultDistribution: {
    current: Array<{
      result: string;
      frequency: number;
    }>;
    historical: Array<{
      result: string;
      frequency: number;
    }>;
  };
  probability: {
    homeWin: number;
    draw: number;
    awayWin: number;
    firstGoalHome: number;
    firstGoalAway: number;
    noGoal: number;
    goalTiming: Array<{
      period: string;
      probability: number;
    }>;
  };
}

export function analyzeFirstHalfStrategy(
  matches: Match[],
  homeTeam: string,
  awayTeam: string
): FirstHalfAnalysis {
  const currentSeason = matches[0]?.stagione;
  
  // Filter matches
  const currentSeasonMatches = matches.filter(m => m.stagione === currentSeason);
  const historicalMatches = matches.filter(m => m.stagione !== currentSeason);

  // Analyze home team
  const homeAnalysis = {
    currentSeason: analyzeTeamStats(currentSeasonMatches, homeTeam, true),
    historical: analyzeTeamStats(historicalMatches, homeTeam, true),
  };

  // Analyze away team
  const awayAnalysis = {
    currentSeason: analyzeTeamStats(currentSeasonMatches, awayTeam, false),
    historical: analyzeTeamStats(historicalMatches, awayTeam, false),
  };

  // Analyze result distribution
  const resultDistribution = {
    current: analyzeResultDistribution(currentSeasonMatches),
    historical: analyzeResultDistribution(historicalMatches),
  };

  // Calculate probabilities
  const probability = calculateProbabilities(
    currentSeasonMatches,
    homeTeam,
    awayTeam
  );

  return {
    home: homeAnalysis,
    away: awayAnalysis,
    resultDistribution,
    probability,
  };
}

function analyzeTeamStats(
  matches: Match[],
  teamName: string,
  isHome: boolean
): TeamStats {
  const teamMatches = matches.filter(m => 
    isHome ? m.squadra_casa === teamName : m.squadra_trasferta === teamName
  );

  const totalMatches = teamMatches.length;
  if (totalMatches === 0) {
    return {
      avgGoalsScored: 0,
      avgGoalsConceded: 0,
      goalDistribution: [],
    };
  }

  const goalsScored = teamMatches.reduce((sum, match) => 
    sum + (isHome ? match.gol_primo_tempo_casa : match.gol_primo_tempo_trasferta), 0
  );

  const goalsConceded = teamMatches.reduce((sum, match) => 
    sum + (isHome ? match.gol_primo_tempo_trasferta : match.gol_primo_tempo_casa), 0
  );

  const goalDistribution = analyzeGoalDistribution(teamMatches, teamName);

  return {
    avgGoalsScored: goalsScored / totalMatches,
    avgGoalsConceded: goalsConceded / totalMatches,
    goalDistribution,
  };
}

function analyzeGoalDistribution(matches: Match[], teamName: string): Array<{ minute: number; goals: number }> {
  const distribution = new Map<number, number>();

  matches.forEach(match => {
    match.gol
      .filter(g => g.squadra === teamName && parseInt(g.minuto) <= 45)
      .forEach(goal => {
        const minute = parseInt(goal.minuto);
        distribution.set(minute, (distribution.get(minute) || 0) + 1);
      });
  });

  return Array.from(distribution.entries())
    .map(([minute, goals]) => ({ minute, goals }))
    .sort((a, b) => a.minute - b.minute);
}

function analyzeResultDistribution(matches: Match[]): Array<{ result: string; frequency: number }> {
  const results = new Map<string, number>();

  matches.forEach(match => {
    const result = `${match.gol_primo_tempo_casa}-${match.gol_primo_tempo_trasferta}`;
    results.set(result, (results.get(result) || 0) + 1);
  });

  return Array.from(results.entries())
    .map(([result, count]) => ({
      result,
      frequency: (count / matches.length) * 100,
    }))
    .sort((a, b) => b.frequency - a.frequency);
}

function calculateProbabilities(
  matches: Match[],
  homeTeam: string,
  awayTeam: string
): FirstHalfAnalysis['probability'] {
  const totalMatches = matches.length;
  if (totalMatches === 0) {
    return {
      homeWin: 0,
      draw: 0,
      awayWin: 0,
      firstGoalHome: 0,
      firstGoalAway: 0,
      noGoal: 0,
      goalTiming: [],
    };
  }

  const homeWins = matches.filter(m => 
    m.gol_primo_tempo_casa > m.gol_primo_tempo_trasferta
  ).length;

  const draws = matches.filter(m => 
    m.gol_primo_tempo_casa === m.gol_primo_tempo_trasferta
  ).length;

  const awayWins = matches.filter(m => 
    m.gol_primo_tempo_casa < m.gol_primo_tempo_trasferta
  ).length;

  const firstGoalStats = calculateFirstGoalStats(matches, homeTeam, awayTeam);
  const goalTimingStats = calculateGoalTimingStats(matches);

  return {
    homeWin: (homeWins / totalMatches) * 100,
    draw: (draws / totalMatches) * 100,
    awayWin: (awayWins / totalMatches) * 100,
    firstGoalHome: firstGoalStats.home,
    firstGoalAway: firstGoalStats.away,
    noGoal: firstGoalStats.none,
    goalTiming: goalTimingStats,
  };
}

function calculateFirstGoalStats(
  matches: Match[],
  homeTeam: string,
  awayTeam: string
): { home: number; away: number; none: number } {
  const totalMatches = matches.length;
  if (totalMatches === 0) return { home: 0, away: 0, none: 0 };

  const firstGoalHome = matches.filter(m => {
    const firstGoal = m.gol.find(g => parseInt(g.minuto) <= 45);
    return firstGoal && firstGoal.squadra === homeTeam;
  }).length;

  const firstGoalAway = matches.filter(m => {
    const firstGoal = m.gol.find(g => parseInt(g.minuto) <= 45);
    return firstGoal && firstGoal.squadra === awayTeam;
  }).length;

  const noGoal = matches.filter(m => 
    m.gol_primo_tempo_casa === 0 && m.gol_primo_tempo_trasferta === 0
  ).length;

  return {
    home: (firstGoalHome / totalMatches) * 100,
    away: (firstGoalAway / totalMatches) * 100,
    none: (noGoal / totalMatches) * 100,
  };
}

function calculateGoalTimingStats(matches: Match[]): Array<{ period: string; probability: number }> {
  const periods = [
    { name: '0-15', min: 0, max: 15 },
    { name: '16-30', min: 16, max: 30 },
    { name: '31-45', min: 31, max: 45 },
    { name: '45+', min: 45, max: Infinity },
  ];

  const totalMatches = matches.length;
  if (totalMatches === 0) {
    return periods.map(p => ({ period: p.name, probability: 0 }));
  }

  return periods.map(period => {
    const matchesWithGoals = matches.filter(m =>
      m.gol.some(g => {
        const minute = parseInt(g.minuto);
        return minute >= period.min && minute <= period.max;
      })
    ).length;

    return {
      period: period.name,
      probability: (matchesWithGoals / totalMatches) * 100,
    };
  });
}