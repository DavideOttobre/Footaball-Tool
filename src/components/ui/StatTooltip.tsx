import React from 'react';
import { MatchSourceTooltip } from './MatchSourceTooltip';
import type { Match } from '../../types/Match';

interface StatTooltipProps {
  label: string;
  value: string | number;
  matches: Match[];
  position: { x: number; y: number } | null;
}

export function StatTooltip({ label, value, matches, position }: StatTooltipProps) {
  if (!position) return null;

  return (
    <div 
      className="fixed z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, 20px)'
      }}
    >
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 mb-2">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
      <MatchSourceTooltip 
        matches={matches}
        label="Partite di riferimento"
      />
    </div>
  );
}