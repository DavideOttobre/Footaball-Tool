import React from 'react';
import type { TeamStats } from '../../types/Stats';
import type { Match } from '../../types/Match';
import { calculateDetailedTeamStats } from '../../utils/stats/detailedTeamStats';
import DetailedStatsSection from './DetailedStatsSection';

interface StatsColumnProps {
  title: string;
  stats: TeamStats;
  teamName: string;
  context: 'all' | 'home' | 'away';
  matches: Match[];
}

export default function StatsColumn({ 
  title, 
  stats, 
  teamName,
  context,
  matches 
}: StatsColumnProps) {
  const detailedStats = React.useMemo(() => 
    calculateDetailedTeamStats(matches, teamName, context),
    [matches, teamName, context]
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      
      {/* Basic stats */}
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Partite Giocate</p>
          <p className="text-xl font-bold">{stats.totalMatches}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-sm text-gray-600">Vittorie</p>
            <p className="text-lg font-semibold text-green-600">{stats.wins}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pareggi</p>
            <p className="text-lg font-semibold text-yellow-600">{stats.draws}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Sconfitte</p>
            <p className="text-lg font-semibold text-red-600">{stats.losses}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Gol Fatti</p>
            <p className="text-lg font-semibold text-blue-600">{stats.goalsScored}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Gol Subiti</p>
            <p className="text-lg font-semibold text-red-600">{stats.goalsConceded}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600">Media Punti</p>
          <p className="text-xl font-bold">{stats.averagePoints.toFixed(2)}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Posizione</p>
          <p className="text-xl font-bold">{stats.position}°</p>
        </div>
      </div>

      {/* Detailed stats section */}
      <div className="pt-4 border-t">
        <DetailedStatsSection stats={detailedStats} />
      </div>
    </div>
  );
}