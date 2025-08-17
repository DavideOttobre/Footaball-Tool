import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DistributionChartProps {
  currentData: Array<{ result: string; frequency: number }>;
  historicalData: Array<{ result: string; frequency: number }>;
}

export function DistributionChart({ currentData, historicalData }: DistributionChartProps) {
  const combinedData = currentData.map(current => {
    const historical = historicalData.find(h => h.result === current.result);
    return {
      result: current.result,
      current: current.frequency,
      historical: historical?.frequency || 0,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={combinedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="result" 
          label={{ value: 'Risultato', position: 'bottom' }}
        />
        <YAxis 
          label={{ value: 'Frequenza (%)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                  <p className="text-sm font-medium mb-1">{`Risultato: ${label}`}</p>
                  <p className="text-sm text-blue-600">
                    {`Stagione Corrente: ${payload[0].value.toFixed(1)}%`}
                  </p>
                  <p className="text-sm text-red-600">
                    {`Storico: ${payload[1].value.toFixed(1)}%`}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        <Bar 
          dataKey="current" 
          name="Stagione Corrente" 
          fill="#3b82f6" 
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="historical" 
          name="Storico" 
          fill="#ef4444" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}