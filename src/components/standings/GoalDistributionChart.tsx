// src/components/standings/GoalDistributionChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Match } from '../../types/Match';
import type { StandingType } from '../../utils/matchFilters';
import { filterMatchesByStandingType } from '../../utils/matchFilters';
import { calculateGoalDistribution } from '../../utils/goalAnalysis';

interface GoalDistributionChartProps {
  matches: Match[];
  teamName: string;
  type: StandingType;
}

export default function GoalDistributionChart({ matches, teamName, type }: GoalDistributionChartProps) {
  // Filter matches based on standing type
  const filteredMatches = filterMatchesByStandingType(matches, teamName, type);
  const chartData = calculateGoalDistribution(filteredMatches, teamName);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium mb-2">{label}</p>
          <div className="space-y-2">
            <div className="border-b pb-2">
              <p className="text-sm font-medium text-gray-700">Gol Segnati:</p>
              <p className="text-sm text-blue-600">
                Primo Gol: {payload[0].value}
              </p>
              <p className="text-sm text-green-600">
                Gol Aggiuntivi: {payload[1].value}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Gol Subiti:</p>
              <p className="text-sm text-red-600">
                Primo Gol: {payload[2].value}
              </p>
              <p className="text-sm text-orange-600">
                Gol Aggiuntivi: {payload[3].value}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timeSlot" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="scoredFirstGoal" 
            name="Primo Gol Segnato" 
            stackId="scored" 
            fill="#3b82f6"
            radius={[4, 4, 0, 0]} 
          />
          <Bar 
            dataKey="scoredAdditionalGoals" 
            name="Gol Aggiuntivi Segnati" 
            stackId="scored" 
            fill="#22c55e"
            radius={[4, 4, 0, 0]} 
          />
          <Bar 
            dataKey="concededFirstGoal" 
            name="Primo Gol Subito" 
            stackId="conceded" 
            fill="#ef4444"
            radius={[4, 4, 0, 0]} 
          />
          <Bar 
            dataKey="concededAdditionalGoals" 
            name="Gol Aggiuntivi Subiti" 
            stackId="conceded" 
            fill="#f97316"
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
