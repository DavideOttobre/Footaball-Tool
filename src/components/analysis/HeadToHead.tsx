import React, { useState } from 'react';
import { useMatchStore } from '../../store/matchStore';
import HeadToHeadFilters from './filters/HeadToHeadFilters';
import HeadToHeadStats from './sections/HeadToHeadStats';
import HeadToHeadMatches from './sections/HeadToHeadMatches';
import HeadToHeadCharts from './sections/HeadToHeadCharts';
import HeadToHeadDetailedStats from './sections/HeadToHeadDetailedStats';
import { filterHeadToHeadMatches } from '../../utils/filters/headToHeadFilters';

interface HeadToHeadProps {
  homeTeam: string;
  awayTeam: string;
}

export default function HeadToHead({ homeTeam, awayTeam }: HeadToHeadProps) {
  const { matches } = useMatchStore();
  const [showDirectMatchesOnly, setShowDirectMatchesOnly] = useState(true);

  const filteredMatches = filterHeadToHeadMatches(
    matches,
    homeTeam,
    awayTeam,
    showDirectMatchesOnly
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-semibold mb-6">Analisi Storica: {homeTeam} vs {awayTeam}</h2>
      
      <HeadToHeadFilters 
        showDirectMatchesOnly={showDirectMatchesOnly}
        onDirectMatchesChange={setShowDirectMatchesOnly}
      />

      {/* Statistiche principali */}
      <HeadToHeadStats 
        matches={filteredMatches}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
      />

      {/* Grafici di analisi */}
      <HeadToHeadCharts 
        matches={filteredMatches}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
      />

      {/* Statistiche dettagliate */}
      <HeadToHeadDetailedStats
        matches={filteredMatches}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
      />

      {/* Lista partite */}
      <HeadToHeadMatches 
        matches={filteredMatches}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
      />
    </div>
  );
}