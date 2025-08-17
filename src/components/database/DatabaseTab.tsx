import React from 'react';
import { useMatchStore } from '../../store/matchStore';
import SummaryTable from './SummaryTable';
import GoalsAnalyzer from './GoalsAnalyzer';
import { Copy } from 'lucide-react';

interface DatabaseTabProps {
  homeTeam: string;
  awayTeam: string;
}

export default function DatabaseTab({ homeTeam, awayTeam }: DatabaseTabProps) {
  const { matches } = useMatchStore();

  const handleCopyData = () => {
    if (!homeTeam || !awayTeam) {
      alert('Seleziona entrambe le squadre prima di copiare i dati');
      return;
    }

    // Ottieni i dati dall'analizzatore
    const analyzer = new GoalsAnalyzer({ matches, homeTeam, awayTeam });
    const stats = analyzer.getStats();

    // Funzione per formattare il numero con la virgola
    const formatDecimal = (value: number) => {
      return (value / 100).toFixed(3).replace('.', ',');
    };

    // Formatta i dati per Excel (separati da tabulazione)
    const data = [
      homeTeam,
      awayTeam,
      formatDecimal(stats.over05HT),
      formatDecimal(stats.over15ST),
      formatDecimal(stats.over25FT),
      formatDecimal(stats.goalBefore39),
      formatDecimal(stats.goalAfter39HT),
      formatDecimal(stats.goalBefore70With00HT),
      formatDecimal(stats.goalAfter80)
    ].join('\t');

    // Copia i dati negli appunti
    navigator.clipboard.writeText(data)
      .then(() => {
        alert('Dati copiati negli appunti');
      })
      .catch(err => {
        console.error('Errore durante la copia dei dati:', err);
        alert('Errore durante la copia dei dati');
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Analisi Database</h2>
        <button
          onClick={handleCopyData}
          disabled={!homeTeam || !awayTeam}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
            ${(!homeTeam || !awayTeam) 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600'}
          `}
        >
          <Copy className="w-4 h-4" />
          <span>Copia dati per Excel</span>
        </button>
      </div>

      {homeTeam && awayTeam && (
        <GoalsAnalyzer 
          matches={matches}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
        />
      )}

      <SummaryTable matches={matches} />
    </div>
  );
}