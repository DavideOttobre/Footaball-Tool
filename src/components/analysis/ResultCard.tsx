import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ResultCardProps {
  stats: {
    firstHalfScore: string;
    totalMatches: number;
    over05: number;
    over15: number;
    goalDistribution: {
      '46-60': { firstGoal: number; additionalGoals: number };
      '61-75': { firstGoal: number; additionalGoals: number };
      '76-90': { firstGoal: number; additionalGoals: number };
      '90+': { firstGoal: number; additionalGoals: number };
    };
  };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isHovered: boolean;
}

export default function ResultCard({ stats, onMouseEnter, onMouseLeave, isHovered }: ResultCardProps) {
  const over05Percentage = (stats.over05 / stats.totalMatches) * 100;
  const over15Percentage = (stats.over15 / stats.totalMatches) * 100;

  const chartData = Object.entries(stats.goalDistribution).map(([timeRange, goals]) => ({
    timeRange,
    'Primo Gol': goals.firstGoal,
    'Gol Aggiuntivi': goals.additionalGoals,
  }));

  return (
    <div
      className="relative bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="text-center">
        <h4 className="text-lg font-medium mb-2">{stats.firstHalfScore}</h4>
        <p className="text-sm text-gray-500 mb-1">
          {stats.totalMatches} partite
        </p>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-600">Over 0.5</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 rounded-full h-2"
                style={{ width: `${over05Percentage}%` }}
              />
            </div>
            <p className="text-sm font-medium">{over05Percentage.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Over 1.5</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 rounded-full h-2"
                style={{ width: `${over15Percentage}%` }}
              />
            </div>
            <p className="text-sm font-medium">{over15Percentage.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {isHovered && (
        <div className="absolute z-10 left-0 -bottom-48 w-80 bg-white rounded-lg shadow-lg p-4">
          <h4 className="text-sm font-medium mb-2">Distribuzione Gol 2° Tempo</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timeRange" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Primo Gol" fill="#3b82f6" stackId="stack" />
                <Bar dataKey="Gol Aggiuntivi" fill="#ef4444" stackId="stack" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}