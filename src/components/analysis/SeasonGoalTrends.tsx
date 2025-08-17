import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { Match } from '../../types/Match';

interface SeasonGoalTrendsProps {
  matches: Match[];
  teamName: string;
}

interface TrendData {
  matchday: number;
  date: string;
  goalsScored: number;
  goalsConceded: number;
  scoredAvg: number;
  concededAvg: number;
}

export default function SeasonGoalTrends({ matches, teamName }: SeasonGoalTrendsProps) {
  const sortedMatches = React.useMemo(() => {
    return [...matches]
      .filter(m => m.squadra_casa === teamName || m.squadra_trasferta === teamName)
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  }, [matches, teamName]);

  const trendData: TrendData[] = React.useMemo(() => {
    let totalGoalsScored = 0;
    let totalGoalsConceded = 0;

    return sortedMatches.map((match, index) => {
      const isHome = match.squadra_casa === teamName;
      const goalsScored = isHome ? match.gol_casa : match.gol_trasferta;
      const goalsConceded = isHome ? match.gol_trasferta : match.gol_casa;

      totalGoalsScored += goalsScored;
      totalGoalsConceded += goalsConceded;

      return {
        matchday: index + 1,
        date: match.data,
        goalsScored,
        goalsConceded,
        scoredAvg: Number((totalGoalsScored / (index + 1)).toFixed(2)),
        concededAvg: Number((totalGoalsConceded / (index + 1)).toFixed(2)),
      };
    });
  }, [sortedMatches, teamName]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium">Giornata {label}</p>
          <p className="text-sm text-gray-600">{payload[0].payload.date}</p>
          <div className="space-y-1 mt-1">
            <div className="space-y-1 border-b pb-1">
              <p className="text-sm font-medium">Gol Segnati:</p>
              <p className="text-sm text-blue-600">
                Partita: {payload[0].payload.goalsScored}
              </p>
              <p className="text-sm text-green-600">
                Media: {payload[0].payload.scoredAvg.toFixed(2)}
              </p>
            </div>
            <div className="space-y-1 pt-1">
              <p className="text-sm font-medium">Gol Subiti:</p>
              <p className="text-sm text-red-600">
                Partita: {payload[0].payload.goalsConceded}
              </p>
              <p className="text-sm text-orange-600">
                Media: {payload[0].payload.concededAvg.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    if (!payload) return null;

    return (
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        <div className="space-y-2">
          <p className="text-sm font-medium">Gol Segnati:</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm">Partita</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">Media</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Gol Subiti:</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm">Partita</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm">Media</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Trend Gol Stagionale - {teamName}</h3>
      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="matchday" 
              label={{ 
                value: 'Giornata', 
                position: 'insideBottom', 
                offset: -5 
              }}
            />
            <YAxis 
              domain={[0, 'auto']}
              label={{ 
                value: 'Gol', 
                angle: -90, 
                position: 'insideLeft',
                offset: 10
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <ReferenceLine y={0.5} stroke="#666" strokeDasharray="3 3" />
            
            {/* Gol Segnati */}
            <Line 
              type="monotone" 
              dataKey="goalsScored" 
              name="Gol Segnati" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ r: 4, fill: "#3b82f6" }}
            />
            <Line 
              type="monotone" 
              dataKey="scoredAvg" 
              name="Media Gol Segnati" 
              stroke="#22c55e" 
              strokeWidth={2}
              dot={false}
            />

            {/* Gol Subiti */}
            <Line 
              type="monotone" 
              dataKey="goalsConceded" 
              name="Gol Subiti" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ r: 4, fill: "#ef4444" }}
            />
            <Line 
              type="monotone" 
              dataKey="concededAvg" 
              name="Media Gol Subiti" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}