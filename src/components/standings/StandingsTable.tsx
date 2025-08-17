import React, { useState, useRef } from 'react';
import { useMatchStore } from '../../store/matchStore';
import type { Standing } from '../../types/Standings';
import GoalDistributionChart from './GoalDistributionChart';
import { calculateChartPosition } from '../../utils/chartPositioning';
import StandingsRow from './StandingsRow';

interface StandingsTableProps {
  standings: Standing[];
  type: 'general' | 'attack' | 'defense' | 'form';
  title: string;
  highlightedTeams?: string[];
}

export default function StandingsTable({ 
  standings, 
  type, 
  title,
  highlightedTeams = []
}: StandingsTableProps) {
  const { matches } = useMatchStore();
  const [hoveredTeam, setHoveredTeam] = useState<string | null>(null);
  const [chartPosition, setChartPosition] = useState({ x: 0, y: 0 });
  const tableRef = useRef<HTMLDivElement>(null);

  const currentSeason = matches[0]?.stagione;
  const seasonMatches = matches.filter(m => m.stagione === currentSeason);

  const getFilteredMatches = (teamName: string) => {
    return seasonMatches.filter(m => 
      m.squadra_casa === teamName || m.squadra_trasferta === teamName
    );
  };

  const handleMouseEnter = (teamName: string, event: React.MouseEvent) => {
    const position = calculateChartPosition(event, tableRef.current);
    setChartPosition(position);
    setHoveredTeam(teamName);
  };

  const handleMouseLeave = () => {
    setHoveredTeam(null);
  };

  return (
    <div className="relative" ref={tableRef}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                <th className="px-4 py-2 text-left">Pos</th>
                <th className="px-4 py-2 text-left">Squadra</th>
                {type === 'general' && (
                  <>
                    <th className="px-4 py-2 text-center">PG</th>
                    <th className="px-4 py-2 text-center">V</th>
                    <th className="px-4 py-2 text-center">N</th>
                    <th className="px-4 py-2 text-center">P</th>
                    <th className="px-4 py-2 text-center">GF</th>
                    <th className="px-4 py-2 text-center">GS</th>
                    <th className="px-4 py-2 text-center">DR</th>
                    <th className="px-4 py-2 text-center">Pts</th>
                  </>
                )}
                {type === 'attack' && (
                  <>
                    <th className="px-4 py-2 text-center">GF</th>
                    <th className="px-4 py-2 text-center">Media</th>
                  </>
                )}
                {type === 'defense' && (
                  <>
                    <th className="px-4 py-2 text-center">GS</th>
                    <th className="px-4 py-2 text-center">Media</th>
                  </>
                )}
                {type === 'form' && (
                  <>
                    <th className="px-4 py-2 text-center">Pts</th>
                    <th className="px-4 py-2 text-left">Forma</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {standings.map((standing, index) => (
                <StandingsRow
                  key={standing.name}
                  standing={standing}
                  index={index}
                  type={type}
                  isHighlighted={highlightedTeams.includes(standing.name)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {hoveredTeam && (
  <div
    className="fixed z-50 transform -translate-x-1/2 bg-white rounded-lg shadow-xl"
    style={{
      left: `${chartPosition.x}px`,
      top: `${chartPosition.y}px`,
    }}
  >
    <GoalDistributionChart
      matches={getFilteredMatches(hoveredTeam)}
      teamName={hoveredTeam}
      type={type} // Passa il tipo di classifica
    />
  </div>
)}
    </div>
  );
}