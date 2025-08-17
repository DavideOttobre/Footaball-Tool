import React from 'react';
import { Match } from '../../types/Match';
import { ScatterPlot } from './charts/ScatterPlot';
import { DistributionChart } from './charts/DistributionChart';
import { analyzeFirstHalfStrategy } from '../../utils/strategyAnalysis';

interface FirstHalfStrategyProps {
  matches: Match[];
  homeTeam: string;
  awayTeam: string;
}

export default function FirstHalfStrategy({ matches, homeTeam, awayTeam }: FirstHalfStrategyProps) {
  const analysis = analyzeFirstHalfStrategy(matches, homeTeam, awayTeam);
  
  return (
    <div className="space-y-8">
      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{homeTeam} (Casa)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Media Gol Segnati</p>
              <p className="text-2xl font-bold text-blue-600">
                {analysis.home.currentSeason.avgGoalsScored.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">Stagione Corrente</p>
              <p className="text-sm text-gray-400 mt-1">
                Storico: {analysis.home.historical.avgGoalsScored.toFixed(2)}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Media Gol Subiti</p>
              <p className="text-2xl font-bold text-red-600">
                {analysis.home.currentSeason.avgGoalsConceded.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">Stagione Corrente</p>
              <p className="text-sm text-gray-400 mt-1">
                Storico: {analysis.home.historical.avgGoalsConceded.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">{awayTeam} (Trasferta)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Media Gol Segnati</p>
              <p className="text-2xl font-bold text-blue-600">
                {analysis.away.currentSeason.avgGoalsScored.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">Stagione Corrente</p>
              <p className="text-sm text-gray-400 mt-1">
                Storico: {analysis.away.historical.avgGoalsScored.toFixed(2)}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Media Gol Subiti</p>
              <p className="text-2xl font-bold text-red-600">
                {analysis.away.currentSeason.avgGoalsConceded.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">Stagione Corrente</p>
              <p className="text-sm text-gray-400 mt-1">
                Storico: {analysis.away.historical.avgGoalsConceded.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analysis */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Distribuzione Gol Primo Tempo</h3>
          <div className="h-80">
            <ScatterPlot 
              currentData={analysis.home.currentSeason.goalDistribution}
              historicalData={analysis.home.historical.goalDistribution}
              team={homeTeam}
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-4">Risultati Più Frequenti</h3>
          <div className="h-80">
            <DistributionChart 
              currentData={analysis.resultDistribution.current}
              historicalData={analysis.resultDistribution.historical}
            />
          </div>
        </div>
      </div>

      {/* Probability Indicators */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Esiti Primo Tempo</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Vittoria Casa</span>
              <span className="font-medium">{analysis.probability.homeWin.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pareggio</span>
              <span className="font-medium">{analysis.probability.draw.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Vittoria Trasferta</span>
              <span className="font-medium">{analysis.probability.awayWin.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Primo Gol</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{homeTeam}</span>
              <span className="font-medium">{analysis.probability.firstGoalHome.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{awayTeam}</span>
              <span className="font-medium">{analysis.probability.firstGoalAway.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">No Gol</span>
              <span className="font-medium">{analysis.probability.noGoal.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Timing Primo Gol</h4>
          <div className="space-y-2">
            {analysis.probability.goalTiming.map((timing, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{timing.period}</span>
                <span className="font-medium">{timing.probability.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}