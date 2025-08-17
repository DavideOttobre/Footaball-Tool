import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useMatchStore } from '../store/matchStore';
import { useAnalysisStore } from '../store/analysisStore';
import { loadJsonFiles } from '../utils/fileLoader';

export default function FileUploader() {
  const { setMatches } = useMatchStore();
  const { setCurrentMatches } = useAnalysisStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileCount, setFileCount] = useState(0);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setLoading(true);
      setError(null);
      setFileCount(files.length);
      try {
        const matches = await loadJsonFiles(files);
        if (matches.length > 0) {
          setMatches(matches);
          setCurrentMatches(matches);
        } else {
          setError('Nessun dato valido trovato nei file selezionati');
        }
      } catch (error) {
        setError('Errore nel caricamento dei file');
        console.error('Errore nel caricamento dei file:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <div className="max-w-xl mx-auto">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept=".json"
          className="hidden"
          webkitdirectory=""
          directory=""
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
          disabled={loading}
        >
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Upload className="w-10 h-10 mb-3 text-blue-500" />
            <p className="mb-2 text-lg font-semibold text-gray-700">
              Seleziona i file JSON da analizzare
            </p>
            <p className="text-sm text-gray-500">
              Puoi selezionare più file contemporaneamente
            </p>
          </div>
        </button>

        {loading && (
          <div className="mt-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-4 h-4 border-2 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
              <p className="text-gray-600">
                Caricamento di {fileCount} file in corso...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-center text-red-600 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && fileCount > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-center text-green-600 text-sm">
              {fileCount} file caricati con successo
            </p>
          </div>
        )}
      </div>
    </div>
  );
}