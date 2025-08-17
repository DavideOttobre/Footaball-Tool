import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGoalDistribution } from '../../../hooks/useGoalDistribution';
import type { Match } from '../../../types/Match';

interface Props {
  matches: Match[];
  teamName: string;
}

export default function GoalDistributionChart({ matches, teamName }: Props) {
  const { chartData, CustomTooltip } = useGoalDistribution(matches, teamName);

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timeSlot" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="firstGoal" name="Primo Gol" fill="#3b82f6" stackId="stack" />
          <Bar dataKey="additionalGoals" name="Gol Aggiuntivi" fill="#ef4444" stackId="stack" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}