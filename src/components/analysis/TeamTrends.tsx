import React from 'react';
import { useMatchStore } from '../../store/matchStore';
import SeasonStats from './stats/SeasonStats';
import RecentMatches from './stats/RecentMatches';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';

interface TeamTrendsProps {
  teamName: string;
  isHome: boolean;
}

export default function TeamTrends({ teamName, isHome }: TeamTrendsProps) {
  const { matches } = useMatchStore();
  const currentSeason = matches[0]?.stagione;

  const seasonMatches = React.useMemo(() => 
    matches.filter(m => m.stagione === currentSeason), 
    [matches, currentSeason]
  );

  const recentMatches = React.useMemo(() => {
    return matches
      .filter(m => (
        isHome ? m.squadra_casa === teamName : m.squadra_trasferta === teamName
      ))
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 5)
      .reverse();
  }, [matches, teamName, isHome]);

  const seasonVenueMatches = React.useMemo(() => {
    return seasonMatches.filter(m => 
      isHome ? m.squadra_casa === teamName : m.squadra_trasferta === teamName
    );
  }, [seasonMatches, teamName, isHome]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">
        {teamName} - Statistiche {isHome ? 'in casa' : 'in trasferta'}
      </h2>

      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList>
          <TabsTrigger value="stats">Statistiche Stagionali</TabsTrigger>
          <TabsTrigger value="recent">Ultime Partite</TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <SeasonStats 
            matches={seasonVenueMatches}
            teamName={teamName}
            isHome={isHome}
          />
        </TabsContent>

        <TabsContent value="recent">
          <RecentMatches 
            matches={recentMatches}
            teamName={teamName}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}