import React from 'react';
import type { Match } from '../../../types/Match';

interface HeadToHeadDetailedStatsProps {
  matches: Match[];
  homeTeam: string;
  awayTeam: string;
}

export default function HeadToHeadDetailedStats({ matches, homeTeam, awayTeam }: HeadToHeadDetailedStatsProps) {
  const stats = React.useMemo(() => {
    const total = matches.length;
    if (total === 0) {
      return {
        over05HT: { count: 0, percentage: 0 },
        over25FT: { count: 0, percentage: 0 },
        btts: { count: 0, percentage: 0 },
        firstGoalHome: { count: 0, ratio: '0/0' },
        firstGoalAway: { count: 0, ratio: '0/0' }
      };
    }

    const over05HT = matches.filter(m => 
      m.gol_primo_tempo_casa + m.gol_primo_tempo_trasferta > 0
    ).length;

    const over25FT = matches.filter(m => 
      m.gol_casa + m.gol_trasferta > 2
    ).length;

    const btts = matches.filter(m => 
      m.gol_casa > 0 && m.gol_trasferta > 0
    ).length;

    const firstGoalHome = matches.filter(m => {
      const firstGoal = m.gol.sort((a, b) => 
        parseInt(a.minuto) - parseInt(b.minuto)
      )[0];
      return firstGoal && firstGoal.squadra === homeTeam;
    }).length;

    const firstGoalAway = matches.filter(m => {
      const firstGoal = m.gol.sort((a, b) => 
        parseInt(a.minuto) - parseInt(b.minuto)
      )[0];
      return firstGoal && firstGoal.squadra === awayTeam;
    }).length;

    return {
      over05HT: {
        count: over05HT,
        percentage: (over05HT / total) * 100
      },
      over25FT: {
        count: over25FT,
        percentage: (over25FT / total) * 100
      },
      btts: {
        count: btts,
        percentage: (btts / total) * 100
      },
      firstGoalHome: {
        count: firstGoalHome,
        ratio: `${firstGoalHome}/${total}`
      },
      firstGoalAway: {
        count: firstGoalAway,
        ratio: `${firstGoalAway}/${total}`
      }
    };
  }, [matches, homeTeam, awayTeam]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Over 0.5 1°T</h4>
        <p className="text-2xl font-bold text-blue-600">
          {stats.over05HT.percentage.toFixed(1)}%
        </p>
        <p className="text-sm text-gray-500">
          {stats.over05HT.count} su {matches.length} partite
        </p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Over 2.5</h4>
        <p className="text-2xl font-bold text-green-600">
          {stats.over25FT.percentage.toFixed(1)}%
        </p>
        <p className="text-sm text-gray-500">
          {stats.over25FT.count} su {matches.length} partite
        </p>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">BTTS</h4>
        <p className="text-2xl font-bold text-yellow-600">
          {stats.btts.percentage.toFixed(1)}%
        </p>
        <p className="text-sm text-gray-500">
          {stats.btts.count} su {matches.length} partite
        </p>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Primo Gol {homeTeam}</h4>
        <p className="text-2xl font-bold text-purple-600">
          {stats.firstGoalHome.ratio}
        </p>
        <p className="text-sm text-gray-500">
          {((stats.firstGoalHome.count / matches.length) * 100).toFixed(1)}% delle partite
        </p>
      </div>

      <div className="bg-red-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Primo Gol {awayTeam}</h4>
        <p className="text-2xl font-bold text-red-600">
          {stats.firstGoalAway.ratio}
        </p>
        <p className="text-sm text-gray-500">
          {((stats.firstGoalAway.count / matches.length) * 100).toFixed(1)}% delle partite
        </p>
      </div>
    </div>
  );
}