import React, { useState } from 'react';
import { useMatchStore } from '../../store/matchStore';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Match } from '../../types/Match';
import ResultCard from './ResultCard';
import LongTermAnalysis from './LongTermAnalysis';

interface CurrentSeasonAnalysisProps {
  homeTeam: string;
  awayTeam: string;
  matches?: Match[];
}

export default function CurrentSeasonAnalysis({ 
  homeTeam, 
  awayTeam,
  matches: propMatches 
}: CurrentSeasonAnalysisProps) {
  const { matches: storeMatches } = useMatchStore();
  const matches = propMatches || storeMatches;
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const currentSeason = matches[0]?.stagione;
  const currentSeasonMatches = matches.filter(m => m.stagione === currentSeason);

  // Get most frequent first half results
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

  // Get league-wide first half results
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

  const homeTeamResults = getFrequentResults(currentSeasonMatches, homeTeam, true);
  const awayTeamResults = getFrequentResults(currentSeasonMatches, awayTeam, false);
  const leagueResults = getLeagueResults(currentSeasonMatches);

  const homeTeamStats = homeTeamResults.map(result => calculateStats(currentSeasonMatches, true, homeTeam, result));
  const awayTeamStats = awayTeamResults.map(result => calculateStats(currentSeasonMatches, false, awayTeam, result));
  const leagueStats = leagueResults.map(result => calculateStats(currentSeasonMatches, true, '', result, true));

  return (
    <div className="space-y-6">
      <Section title="Analisi Stagione Corrente" id="current">
        <div className="space-y-6">
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
      </Section>

      <LongTermAnalysis 
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        matches={matches}
      />
    </div>
  );
}

interface SectionProps {
  title: string;
  id: 'current' | 'historical';
  children: React.ReactNode;
}

function Section({ title, id, children }: SectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border rounded-lg p-4">
      <button
        className="w-full flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-medium">{title}</h3>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      
      {isExpanded && <div className="mt-4">{children}</div>}
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