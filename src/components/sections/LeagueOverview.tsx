import React from 'react';
import { useMatchStore } from '../../store/matchStore';

export default function LeagueOverview() {
  const { matches } = useMatchStore();
  const currentSeason = matches[0]?.stagione;
  const seasonMatches = matches.filter(m => m.stagione === currentSeason);

  const stats = React.useMemo(() => {
    const total = seasonMatches.length;
    if (total === 0) return null;

    const homeWins = seasonMatches.filter(m => m.gol_casa > m.gol_trasferta).length;
    const draws = seasonMatches.filter(m => m.gol_casa === m.gol_trasferta).length;
    const awayWins = seasonMatches.filter(m => m.gol_casa < m.gol_trasferta).length;
    
    const over25 = seasonMatches.filter(m => m.gol_casa + m.gol_trasferta > 2).length;
    const btts = seasonMatches.filter(m => m.gol_casa > 0 && m.gol_trasferta > 0).length;
    const over05HT = seasonMatches.filter(m => m.gol_primo_tempo_casa + m.gol_primo_tempo_trasferta > 0).length;
    const over15HT = seasonMatches.filter(m => m.gol_primo_tempo_casa + m.gol_primo_tempo_trasferta > 1).length;
    
    const totalGoals = seasonMatches.reduce((sum, m) => sum + m.gol_casa + m.gol_trasferta, 0);
    const totalFirstHalfGoals = seasonMatches.reduce((sum, m) => 
      sum + m.gol_primo_tempo_casa + m.gol_primo_tempo_trasferta, 0);
    const totalSecondHalfGoals = seasonMatches.reduce((sum, m) => 
      sum + (m.gol_casa - m.gol_primo_tempo_casa) + (m.gol_trasferta - m.gol_primo_tempo_trasferta), 0);

    return {
      total,
      homeWins: (homeWins / total) * 100,
      draws: (draws / total) * 100,
      awayWins: (awayWins / total) * 100,
      over25: (over25 / total) * 100,
      btts: (btts / total) * 100,
      over05HT: (over05HT / total) * 100,
      over15HT: (over15HT / total) * 100,
      avgGoals: totalGoals / total,
      avgFirstHalfGoals: totalFirstHalfGoals / total,
      avgSecondHalfGoals: totalSecondHalfGoals / total,
    };
  }, [seasonMatches]);

  if (!stats) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Statistiche {currentSeason}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Risultati */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Risultati</h3>
          <div className="grid grid-cols-3 gap-4">
            <StatCard 
              label="1" 
              value={stats.homeWins} 
              details={`${Math.round(stats.homeWins * stats.total / 100)}/${stats.total}`}
            />
            <StatCard 
              label="X" 
              value={stats.draws} 
              details={`${Math.round(stats.draws * stats.total / 100)}/${stats.total}`}
            />
            <StatCard 
              label="2" 
              value={stats.awayWins} 
              details={`${Math.round(stats.awayWins * stats.total / 100)}/${stats.total}`}
            />
          </div>
        </div>

        {/* Over/Under */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Over/Under</h3>
          <div className="grid grid-cols-2 gap-4">
            <StatCard 
              label="Over 2.5" 
              value={stats.over25} 
              details={`${Math.round(stats.over25 * stats.total / 100)}/${stats.total}`}
            />
            <StatCard 
              label="BTTS" 
              value={stats.btts} 
              details={`${Math.round(stats.btts * stats.total / 100)}/${stats.total}`}
            />
          </div>
        </div>

        {/* Media Gol */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Media Gol</h3>
          <div className="grid grid-cols-1 gap-4">
            <StatCard 
              label="Totale" 
              value={stats.avgGoals} 
              isAverage
              details={`1°T: ${stats.avgFirstHalfGoals.toFixed(2)} | 2°T: ${stats.avgSecondHalfGoals.toFixed(2)}`}
            />
          </div>
        </div>

        {/* Primo Tempo */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Primo Tempo</h3>
          <div className="grid grid-cols-2 gap-4">
            <StatCard 
              label="Over 0.5" 
              value={stats.over05HT} 
              details={`${Math.round(stats.over05HT * stats.total / 100)}/${stats.total}`}
            />
            <StatCard 
              label="Over 1.5" 
              value={stats.over15HT} 
              details={`${Math.round(stats.over15HT * stats.total / 100)}/${stats.total}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  details: string;
  isAverage?: boolean;
}

function StatCard({ label, value, details, isAverage = false }: StatCardProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-lg font-bold">
          {isAverage ? value.toFixed(2) : `${value.toFixed(1)}%`}
        </span>
      </div>
      <p className="text-xs text-gray-500">{details}</p>
    </div>
  );
}