import React, { useState } from 'react';
import { useAnalysisStore } from '../../store/analysisStore';
import { useMatchStore } from '../../store/matchStore';
import { Search, Tag, Calendar, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SavedAnalysesList() {
  const { analyses, removeAnalysis, currentMatches, setCurrentMatches } = useAnalysisStore();
  const { setMatches } = useMatchStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const navigate = useNavigate();

  const allTags = Array.from(
    new Set(analyses.flatMap(a => a.tags || []))
  );

  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = 
      analysis.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.awayTeam.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = !selectedTag || analysis.tags?.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const sortedAnalyses = [...filteredAnalyses].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAnalysisClick = (analysis: any) => {
    if (currentMatches) {
      setMatches(currentMatches);
      navigate(`/?home=${encodeURIComponent(analysis.homeTeam)}&away=${encodeURIComponent(analysis.awayTeam)}`);
    } else {
      const shouldReload = window.confirm(
        'Per visualizzare questa analisi è necessario ricaricare i dati delle partite. Vuoi procedere?'
      );
      if (shouldReload) {
        window.location.href = `/?home=${encodeURIComponent(analysis.homeTeam)}&away=${encodeURIComponent(analysis.awayTeam)}`;
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Analisi Salvate</h2>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cerca analisi..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={selectedTag || ''}
            onChange={(e) => setSelectedTag(e.target.value || null)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tutti i tag</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {sortedAnalyses.map(analysis => (
          <div 
            key={analysis.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleAnalysisClick(analysis)}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">{analysis.name}</h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(analysis.timestamp)}</span>
                </div>

                {analysis.notes && (
                  <p className="text-sm text-gray-600 mt-2">
                    {analysis.notes}
                  </p>
                )}

                {analysis.tags && analysis.tags.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <div className="flex flex-wrap gap-2">
                      {analysis.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeAnalysis(analysis.id);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {sortedAnalyses.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nessuna analisi salvata
            {searchTerm && ' con questi criteri di ricerca'}
          </div>
        )}
      </div>
    </div>
  );
}