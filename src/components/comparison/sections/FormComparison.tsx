import React from 'react';

export default function FormComparison({ homeTeam, awayTeam, homeStats, awayStats }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Forma Recente</h3>
      
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">{homeTeam}</h4>
          <div className="flex gap-2">
            {homeStats.form.last5.map((result, index) => (
              <div 
                key={index}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                  ${result === 'V' ? 'bg-green-500' : 
                    result === 'N' ? 'bg-yellow-500' : 'bg-red-500'}
                `}
              >
                {result}
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-500">{homeStats.form.wins}</p>
              <p className="text-sm text-gray-600">Vittorie</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-500">{homeStats.form.draws}</p>
              <p className="text-sm text-gray-600">Pareggi</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">{homeStats.form.losses}</p>
              <p className="text-sm text-gray-600">Sconfitte</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">{awayTeam}</h4>
          <div className="flex gap-2">
            {awayStats.form.last5.map((result, index) => (
              <div 
                key={index}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                  ${result === 'V' ? 'bg-green-500' : 
                    result === 'N' ? 'bg-yellow-500' : 'bg-red-500'}
                `}
              >
                {result}
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-500">{awayStats.form.wins}</p>
              <p className="text-sm text-gray-600">Vittorie</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-500">{awayStats.form.draws}</p>
              <p className="text-sm text-gray-600">Pareggi</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">{awayStats.form.losses}</p>
              <p className="text-sm text-gray-600">Sconfitte</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}