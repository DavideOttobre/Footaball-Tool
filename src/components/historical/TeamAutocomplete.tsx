import React, { useState } from 'react';
import { useMatchStore } from '../../store/matchStore';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function TeamAutocomplete({ label, value, onChange }: Props) {
  const { matches } = useMatchStore();
  const [isOpen, setIsOpen] = useState(false);

  const teams = React.useMemo(() => {
    const teamSet = new Set<string>();
    matches.forEach(match => {
      teamSet.add(match.squadra_casa);
      teamSet.add(match.squadra_trasferta);
    });
    return Array.from(teamSet).sort();
  }, [matches]);

  const filteredTeams = teams.filter(team =>
    team.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Cerca squadra..."
      />

      {isOpen && value && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredTeams.map(team => (
            <button
              key={team}
              className="w-full px-4 py-2 text-left hover:bg-gray-50"
              onClick={() => {
                onChange(team);
                setIsOpen(false);
              }}
            >
              {team}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}