import React from 'react';
import { useMatchStore } from '../../store/matchStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
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

interface TeamStandingsComparisonProps {
  homeTeam: string;
  awayTeam: string;
}

export default function TeamStandingsComparison({ homeTeam, awayTeam }: TeamStandingsComparisonProps) {
  const { matches } = useMatchStore();
  const currentSeason = matches[0]?.stagione;
  const seasonMatches = matches.filter(m => m.stagione === currentSeason);

  const standings = {
    general: calculateGeneralStandings(seasonMatches),
    home: calculateHomeStandings(seasonMatches),
    away: calculateAwayStandings(seasonMatches),
    firstHalf: calculateFirstHalfStandings(seasonMatches),
    secondHalf: calculateSecondHalfStandings(seasonMatches),
    attack: calculateAttackStandings(seasonMatches),
    defense: calculateDefenseStandings(seasonMatches),
    form: calculateFormStandings(seasonMatches)
  };

  const getTeamStats = (standingType: keyof typeof standings, team: string) => {
    return standings[standingType].find(s => s.name === team);
  };

  const ComparisonRow = ({ label, value1, value2 }: { label: string; value1: any; value2: any }) => (
    <div className="grid grid-cols-3 gap-4 py-2 border-b">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-center font-medium">{value1}</div>
      <div className="text-center font-medium">{value2}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Generale</TabsTrigger>
          <TabsTrigger value="halves">Primo/Secondo Tempo</TabsTrigger>
          <TabsTrigger value="homeaway">Casa/Trasferta</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center font-semibold">{homeTeam}</div>
              <div className="text-center text-gray-500">Statistiche</div>
              <div className="text-center font-semibold">{awayTeam}</div>
            </div>

            {['general'].map(type => {
              const homeStats = getTeamStats(type as keyof typeof standings, homeTeam);
              const awayStats = getTeamStats(type as keyof typeof standings, awayTeam);
              
              return homeStats && awayStats ? (
                <div key={type} className="space-y-2">
                  <ComparisonRow 
                    label="Posizione" 
                    value1={`${homeStats.position}°`}
                    value2={`${awayStats.position}°`}
                  />
                  <ComparisonRow 
                    label="Punti" 
                    value1={homeStats.points}
                    value2={awayStats.points}
                  />
                  <ComparisonRow 
                    label="Vittorie" 
                    value1={homeStats.wins}
                    value2={awayStats.wins}
                  />
                  <ComparisonRow 
                    label="Pareggi" 
                    value1={homeStats.draws}
                    value2={awayStats.draws}
                  />
                  <ComparisonRow 
                    label="Sconfitte" 
                    value1={homeStats.losses}
                    value2={awayStats.losses}
                  />
                  <ComparisonRow 
                    label="Gol Fatti" 
                    value1={homeStats.goalsFor}
                    value2={awayStats.goalsFor}
                  />
                  <ComparisonRow 
                    label="Gol Subiti" 
                    value1={homeStats.goalsAgainst}
                    value2={awayStats.goalsAgainst}
                  />
                  <ComparisonRow 
                    label="Differenza Reti" 
                    value1={homeStats.goalDifference}
                    value2={awayStats.goalDifference}
                  />
                </div>
              ) : null;
            })}
          </div>
        </TabsContent>

        <TabsContent value="halves">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center font-semibold">{homeTeam}</div>
              <div className="text-center text-gray-500">Statistiche</div>
              <div className="text-center font-semibold">{awayTeam}</div>
            </div>

            {['firstHalf', 'secondHalf'].map(type => {
              const homeStats = getTeamStats(type as keyof typeof standings, homeTeam);
              const awayStats = getTeamStats(type as keyof typeof standings, awayTeam);
              
              return homeStats && awayStats ? (
                <div key={type} className="mb-8">
                  <h3 className="text-lg font-medium mb-4">
                    {type === 'firstHalf' ? 'Primo Tempo' : 'Secondo Tempo'}
                  </h3>
                  <div className="space-y-2">
                    <ComparisonRow 
                      label="Posizione" 
                      value1={`${homeStats.position}°`}
                      value2={`${awayStats.position}°`}
                    />
                    <ComparisonRow 
                      label="Punti" 
                      value1={homeStats.points}
                      value2={awayStats.points}
                    />
                    <ComparisonRow 
                      label="Gol Fatti" 
                      value1={homeStats.goalsFor}
                      value2={awayStats.goalsFor}
                    />
                    <ComparisonRow 
                      label="Gol Subiti" 
                      value1={homeStats.goalsAgainst}
                      value2={awayStats.goalsAgainst}
                    />
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </TabsContent>

        <TabsContent value="homeaway">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center font-semibold">{homeTeam}</div>
              <div className="text-center text-gray-500">Statistiche</div>
              <div className="text-center font-semibold">{awayTeam}</div>
            </div>

            {['home', 'away'].map(type => {
              const homeStats = getTeamStats(type as keyof typeof standings, homeTeam);
              const awayStats = getTeamStats(type as keyof typeof standings, awayTeam);
              
              return homeStats && awayStats ? (
                <div key={type} className="mb-8">
                  <h3 className="text-lg font-medium mb-4">
                    {type === 'home' ? 'Rendimento in Casa' : 'Rendimento in Trasferta'}
                  </h3>
                  <div className="space-y-2">
                    <ComparisonRow 
                      label="Posizione" 
                      value1={`${homeStats.position}°`}
                      value2={`${awayStats.position}°`}
                    />
                    <ComparisonRow 
                      label="Punti" 
                      value1={homeStats.points}
                      value2={awayStats.points}
                    />
                    <ComparisonRow 
                      label="Vittorie" 
                      value1={homeStats.wins}
                      value2={awayStats.wins}
                    />
                    <ComparisonRow 
                      label="Gol Fatti" 
                      value1={homeStats.goalsFor}
                      value2={awayStats.goalsFor}
                    />
                    <ComparisonRow 
                      label="Gol Subiti" 
                      value1={homeStats.goalsAgainst}
                      value2={awayStats.goalsAgainst}
                    />
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center font-semibold">{homeTeam}</div>
              <div className="text-center text-gray-500">Statistiche</div>
              <div className="text-center font-semibold">{awayTeam}</div>
            </div>

            {['attack', 'defense', 'form'].map(type => {
              const homeStats = getTeamStats(type as keyof typeof standings, homeTeam);
              const awayStats = getTeamStats(type as keyof typeof standings, awayTeam);
              
              return homeStats && awayStats ? (
                <div key={type} className="mb-8">
                  <h3 className="text-lg font-medium mb-4">
                    {type === 'attack' ? 'Attacco' : 
                     type === 'defense' ? 'Difesa' : 'Forma Recente'}
                  </h3>
                  <div className="space-y-2">
                    <ComparisonRow 
                      label="Posizione" 
                      value1={`${homeStats.position}°`}
                      value2={`${awayStats.position}°`}
                    />
                    {type === 'form' ? (
                      <div className="grid grid-cols-3 gap-4 py-2">
                        <div className="text-sm text-gray-600">Ultime 5</div>
                        <div className="flex justify-center gap-1">
                          {homeStats.form.map((result, i) => (
                            <span key={i} className={`
                              w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold text-white
                              ${result === 'V' ? 'bg-green-500' : 
                                result === 'N' ? 'bg-yellow-500' : 'bg-red-500'}
                            `}>
                              {result}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-center gap-1">
                          {awayStats.form.map((result, i) => (
                            <span key={i} className={`
                              w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold text-white
                              ${result === 'V' ? 'bg-green-500' : 
                                result === 'N' ? 'bg-yellow-500' : 'bg-red-500'}
                            `}>
                              {result}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <ComparisonRow 
                          label="Media Gol Fatti" 
                          value1={homeStats.goalsForAverage.toFixed(2)}
                          value2={awayStats.goalsForAverage.toFixed(2)}
                        />
                        <ComparisonRow 
                          label="Media Gol Subiti" 
                          value1={homeStats.goalsAgainstAverage.toFixed(2)}
                          value2={awayStats.goalsAgainstAverage.toFixed(2)}
                        />
                      </>
                    )}
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}