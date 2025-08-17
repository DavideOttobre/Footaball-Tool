import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Match } from '../../types/Match';

interface DetailedGoalAnalysisProps {
  matches: Match[];
  teamName: string;
  isHome: boolean;
}

export default function DetailedGoalAnalysis({ matches, teamName, isHome }: DetailedGoalAnalysisProps) {
  const [showLocationOnly, setShowLocationOnly] = useState(false);

  const filteredMatches = React.useMemo(() => {
    if (!showLocationOnly) return matches;
    return matches.filter(m => 
      isHome ? m.squadra_casa === teamName : m.squadra_trasferta === teamName
    );
  }, [matches, teamName, showLocationOnly, isHome]);

  const chartData = React.useMemo(() => {
    const timeSlots = {
      '0-15': { scoredFirstGoal: 0, scoredAdditionalGoals: 0, concededFirstGoal: 0, concededAdditionalGoals: 0 },
      '16-30': { scoredFirstGoal: 0, scoredAdditionalGoals: 0, concededFirstGoal: 0, concededAdditionalGoals: 0 },
      '31-45': { scoredFirstGoal: 0, scoredAdditionalGoals: 0, concededFirstGoal: 0, concededAdditionalGoals: 0 },
      '46-60': { scoredFirstGoal: 0, scoredAdditionalGoals: 0, concededFirstGoal: 0, concededAdditionalGoals: 0 },
      '61-75': { scoredFirstGoal: 0, scoredAdditionalGoals: 0, concededFirstGoal: 0, concededAdditionalGoals: 0 },
      '76-90': { scoredFirstGoal: 0, scoredAdditionalGoals: 0, concededFirstGoal: 0, concededAdditionalGoals: 0 },
      '90+': { scoredFirstGoal: 0, scoredAdditionalGoals: 0, concededFirstGoal: 0, concededAdditionalGoals: 0 }
    };

    filteredMatches.forEach(match => {
      // Ordina i gol per minuto
      const sortedGoals = [...match.gol].sort((a, b) => parseInt(a.minuto) - parseInt(b.minuto));
      
      // Trova il primo gol segnato e subito
      const firstScoredGoal = sortedGoals.find(g => g.squadra === teamName);
      const firstConcededGoal = sortedGoals.find(g => g.squadra !== teamName);

      sortedGoals.forEach(goal => {
        const minute = parseInt(goal.minuto);
        let timeSlot = '90+';

        if (minute <= 15) timeSlot = '0-15';
        else if (minute <= 30) timeSlot = '16-30';
        else if (minute <= 45) timeSlot = '31-45';
        else if (minute <= 60) timeSlot = '46-60';
        else if (minute <= 75) timeSlot = '61-75';
        else if (minute <= 90) timeSlot = '76-90';

        const isTeamGoal = goal.squadra === teamName;

        if (isTeamGoal) {
          if (goal === firstScoredGoal) {
            timeSlots[timeSlot].scoredFirstGoal++;
          } else {
            timeSlots[timeSlot].scoredAdditionalGoals++;
          }
        } else {
          if (goal === firstConcededGoal) {
            timeSlots[timeSlot].concededFirstGoal++;
          } else {
            timeSlots[timeSlot].concededAdditionalGoals++;
          }
        }
      });
    });

    return Object.entries(timeSlots).map(([timeSlot, goals]) => ({
      timeSlot,
      ...goals
    }));
  }, [filteredMatches, teamName]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Distribuzione Gol - {teamName}</h3>
        <button
          onClick={() => setShowLocationOnly(!showLocationOnly)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${showLocationOnly 
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
          `}
        >
          {showLocationOnly ? 'Mostra Totale' : `Mostra ${isHome ? 'Casa' : 'Trasferta'}`}
        </button>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timeSlot" />
            <YAxis />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                      <p className="text-sm font-medium mb-2">{label} minuti</p>
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
              }}
            />
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
    </div>
  );
}