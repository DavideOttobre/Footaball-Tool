import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { Match } from '../../types/Match';

interface GoalTrendsChartsProps {
  matches: Match[];
  teamName: string;
  windowSize?: number;
}

interface TrendData {
  matchNumber: number;
  date: string;
  scoredAvg: number;
  concededAvg: number;
}

export default function GoalTrendsCharts({ matches, teamName, windowSize = 5 }: GoalTrendsChartsProps) {
  const calculateMovingAverage = (data: number[], windowSize: number): number[] => {
    const result: number[] = [];
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - windowSize + 1);
      const window = data.slice(start, i + 1);
      const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
      result.push(Number(avg.toFixed(2)));
    }
    return result;
  };

  const sortedMatches = [...matches]
    .filter(m => m.squadra_casa === teamName || m.squadra_trasferta === teamName)
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  const goalsScored = sortedMatches.map(m => 
    m.squadra_casa === teamName ? m.gol_casa : m.gol_trasferta
  );

  const goalsConceded = sortedMatches.map(m => 
    m.squadra_casa === teamName ? m.gol_trasferta : m.gol_casa
  );

  const scoredAvg = calculateMovingAverage(goalsScored, windowSize);
  const concededAvg = calculateMovingAverage(goalsConceded, windowSize);

  const trendData: TrendData[] = sortedMatches.map((match, index) => ({
    matchNumber: index + 1,
    date: match.data,
    scoredAvg: scoredAvg[index],
    concededAvg: concededAvg[index],
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium">Partita #{label}</p>
          <p className="text-sm text-gray-600">{payload[0].payload.date}</p>
          {payload.map((entry: any, index: number) => (
            <p 
              key={index} 
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Trend Gol - Media Mobile {windowSize} Partite</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="matchNumber" 
              label={{ 
                value: 'Numero Partita', 
                position: 'insideBottom', 
                offset: -5 
              }}
            />
            <YAxis 
              domain={[0, 3]}
              label={{ 
                value: 'Media Gol', 
                angle: -90, 
                position: 'insideLeft',
                offset: 10
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine y={0.5} stroke="#666" strokeDasharray="3 3" />
            <Line 
              type="monotone" 
              dataKey="scoredAvg" 
              name="Media Gol Fatti" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="concededAvg" 
              name="Media Gol Subiti" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}