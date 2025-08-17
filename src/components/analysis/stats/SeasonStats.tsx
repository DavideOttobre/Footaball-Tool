import React from 'react';
import type { Match } from '../../../types/Match';
import { calculateSeasonStats } from '../../../utils/stats/seasonCalculator';

interface SeasonStatsProps {
  matches: Match[];
  teamName: string;
  isHome: boolean;
}

export default function SeasonStats({ matches, teamName, isHome }: SeasonStatsProps) {
  const stats = React.useMemo(() => 
    calculateSeasonStats(matches, teamName, isHome),
    [matches, teamName, isHome]
  );

  const StatCard = ({ label, value, percentage = true }: { label: string; value: number; percentage?: boolean }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-lg font-semibold">
        {percentage ? `${value.toFixed(1)}%` : value}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Over 0.5" value={stats.over05Percentage} />
        <StatCard label="Over 1.5" value={stats.over15Percentage} />
        <StatCard label="Over 2.5" value={stats.over25Percentage} />
        <StatCard label="GG" value={stats.bttsPercentage} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Prob. Vittoria" value={stats.winPercentage} />
        <StatCard label="Prob. Pareggio" value={stats.drawPercentage} />
        <StatCard label="Prob. Sconfitta" value={stats.lossPercentage} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Media Gol Fatti" value={stats.avgGoalsScored} percentage={false} />
        <StatCard label="Media Gol Subiti" value={stats.avgGoalsConceded} percentage={false} />
      </div>
    </div>
  );
}