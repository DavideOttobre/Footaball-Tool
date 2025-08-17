import React from 'react';
import type { Match } from '../../types/Match';
import { calculateCurrentSeasonStats } from '../../utils/analysis/currentSeasonAnalyzer';
import { findSimilarHistoricalMatches } from '../../utils/analysis/historicalMatcher';
import MatchesList from './MatchesList';

interface PreMatchAnalysisProps {
  matches: Match[];
  homeTeam: string;
  awayTeam: string;
}

export default function PreMatchAnalysis({ matches, homeTeam, awayTeam }: PreMatchAnalysisProps) {
  const currentSeasonStats = React.useMemo(() => 
    calculateCurrentSeasonStats(matches, homeTeam, awayTeam),
    [matches, homeTeam, awayTeam]
  );

  const historicalMatches = React.useMemo(() => 
    findSimilarHistoricalMatches(matches, currentSeasonStats),
    [matches, currentSeasonStats]
  );

  return (
    <div className="space-y-6">
      {/* Statistiche Stagione Corrente */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-4">Probabilità Stagione Corrente</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            label="Over 0.5 1°T"
            value={currentSeasonStats.over05HT}
            type="percentage"
          />
          <StatCard 
            label="Over 1.5 2°T"
            value={currentSeasonStats.over15ST}
            type="percentage"
          />
          <StatCard 
            label="Over 2.5"
            value={currentSeasonStats.over25FT}
            type="percentage"
          />
          <StatCard 
            label="BTTS"
            value={currentSeasonStats.btts}
            type="percentage"
          />
          <StatCard 
            label="Segna Prima Casa"
            value={currentSeasonStats.homeScoresFirst}
            type="percentage"
          />
          <StatCard 
            label="Gol Ultimi 15'"
            value={currentSeasonStats.goalsLast15}
            type="percentage"
          />
          <StatCard 
            label="No Pareggio"
            value={currentSeasonStats.noDraw}
            type="percentage"
          />
        </div>
      </div>

      {/* Analisi Storica */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-4">Riscontro Storico</h3>
        <div className="space-y-4">
          {Object.entries(historicalMatches).map(([event, matches]) => (
            <div key={event} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{event}</span>
                <MatchesList 
                  matches={matches}
                  label={`Partite Simili - ${event}`}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ 
                      width: `${(matches.filter(m => m.verified).length / matches.length * 100)}%` 
                    }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {(matches.filter(m => m.verified).length / matches.length * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                In {matches.filter(m => m.verified).length} su {matches.length} partite 
                con probabilità simili l'evento si è verificato
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  type: 'percentage' | 'decimal';
}

function StatCard({ label, value, type }: StatCardProps) {
  const formattedValue = type === 'percentage' 
    ? `${(value * 100).toFixed(1)}%`
    : value.toFixed(2);

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-xl font-bold">{formattedValue}</p>
    </div>
  );
}