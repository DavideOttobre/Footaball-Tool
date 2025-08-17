import React from 'react';
import type { CombinedStats } from '../../types/Match';

interface CombinedStatsProps {
  stats: CombinedStats;
}

export default function CombinedStats({ stats }: CombinedStatsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Statistiche Combinate</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          label="BTTS" 
          value={`${(stats.prob_comb_btts * 100).toFixed(1)}%`}
        />
        <StatCard 
          label="Over 1.5" 
          value={`${(stats.prob_comb_over_1_5 * 100).toFixed(1)}%`}
        />
        <StatCard 
          label="Over 2.5" 
          value={`${(stats.prob_comb_over_2_5 * 100).toFixed(1)}%`}
        />
        <StatCard 
          label="Under 2.5" 
          value={`${(stats.prob_comb_under_2_5 * 100).toFixed(1)}%`}
        />
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium mb-3">Probabilità Risultato</h4>
        <div className="grid grid-cols-3 gap-4">
          <StatCard 
            label="1" 
            value={`${(stats.prob_comb_vittoria_casa * 100).toFixed(1)}%`}
          />
          <StatCard 
            label="X" 
            value={`${(stats.prob_comb_pareggio * 100).toFixed(1)}%`}
          />
          <StatCard 
            label="2" 
            value={`${(stats.prob_comb_vittoria_trasferta * 100).toFixed(1)}%`}
          />
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium mb-3">Timing Gol</h4>
        <div className="grid grid-cols-2 gap-4">
          <StatCard 
            label="Primi 15'" 
            value={`${(stats.prob_comb_gol_primi_15 * 100).toFixed(1)}%`}
          />
          <StatCard 
            label="Ultimi 15'" 
            value={`${(stats.prob_comb_gol_ultimi_15 * 100).toFixed(1)}%`}
          />
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium mb-3">Timing Specifici</h4>
        <div className="grid grid-cols-2 gap-4">
          <StatCard 
            label="Gol entro 39'" 
            value={`${(stats.prob_comb_gol_before_39 * 100).toFixed(1)}%`}
          />
          <StatCard 
            label="Gol 39'-45'++" 
            value={`${(stats.prob_comb_gol_after_39_ht * 100).toFixed(1)}%`}
          />
          <StatCard 
            label="Gol entro 70' (0-0 HT)" 
            value={`${(stats.prob_comb_gol_before_70_with_00_ht * 100).toFixed(1)}%`}
          />
          <StatCard 
            label="Gol dopo 80'" 
            value={`${(stats.prob_comb_gol_after_80 * 100).toFixed(1)}%`}
          />
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium mb-3">Risultati Più Probabili</h4>
        <div className="grid grid-cols-3 gap-4">
          {stats.risultati_probabili.map((result, index) => (
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