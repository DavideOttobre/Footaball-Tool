import React, { useState } from 'react';
import { useMatchStore } from '../../store/matchStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import StandingsTable from './StandingsTable';
import { 
  calculateGeneralStandings,
  calculateHomeStandings,
  calculateAwayStandings,
  calculateAttackStandings,
  calculateDefenseStandings,
  calculateFormStandings
} from '../../utils/standingsCalculator';
import {
  calculateFirstHalfStandings,
  calculateSecondHalfStandings
} from '../../utils/halfTimeStandingsCalculator';

export default function LeagueStandings() {
  const { matches } = useMatchStore();
  const [highlightedTeams, setHighlightedTeams] = useState<string[]>([]);
  
  const currentSeason = React.useMemo(() => {
    return matches[0]?.stagione || '';
  }, [matches]);

  const seasonMatches = React.useMemo(() => {
    return matches.filter(m => m.stagione === currentSeason);
  }, [matches, currentSeason]);

  const generalStandings = React.useMemo(() => 
    calculateGeneralStandings(seasonMatches), [seasonMatches]);

  const homeStandings = React.useMemo(() => 
    calculateHomeStandings(seasonMatches), [seasonMatches]);

  const awayStandings = React.useMemo(() => 
    calculateAwayStandings(seasonMatches), [seasonMatches]);

  const attackStandings = React.useMemo(() => 
    calculateAttackStandings(seasonMatches), [seasonMatches]);

  const defenseStandings = React.useMemo(() => 
    calculateDefenseStandings(seasonMatches), [seasonMatches]);

  const formStandings = React.useMemo(() => 
    calculateFormStandings(seasonMatches), [seasonMatches]);

  const firstHalfStandings = React.useMemo(() =>
    calculateFirstHalfStandings(seasonMatches), [seasonMatches]);

  const secondHalfStandings = React.useMemo(() =>
    calculateSecondHalfStandings(seasonMatches), [seasonMatches]);

  const handleTeamClick = (teamName: string) => {
    setHighlightedTeams(prev => 
      prev.includes(teamName) 
        ? prev.filter(t => t !== teamName)
        : [...prev, teamName]
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Classifiche {currentSeason}</h2>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">Generale</TabsTrigger>
          <TabsTrigger value="home">Casa</TabsTrigger>
          <TabsTrigger value="away">Trasferta</TabsTrigger>
          <TabsTrigger value="firstHalf">Primo Tempo</TabsTrigger>
          <TabsTrigger value="secondHalf">Secondo Tempo</TabsTrigger>
          <TabsTrigger value="attack">Attacco</TabsTrigger>
          <TabsTrigger value="defense">Difesa</TabsTrigger>
          <TabsTrigger value="form">Ultime 10</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <StandingsTable 
            standings={generalStandings}
            type="general"
            title="Classifica Generale"
            highlightedTeams={highlightedTeams}
          />
        </TabsContent>

        <TabsContent value="home">
          <StandingsTable 
            standings={homeStandings}
            type="general"
            title="Classifica Casa"
            highlightedTeams={highlightedTeams}
          />
        </TabsContent>

        <TabsContent value="away">
          <StandingsTable 
            standings={awayStandings}
            type="general"
            title="Classifica Trasferta"
            highlightedTeams={highlightedTeams}
          />
        </TabsContent>

        <TabsContent value="firstHalf">
          <StandingsTable 
            standings={firstHalfStandings}
            type="general"
            title="Classifica Primo Tempo"
            highlightedTeams={highlightedTeams}
          />
        </TabsContent>

        <TabsContent value="secondHalf">
          <StandingsTable 
            standings={secondHalfStandings}
            type="general"
            title="Classifica Secondo Tempo"
            highlightedTeams={highlightedTeams}
          />
        </TabsContent>

        <TabsContent value="attack">
          <StandingsTable 
            standings={attackStandings}
            type="attack"
            title="Classifica Attacco"
            highlightedTeams={highlightedTeams}
          />
        </TabsContent>

        <TabsContent value="defense">
          <StandingsTable 
            standings={defenseStandings}
            type="defense"
            title="Classifica Difesa"
            highlightedTeams={highlightedTeams}
          />
        </TabsContent>

        <TabsContent value="form">
          <StandingsTable 
            standings={formStandings}
            type="form"
            title="Classifica Ultime 10"
            highlightedTeams={highlightedTeams}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}