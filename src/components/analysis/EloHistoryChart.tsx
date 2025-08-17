
/**
 * @file EloHistoryChart.tsx
 * @description Componente React per visualizzare la cronologia dei punteggi ELO di una squadra su un grafico a linee.
 */

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMatchStore } from '../../store/matchStore';

/**
 * Props per il componente EloHistoryChart.
 */
interface EloHistoryChartProps {
  teamName: string;
}

const EloHistoryChart: React.FC<EloHistoryChartProps> = ({ teamName }) => {
  const eloHistory = useMatchStore((state) => state.eloHistory.get(teamName));

  if (!eloHistory || eloHistory.length === 0) {
    return <div>Nessuna cronologia ELO disponibile per {teamName}.</div>;
  }

  // Formatta i dati per Recharts, usando l'indice come punto sull'asse X per semplicità
  const chartData = eloHistory.map((dataPoint, index) => ({
    matchNumber: index + 1,
    date: new Date(dataPoint.date).toLocaleDateString(),
    Overall: dataPoint.overallElo.toFixed(0),
    Home: dataPoint.homeElo.toFixed(0),
    Away: dataPoint.awayElo.toFixed(0),
  }));

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3 style={{ textAlign: 'center' }}>Andamento ELO: {teamName}</h3>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="matchNumber" label={{ value: 'Partita', position: 'insideBottom', offset: -5 }} />
          <YAxis domain={['dataMin - 50', 'dataMax + 50']} />
          <Tooltip formatter={(value: number) => value.toFixed(0)} labelFormatter={(label) => `Partita #${label}`} />
          <Legend />
          <Line type="monotone" dataKey="Overall" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="Home" stroke="#82ca9d" />
          <Line type="monotone" dataKey="Away" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EloHistoryChart;
