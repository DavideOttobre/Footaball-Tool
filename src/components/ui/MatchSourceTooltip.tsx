import React from 'react';
import type { Match } from '../../types/Match';

interface MatchSourceTooltipProps {
  matches: Match[];
  label: string;
  position?: { x: number; y: number };
}

export function MatchSourceTooltip({ matches, label, position }: MatchSourceTooltipProps) {
  if (!matches.length) return null;

  const tooltipStyle = position ? {
    position: 'fixed',
    left: position.x,
    top: position.y,
    transform: 'translate(-50%, 20px)',
    zIndex: 1000,
  } : {};

  return (
    <div 
      className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-[300px] max-h-[400px] overflow-y-auto"
      style={tooltipStyle}
    >
      <h4 className="text-sm font-medium mb-3">{label}</h4>
      <div className="space-y-3">
        {matches.map((match, index) => (
          <div key={index} className="text-sm border-b pb-2 last:border-b-0">
            <div className="flex justify-between text-gray-600 mb-1">
              <span>{match.data}</span>
              <span>{match.campionato}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-right">
                <p className="font-medium">{match.squadra_casa}</p>
                <p className="text-xs text-gray-500">
                  ({match.gol_primo_tempo_casa} - {match.gol_casa - match.gol_primo_tempo_casa})
                </p>
              </div>
              <div className="text-center">
                <p className="font-bold">{match.gol_casa} - {match.gol_trasferta}</p>
                <p className="text-xs text-gray-500">Finale</p>
              </div>
              <div className="text-left">
                <p className="font-medium">{match.squadra_trasferta}</p>
                <p className="text-xs text-gray-500">
                  ({match.gol_primo_tempo_trasferta} - {match.gol_trasferta - match.gol_primo_tempo_trasferta})
                </p>
              </div>
            </div>
            {/* Timeline dei gol */}
            {match.gol.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                <p className="font-medium mb-1">Timeline gol:</p>
                {match.gol.map((goal, idx) => (
                  <span key={idx} className="inline-block mr-2">
                    {goal.squadra === match.squadra_casa ? '🔵' : '🔴'} {goal.minuto}'
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}