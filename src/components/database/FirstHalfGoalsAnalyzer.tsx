import React from 'react';
import type { Match } from '../../types/Match';
import { analyzeFirstHalfGoalsPatterns } from '../../utils/analysis/firstHalfGoalsAnalyzer';
import { TrendingUp, Info } from 'lucide-react';

interface FirstHalfGoalsAnalyzerProps {
  matches: Match[];
  homeTeam: string;
  awayTeam: string;
}

export default function FirstHalfGoalsAnalyzer({ matches, homeTeam, awayTeam }: FirstHalfGoalsAnalyzerProps) {
  const patterns = React.useMemo(() => 
    analyzeFirstHalfGoalsPatterns(matches, homeTeam, awayTeam),
    [matches, homeTeam, awayTeam]
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-medium">Pattern Gol Primo Tempo: {homeTeam} vs {awayTeam}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patterns.map((pattern, index) => (
          <div 
            key={index}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium">{pattern.factor}</h4>
                <p className="text-sm text-gray-500">
                  {pattern.matches} su {pattern.totalMatches} partite
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  {pattern.correlation.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">correlazione</p>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${pattern.correlation}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 min-w-[4rem]">
                  {pattern.correlation.toFixed(1)}%
                </span>
              </div>
            </div>

            {pattern.correlation >= 70 && (
              <div className="mt-3 flex items-start gap-2 p-2 bg-green-50 rounded-lg text-green-700">
                <Info className="w-4 h-4 mt-0.5" />
                <p className="text-sm">
                  Pattern altamente significativo: questo fattore è fortemente correlato con i gol nel primo tempo
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}