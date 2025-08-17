
/**
 * @file eloCalculator.ts
 * @description Contiene tutta la logica per il calcolo, la gestione e la storicizzazione dei punteggi ELO per le squadre.
 */

import type { Match } from '../types/Match';

// --- STRUTTURE DATI ---

/**
 * Rappresenta un singolo punto dati nella cronologia ELO di una squadra.
 */
export interface EloDataPoint {
  matchId: string;
  date: string;
  overallElo: number;
  homeElo: number;
  awayElo: number;
}

/**
 * Mappa che associa il nome di ogni squadra alla sua cronologia di punteggi ELO.
 */
export type EloHistoryStore = Map<string, EloDataPoint[]>;

// --- COSTANTI ---

const INITIAL_ELO = 1500;
const BASE_K_FACTOR = 32; // K-factor di base

// --- FUNZIONI HELPER ---

/** Calcola il punteggio atteso per un giocatore (squadra) basato sulla differenza di ELO. */
const getExpectedScore = (playerElo: number, opponentElo: number): number => {
  return 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
};

/** Calcola un K-factor dinamico basato sulla differenza reti. */
const getDynamicKFactor = (goalDifference: number): number => {
  // Aumenta il K-factor per vittorie con margine più ampio
  if (goalDifference > 1) {
    return BASE_K_FACTOR * (1 + Math.log(goalDifference));
  }
  return BASE_K_FACTOR;
};

/** Aggiorna i punteggi ELO per una singola partita e categoria. */
const updateEloForMatch = (
  homeElo: number,
  awayElo: number,
  homeScore: number,
  awayScore: number
) => {
  const expectedHome = getExpectedScore(homeElo, awayElo);
  const expectedAway = getExpectedScore(awayElo, homeElo);

  const actualHome = homeScore > awayScore ? 1 : homeScore < awayScore ? 0 : 0.5;
  const actualAway = awayScore > homeScore ? 1 : awayScore < homeScore ? 0 : 0.5;

  const goalDifference = Math.abs(homeScore - awayScore);
  const kFactor = getDynamicKFactor(goalDifference);

  const newHomeElo = homeElo + kFactor * (actualHome - expectedHome);
  const newAwayElo = awayElo + kFactor * (actualAway - expectedAway);

  return { newHomeElo, newAwayElo };
};

// --- FUNZIONE PRINCIPALE ---

/**
 * Calcola la cronologia completa dei punteggi ELO per tutte le squadre basandosi su un elenco di partite.
 * Le partite DEVONO essere pre-ordinate cronologicamente dalla più vecchia alla più recente.
 * 
 * @param matches - Un array di oggetti Match, ordinato per data crescente.
 * @returns Una mappa (EloHistoryStore) che contiene la cronologia ELO per ogni squadra.
 */
export const calculateEloHistory = (matches: Match[]): EloHistoryStore => {
  const eloHistory: EloHistoryStore = new Map();
  const currentElo = {
    overall: new Map<string, number>(),
    home: new Map<string, number>(),
    away: new Map<string, number>(),
  };

  // 1. Inizializzazione: Trova tutte le squadre e imposta l'ELO iniziale
  const allTeams = new Set<string>();
  matches.forEach(match => {
    allTeams.add(match.homeTeam);
    allTeams.add(match.awayTeam);
  });

  allTeams.forEach(team => {
    currentElo.overall.set(team, INITIAL_ELO);
    currentElo.home.set(team, INITIAL_ELO);
    currentElo.away.set(team, INITIAL_ELO);
    eloHistory.set(team, []);
  });

  // 2. Ciclo di Calcolo Cronologico
  for (const match of matches) {
    const { homeTeam, awayTeam, homeScore, awayScore, id, date } = match;

    // Recupera ELO corrente
    let homeOverallElo = currentElo.overall.get(homeTeam) ?? INITIAL_ELO;
    let awayOverallElo = currentElo.overall.get(awayTeam) ?? INITIAL_ELO;
    let homeHomeElo = currentElo.home.get(homeTeam) ?? INITIAL_ELO;
    let awayAwayElo = currentElo.away.get(awayTeam) ?? INITIAL_ELO;

    // Calcola nuovi ELO
    const overallResult = updateEloForMatch(homeOverallElo, awayOverallElo, homeScore, awayScore);
    const homeResult = updateEloForMatch(homeHomeElo, awayAwayElo, homeScore, awayScore); // Home vs Away ELO

    // Aggiorna ELO corrente
    currentElo.overall.set(homeTeam, overallResult.newHomeElo);
    currentElo.overall.set(awayTeam, overallResult.newAwayElo);
    currentElo.home.set(homeTeam, homeResult.newHomeElo);
    currentElo.away.set(awayTeam, homeResult.newAwayElo);

    // Storicizza i nuovi punteggi
    eloHistory.get(homeTeam)?.push({
      matchId: id,
      date,
      overallElo: overallResult.newHomeElo,
      homeElo: homeResult.newHomeElo,
      awayElo: currentElo.away.get(homeTeam) ?? INITIAL_ELO, // L'elo 'away' di una squadra non cambia quando gioca in casa
    });

    eloHistory.get(awayTeam)?.push({
      matchId: id,
      date,
      overallElo: overallResult.newAwayElo,
      homeElo: currentElo.home.get(awayTeam) ?? INITIAL_ELO, // L'elo 'home' di una squadra non cambia quando gioca in trasferta
      awayElo: homeResult.newAwayElo,
    });
  }

  return eloHistory;
};
