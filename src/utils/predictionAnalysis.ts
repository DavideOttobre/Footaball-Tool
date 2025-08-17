import type { Match } from '../types/Match';

/**
 * @interface Pattern
 * @description Definisce la struttura di un pattern statistico identificato.
 */
interface Pattern {
  type: string; // Tipo di pattern (es. 'first_half_goals')
  description: string; // Descrizione leggibile del pattern
  confidence: number; // Livello di confidenza (0-100), basato su frequenza e dimensione del campione
  frequency: number; // Frequenza percentuale dell'evento (0-100)
  significance: number; // Rilevanza statistica del pattern
  context: string[]; // Dettagli contestuali che supportano il pattern
  supportingData: {
    matches: number; // Numero di partite analizzate
    occurrences: number; // Numero di volte che il pattern si è verificato
    recentTrend: 'increasing' | 'stable' | 'decreasing'; // Trend recente del pattern
  };
}

/**
 * @interface MatchContext
 * @description Contiene i dati pre-elaborati necessari per le analisi.
 */
interface MatchContext {
  homeTeam: string;
  awayTeam: string;
  matches: Match[];
  recentHomeMatches: Match[];
  recentAwayMatches: Match[];
  headToHead: Match[];
}

/**
 * @function analyzePredictivePatterns
 * @description Funzione principale che orchestra l'analisi dei pattern predittivi.
 * @param {Match[]} matches - L'intero set di partite.
 * @param {string} homeTeam - Squadra di casa.
 * @param {string} awayTeam - Squadra in trasferta.
 * @returns {Pattern[]} Un array di pattern filtrati e ordinati per rilevanza.
 */
export function analyzePredictivePatterns(matches: Match[], homeTeam: string, awayTeam: string): Pattern[] {
  const context = buildMatchContext(matches, homeTeam, awayTeam);
  const patterns: Pattern[] = [];

  patterns.push(...analyzeFirstHalfPatterns(context));
  patterns.push(...analyzeSecondHalfPatterns(context));
  patterns.push(...analyzeComebackPatterns(context));
  patterns.push(...analyzeKeyMomentPatterns(context));
  patterns.push(...analyzeFormPatterns(context));

  return filterAndSortPatterns(patterns);
}

/**
 * @function buildMatchContext
 * @description Prepara e aggrega i dati delle partite necessari per le analisi.
 * @param {Match[]} matches - L'intero set di partite.
 * @param {string} homeTeam - Squadra di casa.
 * @param {string} awayTeam - Squadra in trasferta.
 * @returns {MatchContext} Il contesto dati per le analisi.
 */
function buildMatchContext(matches: Match[], homeTeam: string, awayTeam: string): MatchContext {
  const recentHomeMatches = matches
    .filter(m => m.squadra_casa === homeTeam)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 10);

  const recentAwayMatches = matches
    .filter(m => m.squadra_trasferta === awayTeam)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 10);

  const headToHead = matches
    .filter(m =>
      (m.squadra_casa === homeTeam && m.squadra_trasferta === awayTeam) ||
      (m.squadra_casa === awayTeam && m.squadra_trasferta === homeTeam)
    )
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  return {
    homeTeam,
    awayTeam,
    matches,
    recentHomeMatches,
    recentAwayMatches,
    headToHead
  };
}

/**
 * @function analyzeFirstHalfPatterns
 * @description Analizza i pattern relativi ai gol nel primo tempo.
 * @param {MatchContext} context - Il contesto dati.
 * @returns {Pattern[]} Un array di pattern trovati.
 */
function analyzeFirstHalfPatterns(context: MatchContext): Pattern[] {
  const patterns: Pattern[] = [];
  const { recentHomeMatches, recentAwayMatches } = context;

  const firstHalfGoals = {
    home: recentHomeMatches.filter(m => m.gol_primo_tempo_casa > 0).length,
    away: recentAwayMatches.filter(m => m.gol_primo_tempo_trasferta > 0).length
  };

  const firstHalfFrequency = (firstHalfGoals.home + firstHalfGoals.away) / (recentHomeMatches.length + recentAwayMatches.length);

  if (firstHalfFrequency >= 0.6) {
    patterns.push({
      type: 'first_half_goals',
      description: 'Alta probabilità di gol nel primo tempo',
      confidence: calculateConfidence(firstHalfFrequency, recentHomeMatches.length + recentAwayMatches.length),
      frequency: firstHalfFrequency * 100,
      significance: calculateSignificance(firstHalfFrequency, recentHomeMatches.length + recentAwayMatches.length),
      context: [
        `${context.homeTeam} segna nel primo tempo nel ${(firstHalfGoals.home / recentHomeMatches.length * 100).toFixed(1)}% delle partite in casa`,
        `${context.awayTeam} segna nel primo tempo nel ${(firstHalfGoals.away / recentAwayMatches.length * 100).toFixed(1)}% delle partite in trasferta`
      ],
      supportingData: {
        matches: recentHomeMatches.length + recentAwayMatches.length,
        occurrences: firstHalfGoals.home + firstHalfGoals.away,
        recentTrend: analyzeTrend(recentHomeMatches.concat(recentAwayMatches), 'first_half_goals')
      }
    });
  }

  return patterns;
}

/**
 * @function analyzeSecondHalfPatterns
 * @description Analizza i pattern relativi ai gol nel secondo tempo.
 * @param {MatchContext} context - Il contesto dati.
 * @returns {Pattern[]} Un array di pattern trovati.
 */
function analyzeSecondHalfPatterns(context: MatchContext): Pattern[] {
  const patterns: Pattern[] = [];
  const { recentHomeMatches, recentAwayMatches } = context;

  const secondHalfIncrease = {
    home: recentHomeMatches.filter(m => (m.gol_casa - m.gol_primo_tempo_casa) > m.gol_primo_tempo_casa).length,
    away: recentAwayMatches.filter(m => (m.gol_trasferta - m.gol_primo_tempo_trasferta) > m.gol_primo_tempo_trasferta).length
  };

  const increaseFrequency = (secondHalfIncrease.home + secondHalfIncrease.away) / (recentHomeMatches.length + recentAwayMatches.length);

  if (increaseFrequency >= 0.5) {
    patterns.push({
      type: 'second_half_increase',
      description: 'Tendenza all'incremento dei gol nel secondo tempo',
      confidence: calculateConfidence(increaseFrequency, recentHomeMatches.length + recentAwayMatches.length),
      frequency: increaseFrequency * 100,
      significance: calculateSignificance(increaseFrequency, recentHomeMatches.length + recentAwayMatches.length),
      context: [
        `${context.homeTeam} aumenta i gol nel secondo tempo nel ${(secondHalfIncrease.home / recentHomeMatches.length * 100).toFixed(1)}% delle partite in casa`,
        `${context.awayTeam} aumenta i gol nel secondo tempo nel ${(secondHalfIncrease.away / recentAwayMatches.length * 100).toFixed(1)}% delle partite in trasferta`
      ],
      supportingData: {
        matches: recentHomeMatches.length + recentAwayMatches.length,
        occurrences: secondHalfIncrease.home + secondHalfIncrease.away,
        recentTrend: analyzeTrend(recentHomeMatches.concat(recentAwayMatches), 'second_half_increase')
      }
    });
  }

  return patterns;
}

/**
 * @function analyzeComebackPatterns
 * @description Analizza i pattern di rimonta.
 * @param {MatchContext} context - Il contesto dati.
 * @returns {Pattern[]} Un array di pattern trovati.
 */
function analyzeComebackPatterns(context: MatchContext): Pattern[] {
    const patterns: Pattern[] = [];
    const { recentHomeMatches, recentAwayMatches } = context;

    const comebacks = {
        home: recentHomeMatches.filter(m => m.gol_primo_tempo_casa < m.gol_primo_tempo_trasferta && m.gol_casa >= m.gol_trasferta).length,
        away: recentAwayMatches.filter(m => m.gol_primo_tempo_trasferta < m.gol_primo_tempo_casa && m.gol_trasferta >= m.gol_casa).length
    };

    const comebackFrequency = (comebacks.home + comebacks.away) / (recentHomeMatches.length + recentAwayMatches.length);

    if (comebackFrequency >= 0.2) {
        patterns.push({
            type: 'comeback_propensity',
            description: 'Propensione alla rimonta dopo essere stati in svantaggio',
            confidence: calculateConfidence(comebackFrequency, recentHomeMatches.length + recentAwayMatches.length),
            frequency: comebackFrequency * 100,
            significance: calculateSignificance(comebackFrequency, recentHomeMatches.length + recentAwayMatches.length),
            context: [
                `${context.homeTeam} ha effettuato rimonte nel ${(comebacks.home / recentHomeMatches.length * 100).toFixed(1)}% delle partite in casa`,
                `${context.awayTeam} ha effettuato rimonte nel ${(comebacks.away / recentAwayMatches.length * 100).toFixed(1)}% delle partite in trasferta`
            ],
            supportingData: {
                matches: recentHomeMatches.length + recentAwayMatches.length,
                occurrences: comebacks.home + comebacks.away,
                recentTrend: analyzeTrend(recentHomeMatches.concat(recentAwayMatches), 'comebacks')
            }
        });
    }

    return patterns;
}

/**
 * @function analyzeKeyMomentPatterns
 * @description Analizza i pattern relativi a momenti chiave (es. gol nei minuti finali).
 * @param {MatchContext} context - Il contesto dati.
 * @returns {Pattern[]} Un array di pattern trovati.
 */
function analyzeKeyMomentPatterns(context: MatchContext): Pattern[] {
    const patterns: Pattern[] = [];
    const { recentHomeMatches, recentAwayMatches } = context;

    const lateGoals = {
        home: recentHomeMatches.filter(m => m.gol.some(g => parseInt(g.minuto) >= 80)).length,
        away: recentAwayMatches.filter(m => m.gol.some(g => parseInt(g.minuto) >= 80)).length
    };

    const lateGoalsFrequency = (lateGoals.home + lateGoals.away) / (recentHomeMatches.length + recentAwayMatches.length);

    if (lateGoalsFrequency >= 0.4) {
        patterns.push({
            type: 'late_goals',
            description: 'Alta probabilità di gol nei minuti finali',
            confidence: calculateConfidence(lateGoalsFrequency, recentHomeMatches.length + recentAwayMatches.length),
            frequency: lateGoalsFrequency * 100,
            significance: calculateSignificance(lateGoalsFrequency, recentHomeMatches.length + recentAwayMatches.length),
            context: [
                `${context.homeTeam} segna nei minuti finali nel ${(lateGoals.home / recentHomeMatches.length * 100).toFixed(1)}% delle partite in casa`,
                `${context.awayTeam} segna nei minuti finali nel ${(lateGoals.away / recentAwayMatches.length * 100).toFixed(1)}% delle partite in trasferta`
            ],
            supportingData: {
                matches: recentHomeMatches.length + recentAwayMatches.length,
                occurrences: lateGoals.home + lateGoals.away,
                recentTrend: analyzeTrend(recentHomeMatches.concat(recentAwayMatches), 'late_goals')
            }
        });
    }

    return patterns;
}

/**
 * @function analyzeFormPatterns
 * @description Analizza lo stato di forma recente delle squadre.
 * @param {MatchContext} context - Il contesto dati.
 * @returns {Pattern[]} Un array di pattern trovati.
 */
function analyzeFormPatterns(context: MatchContext): Pattern[] {
    const patterns: Pattern[] = [];
    const { recentHomeMatches, recentAwayMatches } = context;

    const recentForm = {
        home: calculateRecentForm(recentHomeMatches),
        away: calculateRecentForm(recentAwayMatches)
    };

    const formStrength = (recentForm.home + recentForm.away) / 2;

    if (formStrength >= 7) {
        patterns.push({
            type: 'strong_form',
            description: 'Eccellente forma recente',
            confidence: calculateConfidence(formStrength / 10, recentHomeMatches.length + recentAwayMatches.length),
            frequency: formStrength * 10,
            significance: calculateSignificance(formStrength / 10, recentHomeMatches.length + recentAwayMatches.length),
            context: [
                `${context.homeTeam} ha una forma recente di ${recentForm.home}/10 nelle partite in casa`,
                `${context.awayTeam} ha una forma recente di ${recentForm.away}/10 nelle partite in trasferta`
            ],
            supportingData: {
                matches: recentHomeMatches.length + recentAwayMatches.length,
                occurrences: Math.round((recentForm.home + recentForm.away) / 2 * 10),
                recentTrend: analyzeTrend(recentHomeMatches.concat(recentAwayMatches), 'form')
            }
        });
    }

    return patterns;
}

/**
 * @function calculateConfidence
 * @description Calcola un indice di confidenza (0-100) basato sulla frequenza e la dimensione del campione.
 * @param {number} frequency - La frequenza dell'evento (0-1).
 * @param {number} sampleSize - Il numero di partite nel campione.
 * @returns {number} Il punteggio di confidenza.
 */
function calculateConfidence(frequency: number, sampleSize: number): number {
  const baseConfidence = frequency * 100;
  const sampleSizeFactor = Math.min(sampleSize / 10, 1);
  return Math.round(baseConfidence * sampleSizeFactor);
}

/**
 * @function calculateSignificance
 * @description Calcola la significatività statistica (0-100).
 * @param {number} frequency - La frequenza dell'evento (0-1).
 * @param {number} sampleSize - Il numero di partite nel campione.
 * @returns {number} Il punteggio di significatività.
 */
function calculateSignificance(frequency: number, sampleSize: number): number {
  const baseSignificance = frequency * 100;
  const sampleSizeFactor = Math.log10(sampleSize + 1) / Math.log10(11);
  return Math.round(baseSignificance * sampleSizeFactor);
}

/**
 * @function calculateRecentForm
 * @description Calcola un punteggio di forma (0-10) basato sulle ultime 5 partite, con peso decrescente.
 * @param {Match[]} matches - Le partite recenti di una squadra.
 * @returns {number} Il punteggio di forma.
 */
function calculateRecentForm(matches: Match[]): number {
  let formPoints = 0;
  const weightedMatches = matches.slice(0, 5);

  weightedMatches.forEach((match, index) => {
    const weight = (5 - index) / 5;
    const matchPoints = match.gol_casa > match.gol_trasferta ? 3 : match.gol_casa === match.gol_trasferta ? 1 : 0;
    formPoints += matchPoints * weight;
  });

  return Math.round((formPoints / 15) * 10);
}

/**
 * @function analyzeTrend
 * @description Analizza il trend di un pattern specifico. ATTENZIONE: Attualmente è un placeholder.
 * @param {Match[]} matches - Le partite da analizzare.
 * @param {string} patternType - Il tipo di pattern.
 * @returns {'increasing' | 'stable' | 'decreasing'} La direzione del trend.
 */
function analyzeTrend(matches: Match[], patternType: string): 'increasing' | 'stable' | 'decreasing' {
  // TODO: Implementare una vera analisi del trend basata sulle partite recenti.
  return 'stable';
}

/**
 * @function filterAndSortPatterns
 * @description Filtra i pattern per confidenza e significatività minime e li ordina per rilevanza.
 * @param {Pattern[]} patterns - L'array di pattern da filtrare e ordinare.
 * @returns {Pattern[]} L'array di pattern processato.
 */
function filterAndSortPatterns(patterns: Pattern[]): Pattern[] {
  const filteredPatterns = patterns.filter(p => p.confidence >= 60 && p.significance >= 50);
  return filteredPatterns.sort((a, b) => (b.significance + b.confidence) - (a.significance + a.confidence));
}
