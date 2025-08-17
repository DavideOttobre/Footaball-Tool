import React from 'react';
import type { Match } from '../../../types/Match';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/Tabs';
import CurrentSeasonAnalysis from '../../analysis/CurrentSeasonAnalysis';
import TeamPerformance from '../../sections/TeamPerformance';
import HeadToHead from '../../analysis/HeadToHead';
import OddsAnalysis from '../../analysis/OddsAnalysis';

interface Props {
  match: Match;
  matchesUntilDate: Match[];
  currentSeasonMatches: Match[];
  recentHomeMatches: Match[];
  recentAwayMatches: Match[];
  headToHead: Match[];
}

export default function AnalysisTabs({ 
  match, 
  matchesUntilDate, 
  currentSeasonMatches,
  recentHomeMatches,
  recentAwayMatches,
  headToHead
}: Props) {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Panoramica</TabsTrigger>
        <TabsTrigger value="performance">Prestazioni</TabsTrigger>
        <TabsTrigger value="timing">Tempistiche</TabsTrigger>
        <TabsTrigger value="historical">Storico</TabsTrigger>
        <TabsTrigger value="odds">Quote</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <CurrentSeasonAnalysis 
          homeTeam={match.squadra_casa}
          awayTeam={match.squadra_trasferta}
          matches={currentSeasonMatches}
        />
      </TabsContent>

      <TabsContent value="performance">
        <TeamPerformance 
          homeTeam={match.squadra_casa}
          awayTeam={match.squadra_trasferta}
          matches={matchesUntilDate}
        />
      </TabsContent>

      <TabsContent value="timing">
        <CurrentSeasonAnalysis 
          homeTeam={match.squadra_casa}
          awayTeam={match.squadra_trasferta}
          matches={currentSeasonMatches}
        />
      </TabsContent>

      <TabsContent value="historical">
        <HeadToHead 
          homeTeam={match.squadra_casa}
          awayTeam={match.squadra_trasferta}
          matches={headToHead}
        />
      </TabsContent>

      <TabsContent value="odds">
        <OddsAnalysis 
          homeTeam={match.squadra_casa}
          awayTeam={match.squadra_trasferta}
          matches={matchesUntilDate}
        />
      </TabsContent>
    </Tabs>
  );
}