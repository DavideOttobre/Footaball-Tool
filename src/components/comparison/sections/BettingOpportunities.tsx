import React from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';

export default function BettingOpportunities({ patterns, homeTeam, awayTeam }) {
  const significantPatterns = patterns.filter(p => p.significance >= 75);
  const moderatePatterns = patterns.filter(p => p.significance >= 50 && p.significance < 75);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Opportunità di Betting</h3>

      {/* Pattern Significativi */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <h4 className="text-sm font-medium text-gray-600">Pattern Altamente Significativi</h4>
        </div>
        <div className="space-y-4">
          {significantPatterns.map((pattern, index) => (
            <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-green-800">{pattern.description}</p>
                <span className="px-2 py-1 text-sm font-medium bg-green-100 text-green-800 rounded">
                  {pattern.confidence}% confidenza
                </span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                {pattern.context.map((ctx, i) => (
                  <p key={i}>{ctx}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern Moderati */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <h4 className="text-sm font-medium text-gray-600">Pattern da Monitorare</h4>
        </div>
        <div className="space-y-4">
          {moderatePatterns.map((pattern, index) => (
            <div key={index} className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-yellow-800">{pattern.description}</p>
                <span className="px-2 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded">
                  {pattern.confidence}% confidenza
                </span>
              </div>
              <div className="text-sm text-yellow-700 space-y-1">
                {pattern.context.map((ctx, i) => (
                  <p key={i}>{ctx}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}