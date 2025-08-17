import React from 'react';
import type { Match } from '../../../types/Match';

interface HeadToHeadStatsProps {
  matches: Match[];
  homeTeam: string;
  awayTeam: string;
}

export default function HeadToHeadStats({ matches, homeTeam, awayTeam }: HeadToHeadStatsProps) {
  const stats = React.useMemo(() => {
    const total = matches.length;
    const homeWins = matches.filter(m => 
      m.squadra_casa === homeTeam && m.gol_casa > m.gol_trasferta
    ).length;
    const awayWins = matches.filter(m => 
      m.squadra_trasferta === awayTeam && m.gol_trasferta > m.gol_casa
    ).length;
    const draws = matches.filter(m =>
      m.squadra_casa === homeTeam && 
      m.squadra_trasferta === awayTeam && 
      m.gol_casa === m.gol_trasferta
    ).length;

    const homeGoals = matches.reduce((sum, m) => 
      sum + (m.squadra_casa === homeTeam ? m.gol_casa : 0), 0
    );
    const awayGoals = matches.reduce((sum, m) => 
      sum + (m.squadra_trasferta === awayTeam ? m.gol_trasferta : 0), 0
    );

    return {
      total,
      homeWins,
      awayWins,
      draws,
      homeGoals,
      awayGoals,
      homeCleanSheets: matches.filter(m => 
        m.squadra_casa === homeTeam && m.gol_trasferta === 0
      ).length,
      awayCleanSheets: matches.filter(m => 
        m.squadra_trasferta === awayTeam && m.gol_casa === 0
      ).length,
    };
  }, [matches, homeTeam, awayTeam]);

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-gray-900">{homeTeam} (Casa)</h3>
        <p className="text-2xl font-bold text-blue-600">{stats.homeWins}</p>
        <p className="text-sm text-gray-500">vittorie</p>
        <p className="text-sm text-gray-600 mt-2">
          Clean sheet: {stats.homeCleanSheets}
        </p>
      </div>
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900">Pareggi</h3>
        <p className="text-2xl font-bold text-gray-600">{stats.draws}</p>
        <p className="text-sm text-gray-500">partite</p>
        <p className="text-sm text-gray-600 mt-2">
          Media gol: {stats.total > 0 ? ((stats.homeGoals + stats.awayGoals) / stats.total).toFixed(2) : '0.00'}
        </p>
      </div>
      <div className="text-center p-4 bg-red-50 rounded-lg">
        <h3 className="font-medium text-gray-900">{awayTeam} (Trasferta)</h3>
        <p className="text-2xl font-bold text-red-600">{stats.awayWins}</p>
        <p className="text-sm text-gray-500">vittorie</p>
        <p className="text-sm text-gray-600 mt-2">
          Clean sheet: {stats.awayCleanSheets}
        </p>
      </div>
    </div>
  );
}