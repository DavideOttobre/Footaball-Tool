import React, { useMemo, useState } from 'react';
import { useMatchStore } from '../store/matchStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TeamComparison() {
  const { matches } = useMatchStore();
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');

  const teams = useMemo(() => {
    const teamSet = new Set<string>();
    matches.forEach(match => {
      teamSet.add(match.squadra_casa);
      teamSet.add(match.squadra_trasferta);
    });
    return Array.from(teamSet).sort();
  }, [matches]);

  const teamStats = useMemo(() => {
    if (!team1 || !team2) return null;

    const calculateTeamStats = (teamName: string) => {
      const homeMatches = matches.filter(m => m.squadra_casa === teamName);
      const awayMatches = matches.filter(m => m.squadra_trasferta === teamName);
      
      const totalMatches = homeMatches.length + awayMatches.length;
      if (totalMatches === 0) return null;

      const goalsScored = homeMatches.reduce((acc, m) => acc + m.gol_casa, 0) +
        awayMatches.reduce((acc, m) => acc + m.gol_trasferta, 0);
      
      const goalsConceded = homeMatches.reduce((acc, m) => acc + m.gol_trasferta, 0) +
        awayMatches.reduce((acc, m) => acc + m.gol_casa, 0);

      const wins = homeMatches.filter(m => m.gol_casa > m.gol_trasferta).length +
        awayMatches.filter(m => m.gol_trasferta > m.gol_casa).length;

      return {
        name: teamName,
        partite: totalMatches,
        gol_fatti: goalsScored,
        gol_subiti: goalsConceded,
        vittorie: wins,
        media_gol: +(goalsScored / totalMatches).toFixed(2),
      };
    };

    const stats1 = calculateTeamStats(team1);
    const stats2 = calculateTeamStats(team2);

    if (!stats1 || !stats2) return null;

    return [stats1, stats2];
  }, [matches, team1, team2]);

  const comparisonData = useMemo(() => {
    if (!teamStats) return [];
    
    return [
      { name: 'Media Gol', [teamStats[0].name]: teamStats[0].media_gol, [teamStats[1].name]: teamStats[1].media_gol },
      { name: 'Vittorie', [teamStats[0].name]: teamStats[0].vittorie, [teamStats[1].name]: teamStats[1].vittorie },
      { name: 'Gol Fatti', [teamStats[0].name]: teamStats[0].gol_fatti, [teamStats[1].name]: teamStats[1].gol_fatti },
      { name: 'Gol Subiti', [teamStats[0].name]: teamStats[0].gol_subiti, [teamStats[1].name]: teamStats[1].gol_subiti },
    ];
  }, [teamStats]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Confronto Squadre</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Squadra 1
          </label>
          <select
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={team1}
            onChange={(e) => setTeam1(e.target.value)}
          >
            <option value="">Seleziona squadra</option>
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Squadra 2
          </label>
          <select
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={team2}
            onChange={(e) => setTeam2(e.target.value)}
          >
            <option value="">Seleziona squadra</option>
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>
      </div>

      {teamStats && (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={teamStats[0].name} fill="#3b82f6" />
              <Bar dataKey={teamStats[1].name} fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}