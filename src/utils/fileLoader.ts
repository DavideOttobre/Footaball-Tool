
import type { Match } from '../types/Match';

/**
 * Carica e processa una lista di file JSON contenenti dati di partite.
 * La funzione è asincrona e gestisce più file contemporaneamente.
 * @param {FileList} files - L'oggetto FileList proveniente da un input HTML di tipo file.
 * @returns {Promise<Match[]>} Una Promise che si risolve con un array di oggetti Match validi estratti da tutti i file.
 */
export async function loadJsonFiles(files: FileList): Promise<Match[]> {
  const matches: Match[] = [];
  const errors: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.name.endsWith('.json')) {
      try {
        const content = await file.text();
        const data = JSON.parse(content);

        // Gestisce in modo flessibile diverse strutture JSON:
        // 1. Un array di partite.
        // 2. Un oggetto con una proprietà 'partite' che è un array.
        // 3. Un singolo oggetto partita.
        const matchesData = Array.isArray(data) ? data :
          Array.isArray(data.partite) ? data.partite :
          [data];

        // Itera e valida ogni singola partita prima di aggiungerla all'array principale.
        matchesData.forEach((match: any) => {
          if (isValidMatch(match)) {
            matches.push(match);
          } else {
            errors.push(`Dati partita non validi o incompleti nel file ${file.name}`);
          }
        });
      } catch (error) {
        errors.push(`Errore di parsing nel file ${file.name}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
      }
    }
  }

  // Se si sono verificati errori durante il caricamento, li segnala nella console.
  if (errors.length > 0) {
    console.warn('Attenzione: alcuni dati non sono stati caricati correttamente:', errors);
  }

  return matches;
}

/**
 * @private
 * Funzione di validazione (type guard) per un oggetto Match.
 * Verifica che l'oggetto abbia le proprietà essenziali e che siano del tipo corretto.
 * @param {any} match - L'oggetto da validare.
 * @returns {match is Match} True se l'oggetto è un Match valido, altrimenti false.
 */
function isValidMatch(match: any): match is Match {
  return (
    typeof match === 'object' &&
    match !== null &&
    typeof match.data === 'string' &&
    typeof match.squadra_casa === 'string' &&
    typeof match.squadra_trasferta === 'string' &&
    typeof match.gol_casa === 'number' &&
    typeof match.gol_trasferta === 'number' &&
    Array.isArray(match.gol)
  );
}
