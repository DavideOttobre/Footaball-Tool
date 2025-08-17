import React from 'react';
import type { DetailedTeamStats } from '../../utils/stats/detailedTeamStats';

interface DetailedStatsSectionProps {
  stats: DetailedTeamStats;
}

export default function DetailedStatsSection({ stats }: DetailedStatsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">0-0 Primo Tempo</p>
          <p className="text-lg font-semibold">{stats.zeroZeroStats.firstHalf.percentage.toFixed(1)}%</p>
          <p className="text-xs text-gray-500">{stats.zeroZeroStats.firstHalf.count} partite</p>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">0-0 Finale</p>
          <p className="text-lg font-semibold">{stats.zeroZeroStats.fullTime.percentage.toFixed(1)}%</p>
          <p className="text-xs text-gray-500">{stats.zeroZeroStats.fullTime.count} partite</p>
        </div>
      </div>

      <div className="p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Posizione in Classifica</p>
        <div className="flex justify-between mt-1">
          <div>
            <p className="text-lg font-semibold">{stats.positions.firstHalf}°</p>
            <p className="text-xs text-gray-500">Primo Tempo</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{stats.positions.secondHalf}°</p>
            <p className="text-xs text-gray-500">Secondo Tempo</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Quando segna per primo</p>
          <p className="text-lg font-semibold text-blue-600">
            {stats.scoringPattern.scoredFirst.percentage.toFixed(1)}%
          </p>
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-500">
              {stats.scoringPattern.scoredFirst.count} volte
            </p>
            <p className="text-xs text-blue-600">
              {stats.scoringPattern.scoredFirst.averagePoints.toFixed(2)} pts/partita
            </p>
          </div>
        </div>

        <div className="p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-gray-600">Quando subisce per primo</p>
          <p className="text-lg font-semibold text-red-600">
            {stats.scoringPattern.concededFirst.percentage.toFixed(1)}%
          </p>
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-500">
              {stats.scoringPattern.concededFirst.count} volte
            </p>
            <p className="text-xs text-red-600">
              {stats.scoringPattern.concededFirst.averagePoints.toFixed(2)} pts/partita
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}