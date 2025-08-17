import React from 'react';
import { X } from 'lucide-react';
import type { HistoricalMatch } from '../../utils/analysis/historicalMatcher';
import { formatMatchDate } from '../../utils/formatting';

interface SimilarMatchesPopupProps {
  matches: HistoricalMatch[];
  title: string;
  onClose: () => void;
}

export default function SimilarMatchesPopup({ matches, title, onClose }: SimilarMatchesPopupProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            {matches.map((match, index) => (
              <MatchCard key={index} match={match} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchCard({ match }: { match: HistoricalMatch }) {
  const [showDetails, setShowDetails] = React.useState(false);

  // Safe number formatting helper
  const formatNumber = (value: number | undefined | null) => {
    if (typeof value !== 'number') return '0';
    return value.toFixed(2);
  };

  return (
    <div 
      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">{formatMatchDate(match.data)}</span>
        <span className="text-sm font-medium text-gray-600">{match.campionato}</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-right">
          <p className="font-medium">{match.squadra_casa}</p>
          <p className="text-sm text-gray-500">
            ({match.gol_primo_tempo_casa} - {match.gol_casa - match.gol_primo_tempo_casa})
          </p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">{match.gol_casa} - {match.gol_trasferta}</p>
          <p className="text-xs text-gray-500">Finale</p>
        </div>
        <div className="text-left">
          <p className="font-medium">{match.squadra_trasferta}</p>
          <p className="text-sm text-gray-500">
            ({match.gol_primo_tempo_trasferta} - {match.gol_trasferta - match.gol_primo_tempo_trasferta})
          </p>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Statistiche Partita</h4>
              <div className="space-y-1 text-sm">
                <p>Possesso palla: {match.possesso_palla_casa || 0}% - {match.possesso_palla_trasferta || 0}%</p>
                <p>Tiri: {match.tiri_casa || 0} - {match.tiri_trasferta || 0}</p>
                <p>Tiri in porta: {match.tiri_porta_casa || 0} - {match.tiri_porta_trasferta || 0}</p>
                <p>Calci d'angolo: {match.calci_angolo_casa || 0} - {match.calci_angolo_trasferta || 0}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Timeline Gol</h4>
              <div className="space-y-1 text-sm">
                {match.gol.map((goal, idx) => (
                  <p key={idx}>
                    {goal.minuto}' - {goal.squadra} 
                    ({goal.risultato_corrente_casa}-{goal.risultato_corrente_trasferta})
                  </p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Criteri di Similitudine</h4>
              <div className="space-y-2">
                {match.similarity?.criteria?.map((criterion, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="font-medium">{criterion.name}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(criterion.match || 0) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        {((criterion.match || 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Target: {formatNumber(criterion.targetValue)} | 
                      Actual: {formatNumber(criterion.actualValue)}
                    </p>
                  </div>
                ))}
                <div className="mt-2 pt-2 border-t">
                  <p className="text-sm font-medium">Match Complessivo</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${(match.similarity?.overallMatch || 0) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">
                      {((match.similarity?.overallMatch || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}