import { useMemo } from 'react';
import type { Match } from '../types/Match';
import { calculateTrends } from '../utils/trendAnalysis';

/**
 * @hook useTrendAnalysis
 * @description Un custom hook di React che calcola i dati di tendenza per una squadra e fornisce un componente tooltip personalizzato.
 * Questo hook agisce come un wrapper attorno alla funzione di utilità `calculateTrends`, utilizzando `useMemo` per ottimizzare le performance,
 * evitando di ricalcolare i dati a ogni render se le dipendenze non sono cambiate.
 *
 * @param {Match[]} matches - L'array di partite da analizzare.
 * @param {string} teamName - Il nome della squadra per cui calcolare il trend.
 * @param {string} type - Il tipo di metrica da analizzare (es. 'goals', 'points', 'form').
 *
 * @returns {{ chartData: any[], CustomTooltip: (props: any) => JSX.Element | null }}
 * Un oggetto contenente:
 * - `chartData`: I dati pronti per essere consumati da un grafico (es. Recharts).
 * - `CustomTooltip`: Un componente React da usare come tooltip personalizzato nel grafico.
 */
export function useTrendAnalysis(matches: Match[], teamName: string, type: string) {
  // Memoizza il risultato della funzione di calcolo per ottimizzare le performance.
  // Il calcolo viene rieseguito solo se `matches`, `teamName`, o `type` cambiano.
  const chartData = useMemo(() =>
    calculateTrends(matches, teamName, type),
    [matches, teamName, type]
  );

  /**
   * @component CustomTooltip
   * @description Un componente interno per renderizzare un tooltip personalizzato per i grafici Recharts.
   */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-blue-600">
          {type === 'goals' ? 'Gol: ' :
           type === 'points' ? 'Punti: ' : 'Forma: '}
          {payload[0].value}
        </p>
      </div>
    );
  };

  return { chartData, CustomTooltip };
}
