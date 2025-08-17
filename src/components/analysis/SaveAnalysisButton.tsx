import React from 'react';
import { Save } from 'lucide-react';
import { useAnalysisStore } from '../../store/analysisStore';

interface SaveAnalysisButtonProps {
  homeTeam: string;
  awayTeam: string;
}

export default function SaveAnalysisButton({ homeTeam, awayTeam }: SaveAnalysisButtonProps) {
  const { addAnalysis } = useAnalysisStore();

  const handleSave = () => {
    addAnalysis({
      name: `${homeTeam} - ${awayTeam}`,
      date: new Date().toISOString().split('T')[0],
      homeTeam,
      awayTeam,
      notes: '',
      tags: [],
    });
  };

  return (
    <button
      onClick={handleSave}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      <Save className="w-4 h-4" />
      <span>Salva Analisi</span>
    </button>
  );
}