import React from 'react';
import { useMatchStore } from '../../store/matchStore';
import { analyzeTrends } from '../../utils/predictionAnalysis';

interface TrendAnalysisProps {
  homeTeam: string;
  awayTeam: string;
}

export default function TrendAnalysis({ homeTeam, awayTeam }: TrendAnalysisProps) {
  const { matches } = useMatchStore();
  const trends = analyzeTrends(matches, homeTeam, awayTeam);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-6">Tendenze Principali</h3>
      
      <div className="space-y-6">
        {/* Tendenze Gol */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Tendenze Gol</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Over 0.5 1°T</p>
              <p className="text-xl font-bold text-blue-600">
                {trends.firstHalfGoals.over05Percentage.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500">Probabilità</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Over 1.5 2°T</p>
              <p className="text-xl font-bold text-green-600">
                {trends.secondHalfGoals.over15Percentage.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500">Probabilità</p>
            </div>
          </div>
        </div>

        {/* Momenti Chiave */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Momenti Chiave</h4>
          <div className="space-y-3">
            {trends.keyMoments.map((moment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">{moment.description}</span>
                <span className="text-sm font-bold text-blue-600">{moment.probability.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pattern Ricorrenti */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Pattern Ricorrenti</h4>
          <div className="space-y-3">
            {trends.patterns.map((pattern, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{pattern.description}</span>
                  <span className="text-sm font-bold text-green-600">{pattern.frequency.toFixed(1)}%</span>
                </div>
                <p className="text-xs text-gray-500">{pattern.context}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}