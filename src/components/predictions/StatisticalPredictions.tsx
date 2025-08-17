import React from 'react';
import { useMatchStore } from '../../store/matchStore';
import { calculatePredictions } from '../../utils/predictionAnalysis';

interface StatisticalPredictionsProps {
  homeTeam: string;
  awayTeam: string;
}

export default function StatisticalPredictions({ homeTeam, awayTeam }: StatisticalPredictionsProps) {
  const { matches } = useMatchStore();
  const predictions = calculatePredictions(matches, homeTeam, awayTeam);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-6">Predizioni Statistiche</h3>
      
      <div className="space-y-6">
        {/* Predizioni Risultato */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Probabilità Risultato</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">1</p>
              <p className="text-xl font-bold text-blue-600">
                {predictions.outcomes.homeWin.toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">X</p>
              <p className="text-xl font-bold text-gray-600">
                {predictions.outcomes.draw.toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">2</p>
              <p className="text-xl font-bold text-red-600">
                {predictions.outcomes.awayWin.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Predizioni Over/Under */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Probabilità Over/Under</h4>
          <div className="space-y-3">
            {predictions.overUnder.map((pred, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">{pred.type}</span>
                <span className="text-sm font-bold text-blue-600">{pred.probability.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Indicatori Chiave */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Indicatori Chiave</h4>
          <div className="space-y-3">
            {predictions.keyIndicators.map((indicator, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{indicator.name}</span>
                  <span className={`text-sm font-bold ${
                    indicator.strength >= 7 ? 'text-green-600' :
                    indicator.strength >= 4 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {indicator.strength}/10
                  </span>
                </div>
                <p className="text-xs text-gray-500">{indicator.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}