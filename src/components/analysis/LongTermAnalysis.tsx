import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Match } from '../../types/Match';
import ResultCard from './ResultCard';

interface LongTermAnalysisProps {
  homeTeam: string;
  awayTeam: string;
  matches: Match[];
}

export default function LongTermAnalysis({ homeTeam, awayTeam, matches }: LongTermAnalysisProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Get most frequent first half results for all matches
  const getFrequentResults = (matches: Match[], team: string, isHome: boolean) => {
    const resultCount = new Map<string, number>();
    
    matches.filter(m => isHome ? m.squadra_casa === team : m.squadra_trasferta === team)
      .forEach(m => {
        const result = `${m.gol_primo_tempo_casa}-${m.gol_primo_tempo_trasferta}`;
        resultCount.set(result, (resultCount.get(result) || 0) + 1);
      });

    return Array.from(resultCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([result]) => result);
  };

  const getLeagueResults = (matches: Match[]) => {
    const resultCount = new Map<string, number>();
    
    matches.forEach(m => {
      const result = `${m.gol_primo_tempo_casa}-${m.gol_primo_tempo_trasferta}`;
      resultCount.set(result, (resultCount.get(result) || 0) + 1);
    });

    return Array.from(resultCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([result]) => result);
  };

  const homeTeamResults = getFrequentResults(matches, homeTeam, true);
  const awayTeamResults = getFrequentResults(matches, awayTeam, false);
  const leagueResults = getLeagueResults(matches);

  const homeTeamStats = homeTeamResults.map(result => calculateStats(matches, true, homeTeam, result));
  const awayTeamStats = awayTeamResults.map(result => calculateStats(matches, false, awayTeam, result));
  const leagueStats = leagueResults.map(result => calculateStats(matches, true, '', result, true));

  return (
    <div className="border rounded-lg p-4">
      <button
        className="w-full flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-medium">Analisi Squadra di Lungo Termine</h3>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      
      {isExpanded && (
        <div className="mt-4 space-y-6">
          <div>
            <h4 className="text-md font-medium mb-4">Over 2° Tempo per Risultato 1° Tempo</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h5 className="text-sm font-medium mb-3 text-center">{homeTeam} (Casa)</h5>
                <div className="grid grid-cols-3 gap-2">
                  {homeTeamStats.map(stats => (
                    <ResultCard
                      key={stats.firstHalfScore}
                      stats={stats}
                      onMouseEnter={() => setHoveredCard(`home-${stats.firstHalfScore}`)}
                      onMouseLeave={() => setHoveredCard(null)}
                      isHovered={hoveredCard === `home-${stats.firstHalfScore}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-3 text-center">{awayTeam} (Trasferta)</h5>
                <div className="grid grid-cols-3 gap-2">
                  {awayTeamStats.map(stats => (
                    <ResultCard
                      key={stats.firstHalfScore}
                      stats={stats}
                      onMouseEnter={() => setHoveredCard(`away-${stats.firstHalfScore}`)}
                      onMouseLeave={() => setHoveredCard(null)}
                      isHovered={hoveredCard === `away-${stats.firstHalfScore}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-3 text-center">Media Campionato</h5>
                <div className="grid grid-cols-3 gap-2">
                  {leagueStats.map(stats => (
                    <ResultCard
                      key={stats.firstHalfScore}
                      stats={stats}
                      onMouseEnter={() => setHoveredCard(`league-${stats.firstHalfScore}`)}
                      onMouseLeave={() => setHoveredCard(null)}
                      isHovered={hoveredCard === `league-${stats.firstHalfScore}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function calculateStats(matches: Match[], isHome: boolean, teamName: string, firstHalfScore: string, isLeague = false) {
  const [homeScore, awayScore] = firstHalfScore.split('-').map(Number);
  
  const relevantMatches = isLeague ? matches : matches.filter(m => 
    isHome ? m.squadra_casa === teamName : m.squadra_trasferta === teamName
  );

  const matchesWithScore = relevantMatches.filter(m => 
    m.gol_primo_tempo_casa === homeScore && m.gol_primo_tempo_trasferta === awayScore
  );

  const totalMatches = matchesWithScore.length;
  if (totalMatches === 0) return {
    firstHalfScore,
    totalMatches: 0,
    over05: 0,
    over15: 0,
    goalDistribution: {
      '46-60': { firstGoal: 0, additionalGoals: 0 },
      '61-75': { firstGoal: 0, additionalGoals: 0 },
      '76-90': { firstGoal: 0, additionalGoals: 0 },
      '90+': { firstGoal: 0, additionalGoals: 0 },
    },
  };

  let over05 = 0;
  let over15 = 0;
  const goalDistribution = {
    '46-60': { firstGoal: 0, additionalGoals: 0 },
    '61-75': { firstGoal: 0, additionalGoals: 0 },
    '76-90': { firstGoal: 0, additionalGoals: 0 },
    '90+': { firstGoal: 0, additionalGoals: 0 },
  };

  matchesWithScore.forEach(match => {
    const secondHalfGoals = match.gol
      .filter(g => parseInt(g.minuto) >= 46)
      .sort((a, b) => parseInt(a.minuto) - parseInt(b.minuto));

    if (secondHalfGoals.length > 0) over05++;
    if (secondHalfGoals.length > 1) over15++;

    secondHalfGoals.forEach((goal, index) => {
      const minute = parseInt(goal.minuto);
      let timeSlot: keyof typeof goalDistribution;
      
      if (minute >= 90) timeSlot = '90+';
      else if (minute >= 76) timeSlot = '76-90';
      else if (minute >= 61) timeSlot = '61-75';
      else timeSlot = '46-60';

      if (index === 0) {
        goalDistribution[timeSlot].firstGoal++;
      } else {
        goalDistribution[timeSlot].additionalGoals++;
      }
    });
  });

  return {
    firstHalfScore,
    totalMatches,
    over05,
    over15,
    goalDistribution,
  };
}