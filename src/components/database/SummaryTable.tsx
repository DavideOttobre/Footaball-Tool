import React from 'react';
import type { Match } from '../../types/Match';

interface SummaryTableProps {
  matches: Match[];
}

export default function SummaryTable({ matches }: SummaryTableProps) {
  const stats = React.useMemo(() => {
    const total = matches.length;
    if (total === 0) return null;

    const over05FH = matches.filter(m => 
      m.gol_primo_tempo_casa + m.gol_primo_tempo_trasferta > 0
    ).length;

    const over15FH = matches.filter(m => 
      m.gol_primo_tempo_casa + m.gol_primo_tempo_trasferta > 1
    ).length;

    const over15STWith00 = matches.filter(m => 
      m.gol_primo_tempo_casa === 0 && 
      m.gol_primo_tempo_trasferta === 0 &&
      (m.gol_casa - m.gol_primo_tempo_casa) + (m.gol_trasferta - m.gol_primo_tempo_trasferta) > 1
    ).length;

    const over15STWith10 = matches.filter(m => 
      m.gol_primo_tempo_casa === 1 && 
      m.gol_primo_tempo_trasferta === 0 &&
      (m.gol_casa - m.gol_primo_tempo_casa) + (m.gol_trasferta - m.gol_primo_tempo_trasferta) > 1
    ).length;

    const over15STWith01 = matches.filter(m => 
      m.gol_primo_tempo_casa === 0 && 
      m.gol_primo_tempo_trasferta === 1 &&
      (m.gol_casa - m.gol_primo_tempo_casa) + (m.gol_trasferta - m.gol_primo_tempo_trasferta) > 1
    ).length;

    const over25 = matches.filter(m => 
      m.gol_casa + m.gol_trasferta > 2
    ).length;

    const homeScoresFirst = matches.filter(m => {
      const firstGoal = m.gol.sort((a, b) => parseInt(a.minuto) - parseInt(b.minuto))[0];
      return firstGoal && firstGoal.squadra === m.squadra_casa;
    }).length;

    const homeScoresFirstAndWins = matches.filter(m => {
      const firstGoal = m.gol.sort((a, b) => parseInt(a.minuto) - parseInt(b.minuto))[0];
      return firstGoal && 
             firstGoal.squadra === m.squadra_casa && 
             m.gol_casa > m.gol_trasferta;
    }).length;

    const awayScoresFirst = matches.filter(m => {
      const firstGoal = m.gol.sort((a, b) => parseInt(a.minuto) - parseInt(b.minuto))[0];
      return firstGoal && firstGoal.squadra === m.squadra_trasferta;
    }).length;

    const awayScoresFirstAndWins = matches.filter(m => {
      const firstGoal = m.gol.sort((a, b) => parseInt(a.minuto) - parseInt(b.minuto))[0];
      return firstGoal && 
             firstGoal.squadra === m.squadra_trasferta && 
             m.gol_trasferta > m.gol_casa;
    }).length;

    const btts = matches.filter(m => 
      m.gol_casa > 0 && m.gol_trasferta > 0
    ).length;

    return {
      total,
      over05FH: (over05FH / total) * 100,
      over15FH: (over15FH / total) * 100,
      over15STWith00: (over15STWith00 / matches.filter(m => 
        m.gol_primo_tempo_casa === 0 && m.gol_primo_tempo_trasferta === 0
      ).length || 0) * 100,
      over15STWith10: (over15STWith10 / matches.filter(m => 
        m.gol_primo_tempo_casa === 1 && m.gol_primo_tempo_trasferta === 0
      ).length || 0) * 100,
      over15STWith01: (over15STWith01 / matches.filter(m => 
        m.gol_primo_tempo_casa === 0 && m.gol_primo_tempo_trasferta === 1
      ).length || 0) * 100,
      over25: (over25 / total) * 100,
      homeScoresFirst: (homeScoresFirst / total) * 100,
      homeScoresFirstAndWins: (homeScoresFirstAndWins / homeScoresFirst || 0) * 100,
      awayScoresFirst: (awayScoresFirst / total) * 100,
      awayScoresFirstAndWins: (awayScoresFirstAndWins / awayScoresFirst || 0) * 100,
      btts: (btts / total) * 100,
    };
  }, [matches]);

  if (!stats) return null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Evento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Percentuale
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dettagli
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <StatRow 
            label="Over 0.5 Primo Tempo" 
            value={stats.over05FH} 
            details={`${Math.round(stats.over05FH * stats.total / 100)}/${stats.total} partite`}
          />
          <StatRow 
            label="Over 1.5 Primo Tempo" 
            value={stats.over15FH}
            details={`${Math.round(stats.over15FH * stats.total / 100)}/${stats.total} partite`}
          />
          <StatRow 
            label="Over 1.5 2°T (0-0)" 
            value={stats.over15STWith00}
            details="Con 0-0 al primo tempo"
          />
          <StatRow 
            label="Over 1.5 2°T (1-0)" 
            value={stats.over15STWith10}
            details="Con 1-0 al primo tempo"
          />
          <StatRow 
            label="Over 1.5 2°T (0-1)" 
            value={stats.over15STWith01}
            details="Con 0-1 al primo tempo"
          />
          <StatRow 
            label="Over 2.5" 
            value={stats.over25}
            details={`${Math.round(stats.over25 * stats.total / 100)}/${stats.total} partite`}
          />
          <StatRow 
            label="Casa segna per primo" 
            value={stats.homeScoresFirst}
            details={`${Math.round(stats.homeScoresFirst * stats.total / 100)}/${stats.total} partite`}
          />
          <StatRow 
            label="Casa segna primo e vince" 
            value={stats.homeScoresFirstAndWins}
            details="% delle partite in cui segna per primo"
          />
          <StatRow 
            label="Trasferta segna per primo" 
            value={stats.awayScoresFirst}
            details={`${Math.round(stats.awayScoresFirst * stats.total / 100)}/${stats.total} partite`}
          />
          <StatRow 
            label="Trasferta segna primo e vince" 
            value={stats.awayScoresFirstAndWins}
            details="% delle partite in cui segna per primo"
          />
          <StatRow 
            label="BTTS" 
            value={stats.btts}
            details={`${Math.round(stats.btts * stats.total / 100)}/${stats.total} partite`}
          />
        </tbody>
      </table>
    </div>
  );
}

interface StatRowProps {
  label: string;
  value: number;
  details: string;
}

function StatRow({ label, value, details }: StatRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {label}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {value.toFixed(1)}%
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {details}
      </td>
    </tr>
  );
}