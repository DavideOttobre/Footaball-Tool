import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GoalComparison({ homeTeam, awayTeam, homeStats, awayStats }) {
  const goalData = [
    {
      period: 'Primo Tempo',
      [`${homeTeam} Fatti`]: homeStats.goals.firstHalf.scored,
      [`${homeTeam} Subiti`]: homeStats.goals.firstHalf.conceded,
      [`${awayTeam} Fatti`]: awayStats.goals.firstHalf.scored,
      [`${awayTeam} Subiti`]: awayStats.goals.firstHalf.conceded,
    },
    {
      period: 'Secondo Tempo',
      [`${homeTeam} Fatti`]: homeStats.goals.secondHalf.scored,
      [`${homeTeam} Subiti`]: homeStats.goals.secondHalf.conceded,
      [`${awayTeam} Fatti`]: awayStats.goals.secondHalf.scored,
      [`${awayTeam} Subiti`]: awayStats.goals.secondHalf.conceded,
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Distribuzione Gol</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={goalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={`${homeTeam} Fatti`} fill="#3b82f6" />
            <Bar dataKey={`${homeTeam} Subiti`} fill="#93c5fd" />
            <Bar dataKey={`${awayTeam} Fatti`} fill="#ef4444" />
            <Bar dataKey={`${awayTeam} Subiti`} fill="#fca5a5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">{homeTeam}</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Media Gol Fatti 1°T</span>
              <span className="font-bold">{homeStats.goals.firstHalf.avgScored.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Media Gol Subiti 1°T</span>
              <span className="font-bold">{homeStats.goals.firstHalf.avgConceded.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Media Gol Fatti 2°T</span>
              <span className="font-bold">{homeStats.goals.secondHalf.avgScored.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Media Gol Subiti 2°T</span>
              <span className="font-bold">{homeStats.goals.secondHalf.avgConceded.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">{awayTeam}</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Media Gol Fatti 1°T</span>
              <span className="font-bold">{awayStats.goals.firstHalf.avgScored.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Media Gol Subiti 1°T</span>
              <span className="font-bold">{awayStats.goals.firstHalf.avgConceded.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Media Gol Fatti 2°T</span>
              <span className="font-bold">{awayStats.goals.secondHalf.avgScored.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Media Gol Subiti 2°T</span>
              <span className="font-bold">{awayStats.goals.secondHalf.avgConceded.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}