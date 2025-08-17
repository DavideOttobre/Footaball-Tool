import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Match } from '../types/Match';

interface GoalDistributionChartProps {
  matches: Match[];
}

export default function GoalDistributionChart({ matches }: GoalDistributionChartProps) {
  const data = matches.reduce((acc: Record<string, number>, match) => {
    const totalGoals = match.gol_casa + match.gol_trasferta;
    acc[totalGoals] = (acc[totalGoals] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(data).map(([goals, count]) => ({
    goals: `${goals} Goals`,
    matches: count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="goals" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="matches" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
}