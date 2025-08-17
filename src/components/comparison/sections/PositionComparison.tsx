import React from 'react';
import { ArrowTrendingUp, ArrowTrendingDown } from 'lucide-react';

export default function PositionComparison({ homeTeam, awayTeam, homeStats, awayStats }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Posizioni in Classifica</h3>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="text-center">
          <h4 className="text-sm font-medium text-gray-600 mb-4">Classifica Generale</h4>
          <div className="flex justify-center items-center space-x-8">
            <div>
              <p className="text-2xl font-bold">{homeStats.overall.position}°</p>
              <p className="text-sm text-gray-600">{homeTeam}</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{awayStats.overall.position}°</p>
              <p className="text-sm text-gray-600">{awayTeam}</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h4 className="text-sm font-medium text-gray-600 mb-4">Primo Tempo</h4>
          <div className="flex justify-center items-center space-x-8">
            <div>
              <p className="text-2xl font-bold">{homeStats.firstHalf.position}°</p>
              <p className="text-sm text-gray-600">{homeTeam}</p>
              {homeStats.firstHalf.position < homeStats.overall.position && (
                <ArrowTrendingUp className="w-4 h-4 text-green-500 inline" />
              )}
              {homeStats.firstHalf.position > homeStats.overall.position && (
                <ArrowTrendingDown className="w-4 h-4 text-red-500 inline" />
              )}
            </div>
            <div>
              <p className="text-2xl font-bold">{awayStats.firstHalf.position}°</p>
              <p className="text-sm text-gray-600">{awayTeam}</p>
              {awayStats.firstHalf.position < awayStats.overall.position && (
                <ArrowTrendingUp className="w-4 h-4 text-green-500 inline" />
              )}
              {awayStats.firstHalf.position > awayStats.overall.position && (
                <ArrowTrendingDown className="w-4 h-4 text-red-500 inline" />
              )}
            </div>
          </div>
        </div>

        <div className="text-center">
          <h4 className="text-sm font-medium text-gray-600 mb-4">Secondo Tempo</h4>
          <div className="flex justify-center items-center space-x-8">
            <div>
              <p className="text-2xl font-bold">{homeStats.secondHalf.position}°</p>
              <p className="text-sm text-gray-600">{homeTeam}</p>
              {homeStats.secondHalf.position < homeStats.overall.position && (
                <ArrowTrendingUp className="w-4 h-4 text-green-500 inline" />
              )}
              {homeStats.secondHalf.position > homeStats.overall.position && (
                <ArrowTrendingDown className="w-4 h-4 text-red-500 inline" />
              )}
            </div>
            <div>
              <p className="text-2xl font-bold">{awayStats.secondHalf.position}°</p>
              <p className="text-sm text-gray-600">{awayTeam}</p>
              {awayStats.secondHalf.position < awayStats.overall.position && (
                <ArrowTrendingUp className="w-4 h-4 text-green-500 inline" />
              )}
              {awayStats.secondHalf.position > awayStats.overall.position && (
                <ArrowTrendingDown className="w-4 h-4 text-red-500 inline" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}