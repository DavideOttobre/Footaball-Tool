import { useMemo } from 'react';
import type { Match } from '../types/Match';
import { calculateGoalDistribution } from '../utils/goalAnalysis';

export function useGoalDistribution(matches: Match[], teamName: string) {
  const chartData = useMemo(() => 
    calculateGoalDistribution(matches, teamName), 
    [matches, teamName]
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-medium mb-2">{label} minuti</p>
        <div className="space-y-1">
          <p className="text-sm text-blue-600">
            Primo Gol: {payload[0].value}
          </p>
          <p className="text-sm text-red-600">
            Gol Aggiuntivi: {payload[1].value}
          </p>
        </div>
      </div>
    );
  };

  return { chartData, CustomTooltip };
}