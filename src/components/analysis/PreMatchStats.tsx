import React from 'react';
import type { TeamPreMatchStats } from '../../types/Match';

interface PreMatchStatsProps {
  stats: TeamPreMatchStats;
  teamName: string;
}

export default function PreMatchStats({ stats, teamName }: PreMatchStatsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Statistiche Pre-Match: {teamName}</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          label="BTTS" 
          value={`${(stats.btts * 100).toFixed(1)}%`}
        />
        <StatCard 
          label="Clean Sheet" 
          value={`${(stats.clean_sheet * 100).toFixed(1)}%`}
        />
        <StatCard 
          label="Over 1.5" 
          value={`${(stats.over_1_5 * 100).toFixed(1)}%`}
        />
        <StatCard 
          label="Over 2.5" 
          value={`${(stats.over_2_5 * 100).toFixed(1)}%`}
        />
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium mb-3">Gol Primo Tempo</h4>
        <div className="grid grid-cols-2 gap-4">
          <StatCard 
            label="Media Gol Segnati" 
            value={stats.media_segnare_gol_primo_tempo.toFixed(2)}
          />
          <StatCard 
            label="Media Gol Subiti" 
            value={stats.media_subire_gol_primo_tempo.toFixed(2)}
          />
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium mb-3">Probabilità</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            label="Segnare Primi" 
            value={`${(stats.prob_segnare_primi * 100).toFixed(1)}%`}
          />
          <StatCard 
            label="Subire Primi" 
            value={`${(stats.prob_subire_primi * 100).toFixed(1)}%`}
          />
          <StatCard 
            label="Segnare" 
            value={`${(stats.prob_segnare * 100).toFixed(1)}%`}
          />
          <StatCard 
            label="Subire" 
            value={`${(stats.prob_subire * 100).toFixed(1)}%`}
          />
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium mb-3">Risultati Primo Tempo Frequenti</h4>
        <div className="grid grid-cols-3 gap-4">
          {stats.risultati_primo_tempo_frequenti.map((result, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg">
              <p className="text-lg font-bold text-center">{result.risultato}</p>
              <p className="text-sm text-gray-600 text-center">
                {result.percentuale.toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}