import React from 'react';
import { formatNumber, formatDecimal } from '../../utils/formatting';
import type { Standing } from '../../types/Standings';

interface StandingsRowProps {
  standing: Standing;
  index: number;
  type: 'general' | 'attack' | 'defense' | 'form';
  isHighlighted?: boolean;
  onMouseEnter?: (teamName: string, event: React.MouseEvent) => void;
  onMouseLeave?: () => void;
}

export default function StandingsRow({
  standing,
  index,
  type,
  isHighlighted = false,
  onMouseEnter,
  onMouseLeave
}: StandingsRowProps) {
  return (
    <tr className={`
      border-t
      ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
      ${isHighlighted ? 'bg-blue-50' : ''}
      hover:bg-gray-100 transition-colors duration-200
    `}>
      <td className="px-4 py-2">{index + 1}</td>
      <td 
        className={`
          px-4 py-2 font-medium cursor-pointer
          ${isHighlighted ? 'text-blue-600' : 'hover:text-blue-600'}
        `}
        onMouseEnter={(e) => onMouseEnter?.(standing.name, e)}
        onMouseLeave={onMouseLeave}
      >
        {standing.name}
      </td>

      {type === 'general' && (
        <>
          <td className="px-4 py-2 text-center">{formatNumber(standing.played)}</td>
          <td className="px-4 py-2 text-center">{formatNumber(standing.wins)}</td>
          <td className="px-4 py-2 text-center">{formatNumber(standing.draws)}</td>
          <td className="px-4 py-2 text-center">{formatNumber(standing.losses)}</td>
          <td className="px-4 py-2 text-center">{formatNumber(standing.goalsFor)}</td>
          <td className="px-4 py-2 text-center">{formatNumber(standing.goalsAgainst)}</td>
          <td className="px-4 py-2 text-center">{formatNumber(standing.goalDifference)}</td>
          <td className="px-4 py-2 text-center font-bold">{formatNumber(standing.points)}</td>
        </>
      )}

      {type === 'attack' && (
        <>
          <td className="px-4 py-2 text-center">{formatNumber(standing.goalsFor)}</td>
          <td className="px-4 py-2 text-center">{formatDecimal(standing.goalsForAverage)}</td>
        </>
      )}

      {type === 'defense' && (
        <>
          <td className="px-4 py-2 text-center">{formatNumber(standing.goalsAgainst)}</td>
          <td className="px-4 py-2 text-center">{formatDecimal(standing.goalsAgainstAverage)}</td>
        </>
      )}

      {type === 'form' && (
        <>
          <td className="px-4 py-2 text-center">{formatNumber(standing.points)}</td>
          <td className="px-4 py-2">
            <div className="flex gap-1">
              {standing.form.map((result, i) => (
                <span
                  key={i}
                  className={`
                    w-6 h-6 flex items-center justify-center rounded-full 
                    text-xs font-bold text-white
                    ${result === 'V' ? 'bg-green-500' : 
                      result === 'N' ? 'bg-yellow-500' : 'bg-red-500'}
                  `}
                >
                  {result}
                </span>
              ))}
            </div>
          </td>
        </>
      )}
    </tr>
  );
}