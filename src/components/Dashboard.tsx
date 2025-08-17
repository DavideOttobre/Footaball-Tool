import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMatchStore } from '../store/matchStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import FileUploader from './FileUploader';
import HistoricalAnalysis from './sections/HistoricalAnalysis';
import CurrentSeasonAnalysisSection from './sections/CurrentSeasonAnalysis';
import TeamPerformance from './sections/TeamPerformance';
import LeagueOverview from './sections/LeagueOverview';
import OddsAnalysis from './analysis/OddsAnalysis';
import PreMatchStats from './analysis/PreMatchStats';
import CombinedStats from './analysis/CombinedStats';
import SeasonStats from './sections/SeasonStats';
import LeagueStandings from './standings/LeagueStandings';
import DatabaseTab from './database/DatabaseTab';

export default function Dashboard() {
  const { matches } = useMatchStore();
  const [searchParams] = useSearchParams();
  const [homeTeam, setHomeTeam] = React.useState('');
  const [awayTeam, setAwayTeam] = React.useState('');

  const teams = React.useMemo(() => {
    const teamSet = new Set<string>();
    matches.forEach(match => {
      teamSet.add(match.squadra_casa);
      teamSet.add(match.squadra_trasferta);
    });
    return Array.from(teamSet).sort();
  }, [matches]);

  React.useEffect(() => {
    const homeParam = searchParams.get('home');
    const awayParam = searchParams.get('away');
    
    if (homeParam && teams.includes(homeParam)) {
      setHomeTeam(homeParam);
    }
    
    if (awayParam && teams.includes(awayParam)) {
      setAwayTeam(awayParam);
    }
  }, [searchParams, teams]);

  const handleTeamChange = (type: 'home' | 'away', value: string) => {
    if (type === 'home') {
      setHomeTeam(value);
      searchParams.set('home', value);
    } else {
      setAwayTeam(value);
      searchParams.set('away', value);
    }
    window.history.pushState({}, '', `?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Analisi Statistiche Calcio</h1>
          </div>

          <div className="mb-8">
            <FileUploader />
          </div>

          {matches.length > 0 && (
            <>
              <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Selezione Squadre</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Squadra Casa
                    </label>
                    <select
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={homeTeam}
                      onChange={(e) => handleTeamChange('home', e.target.value)}
                    >
                      <option value="">Seleziona squadra</option>
                      {teams.map(team => (
                        <option key={team} value={team}>{team}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Squadra Trasferta
                    </label>
                    <select
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={awayTeam}
                      onChange={(e) => handleTeamChange('away', e.target.value)}
                    >
                      <option value="">Seleziona squadra</option>
                      {teams.map(team => (
                        <option key={team} value={team}>{team}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="overview">Panoramica</TabsTrigger>
                  <TabsTrigger value="performance">Prestazioni</TabsTrigger>
                  <TabsTrigger value="timing">Tempistiche</TabsTrigger>
                  <TabsTrigger value="standings">Classifiche</TabsTrigger>
                  <TabsTrigger value="historical">Storico</TabsTrigger>
                  <TabsTrigger value="odds">Quote</TabsTrigger>
                  <TabsTrigger value="database">Database</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <LeagueOverview />
                  {homeTeam && awayTeam && (
                    <SeasonStats homeTeam={homeTeam} awayTeam={awayTeam} />
                  )}
                </TabsContent>

                <TabsContent value="performance">
                  {homeTeam && awayTeam && (
                    <TeamPerformance homeTeam={homeTeam} awayTeam={awayTeam} />
                  )}
                </TabsContent>

                <TabsContent value="timing">
                  {homeTeam && awayTeam && (
                    <CurrentSeasonAnalysisSection homeTeam={homeTeam} awayTeam={awayTeam} />
                  )}
                </TabsContent>

                <TabsContent value="standings">
                  <LeagueStandings />
                </TabsContent>

                <TabsContent value="historical">
                  {homeTeam && awayTeam && (
                    <HistoricalAnalysis homeTeam={homeTeam} awayTeam={awayTeam} />
                  )}
                </TabsContent>

                <TabsContent value="odds">
                  {homeTeam && awayTeam && (
                    <OddsAnalysis homeTeam={homeTeam} awayTeam={awayTeam} />
                  )}
                </TabsContent>

                <TabsContent value="database">
                  <DatabaseTab 
                    homeTeam={homeTeam}
                    awayTeam={awayTeam}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}