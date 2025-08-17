import React from 'react';
import { useMatchStore } from '../../store/matchStore';
import type { Match } from '../../types/Match';
import { filterMatchesByOdds, getOddsRange, ODDS_RANGES } from '../../utils/odds/oddsRangeFilter';

interface OddsAnalysisProps {
  homeTeam: string;
  awayTeam: string;
  matches?: Match[];
}

export default function OddsAnalysis({ homeTeam, awayTeam, matches: propMatches }: OddsAnalysisProps) {
  const { matches: storeMatches, homeOdds, awayOdds, setHomeOdds, setAwayOdds } = useMatchStore();
  const matches = propMatches || storeMatches;

  const filteredHomeMatches = React.useMemo(() => {
    const currentHomeOdds = homeOdds[homeTeam];
    if (!currentHomeOdds) return [];
    return filterMatchesByOdds(matches, homeTeam, true, parseFloat(currentHomeOdds));
  }, [matches, homeTeam, homeOdds]);

  const filteredAwayMatches = React.useMemo(() => {
    const currentAwayOdds = awayOdds[awayTeam];
    if (!currentAwayOdds) return [];
    return filterMatchesByOdds(matches, awayTeam, false, parseFloat(currentAwayOdds));
  }, [matches, awayTeam, awayOdds]);

  const calculateStats = (matches: Match[]) => {
    if (matches.length === 0) return null;

    return {
      totalMatches: matches.length,
      over05HT: matches.filter(m => m.gol_primo_tempo_casa + m.gol_primo_tempo_trasferta > 0).length,
      over15HT: matches.filter(m => m.gol_primo_tempo_casa + m.gol_primo_tempo_trasferta > 1).length,
      over05FT: matches.filter(m => m.gol_casa + m.gol_trasferta > 0).length,
      over15FT: matches.filter(m => m.gol_casa + m.gol_trasferta > 1).length,
      btts: matches.filter(m => m.gol_casa > 0 && m.gol_trasferta > 0).length,
    };
  };

  const homeStats = calculateStats(filteredHomeMatches);
  const awayStats = calculateStats(filteredAwayMatches);

  const currentHomeRange = homeOdds[homeTeam] ? getOddsRange(parseFloat(homeOdds[homeTeam])) : null;
  const currentAwayRange = awayOdds[awayTeam] ? getOddsRange(parseFloat(awayOdds[awayTeam])) : null;

  return (
    <div className="space-y-8">
      {/* Input quote */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-4">Inserisci Quote</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quota 1 ({homeTeam})
            </label>
            <input
              type="number"
              step="0.01"
              value={homeOdds[homeTeam] || ''}
              onChange={(e) => setHomeOdds(homeTeam, e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {currentHomeRange && (
              <p className="mt-1 text-sm text-gray-500">
                Range: {currentHomeRange.label}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quota 2 ({awayTeam})
            </label>
            <input
              type="number"
              step="0.01"
              value={awayOdds[awayTeam] || ''}
              onChange={(e) => setAwayOdds(awayTeam, e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {currentAwayRange && (
              <p className="mt-1 text-sm text-gray-500">
                Range: {currentAwayRange.label}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Statistiche per range di quote */}
      {(homeStats || awayStats) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {homeStats && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">
                {homeTeam} (Casa) - {currentHomeRange?.label}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <StatsCard
                    label="Over 0.5 1°T"
                    value={((homeStats.over05HT / homeStats.totalMatches) * 100).toFixed(1)}
                    matches={homeStats.over05HT}
                    total={homeStats.totalMatches}
                  />
                  <StatsCard
                    label="Over 1.5 2°T"
                    value={((homeStats.over15FT / homeStats.totalMatches) * 100).toFixed(1)}
                    matches={homeStats.over15FT}
                    total={homeStats.totalMatches}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <StatsCard
                    label="BTTS"
                    value={((homeStats.btts / homeStats.totalMatches) * 100).toFixed(1)}
                    matches={homeStats.btts}
                    total={homeStats.totalMatches}
                  />
                  <StatsCard
                    label="Over 0.5 FT"
                    value={((homeStats.over05FT / homeStats.totalMatches) * 100).toFixed(1)}
                    matches={homeStats.over05FT}
                    total={homeStats.totalMatches}
                  />
                </div>
              </div>
            </div>
          )}

          {awayStats && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">
                {awayTeam} (Trasferta) - {currentAwayRange?.label}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <StatsCard
                    label="Over 0.5 1°T"
                    value={((awayStats.over05HT / awayStats.totalMatches) * 100).toFixed(1)}
                    matches={awayStats.over05HT}
                    total={awayStats.totalMatches}
                  />
                  <StatsCard
                    label="Over 1.5 2°T"
                    value={((awayStats.over15FT / awayStats.totalMatches) * 100).toFixed(1)}
                    matches={awayStats.over15FT}
                    total={awayStats.totalMatches}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <StatsCard
                    label="BTTS"
                    value={((awayStats.btts / awayStats.totalMatches) * 100).toFixed(1)}
                    matches={awayStats.btts}
                    total={awayStats.totalMatches}
                  />
                  <StatsCard
                    label="Over 0.5 FT"
                    value={((awayStats.over05FT / awayStats.totalMatches) * 100).toFixed(1)}
                    matches={awayStats.over05FT}
                    total={awayStats.totalMatches}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface StatsCardProps {
  label: string;
  value: string;
  matches: number;
  total: number;
}

function StatsCard({ label, value, matches, total }: StatsCardProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-xl font-bold">{value}%</p>
      <p className="text-xs text-gray-500">
        {matches} su {total} partite
      </p>
    </div>
  );
}
