import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ScatterPlotProps {
  currentData: Array<{ minute: number; goals: number }>;
  historicalData: Array<{ minute: number; goals: number }>;
  team: string;
}

export function ScatterPlot({ currentData, historicalData, team }: ScatterPlotProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="minute" 
          type="number" 
          name="Minuto" 
          domain={[0, 45]} 
          label={{ value: 'Minuto', position: 'bottom' }}
        />
        <YAxis 
          dataKey="goals" 
          type="number" 
          name="Gol" 
          label={{ value: 'Gol', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                  <p className="text-sm font-medium">{`Minuto: ${data.minute}'`}</p>
                  <p className="text-sm text-blue-600">{`Gol: ${data.goals}`}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        <Scatter 
          name="Stagione Corrente" 
          data={currentData} 
          fill="#3b82f6" 
          shape="circle"
        />
        <Scatter 
          name="Storico" 
          data={historicalData} 
          fill="#ef4444" 
          shape="diamond"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}