import React from 'react';
import type { Match } from '../../types/Match';
import { StatsCard } from './stats/StatsCard';
import { StatsChart } from './stats/StatsChart';
import { calculateHistoricalStats } from '../../utils/historical/statsCalculator';

interface Props {
  matches: Match[];
}

export default function HistoricalStats({ matches }: Props) {
  const stats = React.useMemo(() => calculateHistoricalStats(matches), [matches]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Media Gol"
          value={stats.averageGoals.toFixed(2)}
          type="goals"
        />
        <StatsCard
          title="Over 2.5"
          value={`${stats.over25Percentage.toFixed(1)}%`}
          type="percentage"
        />
        <StatsCard
          title="GG"
          value={`${stats.bttsPercentage.toFixed(1)}%`}
          type="percentage"
        />
        <StatsCard
          title="Clean Sheet"
          value={`${stats.cleanSheetPercentage.toFixed(1)}%`}
          type="percentage"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsChart
          data={stats.goalDistribution}
          title="Distribuzione Gol"
          type="goals"
        />
        <StatsChart
          data={stats.resultDistribution}
          title="Distribuzione Risultati"
          type="results"
        />
      </div>
    </div>
  );
}