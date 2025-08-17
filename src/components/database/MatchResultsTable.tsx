import React from 'react';
import type { Match } from '../../types/Match';
import { formatMatchDate } from '../../utils/formatting';
import SummaryTable from './SummaryTable';

interface MatchResultsTableProps {
  matches: Match[];
}

export default function MatchResultsTable({ matches }: MatchResultsTableProps) {
  return (
    <div className="space-y-6">
      <SummaryTable matches={matches} />
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campionato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Casa
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  1°T
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Finale
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trasferta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline Gol
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {matches.map((match, index) => (
                <tr 
                  key={`${match.data}-${match.squadra_casa}-${match.squadra_trasferta}-${index}`}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatMatchDate(match.data)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {match.campionato}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {match.squadra_casa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                    {match.gol_primo_tempo_casa} - {match.gol_primo_tempo_trasferta}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold">
                    {match.gol_casa} - {match.gol_trasferta}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {match.squadra_trasferta}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {match.gol.map((goal, idx) => (
                      <span key={idx} className="inline-block mr-2">
                        {goal.squadra === match.squadra_casa ? '🔵' : '🔴'} {goal.minuto}'
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}