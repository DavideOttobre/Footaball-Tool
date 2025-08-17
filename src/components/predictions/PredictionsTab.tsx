import React from 'react';
import { useMatchStore } from '../../store/matchStore';
import { analyzePredictivePatterns } from '../../utils/predictionAnalysis';

interface PredictionsTabProps {
  homeTeam: string;
  awayTeam: string;
}

export default function PredictionsTab({ homeTeam, awayTeam }: PredictionsTabProps) {
  const { matches } = useMatchStore();
  const patterns = analyzePredictivePatterns(matches, homeTeam, awayTeam);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">Pattern e Tendenze Rilevanti</h2>
        
        {patterns.length > 0 ? (
          <div className="space-y-6">
            {patterns.map((pattern, index) => (
              <div 
                key={index}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-medium">{pattern.description}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-500">
                        Frequenza: {pattern.frequency.toFixed(1)}%
                      </span>
                      <span className="text-sm text-gray-500">
                        Confidenza: {pattern.confidence}%
                      </span>
                    </div>
                  </div>
                  <div className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    ${pattern.significance >= 75 ? 'bg-green-100 text-green-800' :
                      pattern.significance >= 50 ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'}
                  `}>
                    Significatività: {pattern.significance}%
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Contesto */}
                  <div className="bg-gray-50 p-3 rounded-md">
                    {pattern.context.map((ctx, i) => (
                      <p key={i} className="text-sm text-gray-600">{ctx}</p>
                    ))}
                  </div>

                  {/* Dati di supporto */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      Campione: {pattern.supportingData.matches} partite
                    </span>
                    <span>
                      Occorrenze: {pattern.supportingData.occurrences}
                    </span>
                    <span className={`
                      ${pattern.supportingData.recentTrend === 'increasing' ? 'text-green-600' :
                        pattern.supportingData.recentTrend === 'decreasing' ? 'text-red-600' :
                        'text-blue-600'}
                    `}>
                      Trend: {pattern.supportingData.recentTrend === 'increasing' ? '↑' :
                             pattern.supportingData.recentTrend === 'decreasing' ? '↓' : '→'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nessun pattern significativo rilevato con i dati disponibili
          </div>
        )}
      </div>
    </div>
  );
}