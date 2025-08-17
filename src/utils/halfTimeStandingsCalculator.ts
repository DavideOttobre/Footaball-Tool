
import type { Match } from '../types/Match';
import type { Standing } from '../types/Standings';

/**
 * @private
 * Inizializza e restituisce un oggetto Standing vuoto per una squadra specifica.
 * NOTA: Questa è una funzione di utilità duplicata. Potrebbe essere centralizzata in futuro.
 * @param {string} teamName - Il nome della squadra per cui creare la classifica.
 * @returns {Standing} Un oggetto Standing con tutte le statistiche impostate a zero o valori iniziali.
 */
function initializeStanding(teamName: string): Standing {
  return {
    name: teamName,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    goalsForAverage: 0,
    goalsAgainstAverage: 0,
    form: [],
  };
}

/**
 * @private
 * Ordina un array di classifiche secondo le regole standard del calcio (punti, differenza reti, gol fatti).
 * NOTA: Questa è una funzione di utilità duplicata. Potrebbe essere centralizzata in futuro.
 * @param {Standing[]} standings - L'array di oggetti Standing da ordinare.
 * @returns {Standing[]} L'array di classifiche ordinato.
 */
function sortStandings(standings: Standing[]): Standing[] {
  return standings.sort((a, b) => {
    if (a.points !== b.points) {
      return b.points - a.points;
    }
    if (a.goalDifference !== b.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }
    return b.goalsFor - a.goalsFor;
  });
}

/**
 * Calcola la classifica di un campionato basandosi esclusivamente sul risultato del primo tempo di ogni partita.
 * @param {Match[]} matches - L'array di partite da cui calcolare la classifica del primo tempo.
 * @returns {Standing[]} Un array di oggetti Standing che rappresenta la classifica del primo tempo, ordinata.
 */
export function calculateFirstHalfStandings(matches: Match[]): Standing[] {
  const standings = new Map<string, Standing>();

  matches.forEach(match => {
    const homeTeam = standings.get(match.squadra_casa) || initializeStanding(match.squadra_casa);
    const awayTeam = standings.get(match.squadra_trasferta) || initializeStanding(match.squadra_trasferta);

    // Aggiorna le statistiche basandosi sul punteggio del primo tempo
    homeTeam.played++;
    homeTeam.goalsFor += match.gol_primo_tempo_casa;
    homeTeam.goalsAgainst += match.gol_primo_tempo_trasferta;
    if (match.gol_primo_tempo_casa > match.gol_primo_tempo_trasferta) {
      homeTeam.wins++;
      homeTeam.points += 3;
    } else if (match.gol_primo_tempo_casa === match.gol_primo_tempo_trasferta) {
      homeTeam.draws++;
      homeTeam.points += 1;
    } else {
      homeTeam.losses++;
    }

    awayTeam.played++;
    awayTeam.goalsFor += match.gol_primo_tempo_trasferta;
    awayTeam.goalsAgainst += match.gol_primo_tempo_casa;
    if (match.gol_primo_tempo_trasferta > match.gol_primo_tempo_casa) {
      awayTeam.wins++;
      awayTeam.points += 3;
    } else if (match.gol_primo_tempo_casa === match.gol_primo_tempo_trasferta) {
      awayTeam.draws++;
      awayTeam.points += 1;
    } else {
      awayTeam.losses++;
    }

    standings.set(match.squadra_casa, homeTeam);
    standings.set(match.squadra_trasferta, awayTeam);
  });

  // Calcola medie e differenze reti
  standings.forEach(team => {
    team.goalDifference = team.goalsFor - team.goalsAgainst;
    team.goalsForAverage = team.played > 0 ? team.goalsFor / team.played : 0;
    team.goalsAgainstAverage = team.played > 0 ? team.goalsAgainst / team.played : 0;
  });

  return sortStandings(Array.from(standings.values()));
}

/**
 * Calcola la classifica di un campionato basandosi esclusivamente sul risultato del secondo tempo di ogni partita.
 * Il punteggio del secondo tempo viene derivato sottraendo il punteggio del primo tempo dal punteggio finale.
 * @param {Match[]} matches - L'array di partite da cui calcolare la classifica del secondo tempo.
 * @returns {Standing[]} Un array di oggetti Standing che rappresenta la classifica del secondo tempo, ordinata.
 */
export function calculateSecondHalfStandings(matches: Match[]): Standing[] {
  const standings = new Map<string, Standing>();

  matches.forEach(match => {
    const homeTeam = standings.get(match.squadra_casa) || initializeStanding(match.squadra_casa);
    const awayTeam = standings.get(match.squadra_trasferta) || initializeStanding(match.squadra_trasferta);

    // Calcola i gol del secondo tempo
    const homeSecondHalfGoals = match.gol_casa - match.gol_primo_tempo_casa;
    const awaySecondHalfGoals = match.gol_trasferta - match.gol_primo_tempo_trasferta;

    // Aggiorna le statistiche basandosi sul punteggio del secondo tempo
    homeTeam.played++;
    homeTeam.goalsFor += homeSecondHalfGoals;
    homeTeam.goalsAgainst += awaySecondHalfGoals;
    if (homeSecondHalfGoals > awaySecondHalfGoals) {
      homeTeam.wins++;
      homeTeam.points += 3;
    } else if (homeSecondHalfGoals === awaySecondHalfGoals) {
      homeTeam.draws++;
      homeTeam.points += 1;
    } else {
      homeTeam.losses++;
    }

    awayTeam.played++;
    awayTeam.goalsFor += awaySecondHalfGoals;
    awayTeam.goalsAgainst += homeSecondHalfGoals;
    if (awaySecondHalfGoals > homeSecondHalfGoals) {
      awayTeam.wins++;
      awayTeam.points += 3;
    } else if (homeSecondHalfGoals === awaySecondHalfGoals) {
      awayTeam.draws++;
      awayTeam.points += 1;
    } else {
      awayTeam.losses++;
    }

    standings.set(match.squadra_casa, homeTeam);
    standings.set(match.squadra_trasferta, awayTeam);
  });

  // Calcola medie e differenze reti
  standings.forEach(team => {
    team.goalDifference = team.goalsFor - team.goalsAgainst;
    team.goalsForAverage = team.played > 0 ? team.goalsFor / team.played : 0;
    team.goalsAgainstAverage = team.played > 0 ? team.goalsAgainst / team.played : 0;
  });

  return sortStandings(Array.from(standings.values()));
}
