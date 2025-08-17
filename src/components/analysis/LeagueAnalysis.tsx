import React from 'react';
import { useMatchStore } from '../../store/matchStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function LeagueAnalysis() {
  const { matches } = useMatchStore();

  const seasonStats = React.useMemo(() => {
    const statsBySeason = matches.reduce((acc, match) => {
      if (!acc[match.stagione]) {
        acc[match.stagione] = {
          season: match.stagione,
          avgGoals: 0,
          homeWinPerc: 0,
          drawPerc: 0,
          awayWinPerc: 0,
          matches: 0,
        };
      }
      
      const stats = acc[match.stagione];
      stats.matches++;
      stats.avgGoals += match.gol_casa + match.gol_trasferta;
      
      if (match.gol_casa > match.gol_trasferta) stats.homeWinPerc++;
      else if (match.gol_casa < match.gol_trasferta) stats.awayWinPerc++;
      else stats.drawPerc++;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(statsBySeason).map(stats => ({
      ...stats,
      avgGoals: +(stats.avgGoals / stats.matches).toFixed(2),
      homeWinPerc: +((stats.homeWinPerc / stats.matches) * 100).toFixed(1),
      drawPerc: +((stats.drawPerc / stats.matches) * 100).toFixed(1),
      awayWinPerc: +((stats.awayWinPerc / stats.matches) * 100).toFixed(1),
    }));
  }, [matches]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Analisi Campionato per Stagione</h2>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={seasonStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="season" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgGoals" name="Media Gol" fill="#3b82f6" />
            <Bar dataKey="homeWinPerc" name="% Vittorie Casa" fill="#ef4444" />
            <Bar dataKey="drawPerc" name="% Pareggi" fill="#10b981" />
            <Bar dataKey="awayWinPerc" name="% Vittorie Trasferta" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}