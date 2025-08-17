import type { Match } from '../../types/Match';

export async function loadMatchData(files: FileList): Promise<Match[]> {
  const matches: Match[] = [];
  const errors: string[] = [];

  for (const file of Array.from(files)) {
    if (!file.name.endsWith('.json')) continue;

    try {
      const content = await file.text();
      const data = JSON.parse(content);
      if (data.partite && Array.isArray(data.partite)) {
        matches.push(...data.partite);
      }
    } catch (error) {
      errors.push(`Errore nel file ${file.name}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
    }
  }

  if (errors.length > 0) {
    console.warn('Alcuni file non sono stati caricati correttamente:', errors);
  }

  return matches;
}