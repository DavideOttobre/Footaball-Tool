import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Match } from '../../../types/Match';

interface HeadToHeadChartsProps {
  matches: Match[];
  homeTeam: string;
  awayTeam: string;
}

export default function HeadToHeadCharts({ matches, homeTeam, awayTeam }: HeadToHeadChartsProps) {
  const goalDistribution = React.useMemo(() => {
    const distribution = {
      '0-15': { homeFirstGoal: 0, homeOtherGoals: 0, awayFirstGoal: 0, awayOtherGoals: 0 },
      '16-30': { homeFirstGoal: 0, homeOtherGoals: 0, awayFirstGoal: 0, awayOtherGoals: 0 },
      '31-45': { homeFirstGoal: 0, homeOtherGoals: 0, awayFirstGoal: 0, awayOtherGoals: 0 },
      '45+': { homeFirstGoal: 0, homeOtherGoals: 0, awayFirstGoal: 0, awayOtherGoals: 0 },
      '46-60': { homeFirstGoal: 0, homeOtherGoals: 0, awayFirstGoal: 0, awayOtherGoals: 0 },
      '61-75': { homeFirstGoal: 0, homeOtherGoals: 0, awayFirstGoal: 0, awayOtherGoals: 0 },
      '76-90': { homeFirstGoal: 0, homeOtherGoals: 0, awayFirstGoal: 0, awayOtherGoals: 0 },
      '90+': { homeFirstGoal: 0, homeOtherGoals: 0, awayFirstGoal: 0, awayOtherGoals: 0 },
    };

    matches.forEach(match => {
      // Sort goals by minute to identify first goal
      const sortedGoals = [...match.gol].sort((a, b) => {
        const minuteA = parseInt(a.minuto);
        const minuteB = parseInt(b.minuto);
        return minuteA - minuteB;
      });

      const firstGoal = sortedGoals[0];

      sortedGoals.forEach(goal => {
        const isHomeTeamGoal = goal.squadra === homeTeam;
        const isFirstGoal = goal === firstGoal;
        const minute = parseInt(goal.minuto);
        let timeSlot: keyof typeof distribution;

        if (goal.minuto.includes('45+')) timeSlot = '45+';
        else if (goal.minuto.includes('90+')) timeSlot = '90+';
        else if (minute <= 15) timeSlot = '0-15';
        else if (minute <= 30) timeSlot = '16-30';
        else if (minute <= 45) timeSlot = '31-45';
        else if (minute <= 60) timeSlot = '46-60';
        else if (minute <= 75) timeSlot = '61-75';
        else timeSlot = '76-90';

        if (isHomeTeamGoal) {
          if (isFirstGoal) {
            distribution[timeSlot].homeFirstGoal++;
          } else {
            distribution[timeSlot].homeOtherGoals++;
          }
        } else {
          if (isFirstGoal) {
            distribution[timeSlot].awayFirstGoal++;
          } else {
            distribution[timeSlot].awayOtherGoals++;
          }
        }
      });
    });

    return Object.entries(distribution).map(([timeRange, goals]) => ({
      timeRange,
      [`${homeTeam} - Primo Gol`]: goals.homeFirstGoal,
      [`${homeTeam} - Altri Gol`]: goals.homeOtherGoals,
      [`${awayTeam} - Primo Gol`]: goals.awayFirstGoal,
      [`${awayTeam} - Altri Gol`]: goals.awayOtherGoals,
    }));
  }, [matches, homeTeam, awayTeam]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Distribuzione Gol per Minuto</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={goalDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timeRange" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={`${homeTeam} - Primo Gol`} fill="#3b82f6" stackId="home" />
              <Bar dataKey={`${homeTeam} - Altri Gol`} fill="#93c5fd" stackId="home" />
              <Bar dataKey={`${awayTeam} - Primo Gol`} fill="#ef4444" stackId="away" />
              <Bar dataKey={`${awayTeam} - Altri Gol`} fill="#fca5a5" stackId="away" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}