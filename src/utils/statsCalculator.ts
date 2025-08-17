
import type { Match } from '../types/Match';
import type { TeamStats } from '../types/Stats';

/**
 * Calcola un set completo di statistiche per una singola squadra basandosi su un elenco di partite.
 * @param {Match[]} matches - L'array di partite da analizzare. Devono essere le partite giocate dalla squadra specificata.
 * @param {string} teamName - Il nome della squadra per cui calcolare le statistiche.
 * @returns {TeamStats} Un oggetto contenente le statistiche aggregate della squadra.
 */
export function calculateTeamStats(matches: Match[], teamName: string): TeamStats {
  const stats: TeamStats = {
    totalMatches: matches.length,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsScored: 0,
    goalsConceded: 0,
    points: 0,
    averagePoints: 0,
    position: calculatePosition(matches, teamName), // Calcola la posizione dinamicamente
    averageGoalsScored: 0,
    averageGoalsConceded: 0,
  };

  matches.forEach(match => {
    const isHome = match.squadra_casa === teamName;
    const teamGoals = isHome ? match.gol_casa : match.gol_trasferta;
    const opponentGoals = isHome ? match.gol_trasferta : match.gol_casa;

    stats.goalsScored += teamGoals;
    stats.goalsConceded += opponentGoals;

    if (teamGoals > opponentGoals) {
      stats.wins++;
      stats.points += 3;
    } else if (teamGoals === opponentGoals) {
      stats.draws++;
      stats.points += 1;
    } else {
      stats.losses++;
    }
  });

  // Calcola le medie solo se sono state giocate partite per evitare divisioni per zero.
  stats.averagePoints = stats.totalMatches > 0 ? stats.points / stats.totalMatches : 0;
  stats.averageGoalsScored = stats.totalMatches > 0 ? stats.goalsScored / stats.totalMatches : 0;
  stats.averageGoalsConceded = stats.totalMatches > 0 ? stats.goalsConceded / stats.totalMatches : 0;

  return stats;
}

/**
 * @private
 * Calcola la posizione in classifica di una squadra dinamicamente, basandosi su un set di partite.
 * Questa funzione costruisce una classifica temporanea per determinare la posizione.
 * @param {Match[]} matches - L'array di tutte le partite del campionato necessarie per costruire la classifica.
 * @param {string} teamName - Il nome della squadra di cui trovare la posizione.
 * @returns {number} La posizione in classifica della squadra (1-based).
 */
function calculatePosition(matches: Match[], teamName: string): number {
  const teams = new Map<string, { points: number; goalDiff: number }>();

  // Itera su tutte le partite per calcolare punti e differenza reti per ogni squadra.
  matches.forEach(match => {
    const homeTeam = match.squadra_casa;
    const awayTeam = match.squadra_trasferta;

    // Inizializza le squadre se non sono già presenti nella mappa.
    if (!teams.has(homeTeam)) {
      teams.set(homeTeam, { points: 0, goalDiff: 0 });
    }
    if (!teams.has(awayTeam)) {
      teams.set(awayTeam, { points: 0, goalDiff: 0 });
    }

    const homeStats = teams.get(homeTeam)!;
    const awayStats = teams.get(awayTeam)!;

    const goalDiff = match.gol_casa - match.gol_trasferta;
    homeStats.goalDiff += goalDiff;
    awayStats.goalDiff -= goalDiff;

    if (match.gol_casa > match.gol_trasferta) {
      homeStats.points += 3;
    } else if (match.gol_casa < match.gol_trasferta) {
      awayStats.points += 3;
    } else {
      homeStats.points += 1;
      awayStats.points += 1;
    }
  });

  // Converte la mappa in un array e la ordina per creare la classifica.
  const standings = Array.from(teams.entries())
    .sort(([, a], [, b]) => {
      if (a.points !== b.points) {
        return b.points - a.points; // Ordina per punti (decrescente)
      }
      return b.goalDiff - a.goalDiff; // Poi per differenza reti (decrescente)
    });

  // Trova l'indice della squadra nella classifica ordinata.
  const position = standings.findIndex(([team]) => team === teamName) + 1;
  return position;
}
