import React from 'react';
import { useMatchStore } from '../../store/matchStore';
import { calculateTeamStats } from '../../utils/statsCalculator';
import StatsColumn from '../stats/StatsColumn';

interface SeasonStatsProps {
  homeTeam: string;
  awayTeam: string;
}

export default function SeasonStats({ homeTeam, awayTeam }: SeasonStatsProps) {
  const { matches } = useMatchStore();
  
  const currentSeason = React.useMemo(() => {
    return matches[0]?.stagione || '';
  }, [matches]);

  const seasonMatches = React.useMemo(() => {
    return matches.filter(m => m.stagione === currentSeason);
  }, [matches, currentSeason]);

  const homeTeamAllMatches = React.useMemo(() => {
    return seasonMatches.filter(m => 
      m.squadra_casa === homeTeam || m.squadra_trasferta === homeTeam
    );
  }, [seasonMatches, homeTeam]);

  const homeTeamHomeMatches = React.useMemo(() => {
    return seasonMatches.filter(m => m.squadra_casa === homeTeam);
  }, [seasonMatches, homeTeam]);

  const awayTeamAwayMatches = React.useMemo(() => {
    return seasonMatches.filter(m => m.squadra_trasferta === awayTeam);
  }, [seasonMatches, awayTeam]);

  const awayTeamAllMatches = React.useMemo(() => {
    return seasonMatches.filter(m => 
      m.squadra_casa === awayTeam || m.squadra_trasferta === awayTeam
    );
  }, [seasonMatches, awayTeam]);

  const homeTeamAllStats = React.useMemo(() => 
    calculateTeamStats(homeTeamAllMatches, homeTeam), [homeTeamAllMatches, homeTeam]);

  const homeTeamHomeStats = React.useMemo(() => 
    calculateTeamStats(homeTeamHomeMatches, homeTeam), [homeTeamHomeMatches, homeTeam]);

  const awayTeamAwayStats = React.useMemo(() => 
    calculateTeamStats(awayTeamAwayMatches, awayTeam), [awayTeamAwayMatches, awayTeam]);

  const awayTeamAllStats = React.useMemo(() => 
    calculateTeamStats(awayTeamAllMatches, awayTeam), [awayTeamAllMatches, awayTeam]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatsColumn
        title={`${homeTeam} - Stagione Completa`}
        stats={homeTeamAllStats}
        teamName={homeTeam}
        context="all"
        matches={seasonMatches}
      />
      <StatsColumn
        title={`${homeTeam} - Solo Casa`}
        stats={homeTeamHomeStats}
        teamName={homeTeam}
        context="home"
        matches={seasonMatches}
      />
      <StatsColumn
        title={`${awayTeam} - Solo Trasferta`}
        stats={awayTeamAwayStats}
        teamName={awayTeam}
        context="away"
        matches={seasonMatches}
      />
      <StatsColumn
        title={`${awayTeam} - Stagione Completa`}
        stats={awayTeamAllStats}
        teamName={awayTeam}
        context="all"
        matches={seasonMatches}
      />
    </div>
  );
}