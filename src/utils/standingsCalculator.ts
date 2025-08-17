
import type { Match } from '../types/Match';
import type { Standing } from '../types/Standings';

/**
 * Inizializza e restituisce un oggetto Standing vuoto per una squadra specifica.
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
 * Ordina un array di classifiche secondo le regole standard del calcio.
 * L'ordinamento avviene per punti (decrescente), poi differenza reti (decrescente), e infine gol fatti (decrescente).
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
 * Calcola la classifica generale di un campionato basandosi su un elenco di partite.
 * @param {Match[]} matches - L'array di partite da cui calcolare la classifica.
 * @returns {Standing[]} Un array di oggetti Standing che rappresenta la classifica generale, ordinata.
 */
export function calculateGeneralStandings(matches: Match[]): Standing[] {
  const standings = new Map<string, Standing>();

  matches.forEach(match => {
    const homeTeam = standings.get(match.squadra_casa) || initializeStanding(match.squadra_casa);
    const awayTeam = standings.get(match.squadra_trasferta) || initializeStanding(match.squadra_trasferta);

    // Aggiorna statistiche squadra di casa
    homeTeam.played++;
    homeTeam.goalsFor += match.gol_casa;
    homeTeam.goalsAgainst += match.gol_trasferta;
    if (match.gol_casa > match.gol_trasferta) {
      homeTeam.wins++;
      homeTeam.points += 3;
    } else if (match.gol_casa === match.gol_trasferta) {
      homeTeam.draws++;
      homeTeam.points += 1;
    } else {
      homeTeam.losses++;
    }

    // Aggiorna statistiche squadra in trasferta
    awayTeam.played++;
    awayTeam.goalsFor += match.gol_trasferta;
    awayTeam.goalsAgainst += match.gol_casa;
    if (match.gol_trasferta > match.gol_casa) {
      awayTeam.wins++;
      awayTeam.points += 3;
    } else if (match.gol_casa === match.gol_trasferta) {
      awayTeam.draws++;
      awayTeam.points += 1;
    } else {
      awayTeam.losses++;
    }

    standings.set(match.squadra_casa, homeTeam);
    standings.set(match.squadra_trasferta, awayTeam);
  });

  // Calcola differenze reti e medie
  standings.forEach(team => {
    team.goalDifference = team.goalsFor - team.goalsAgainst;
    team.goalsForAverage = team.played > 0 ? team.goalsFor / team.played : 0;
    team.goalsAgainstAverage = team.played > 0 ? team.goalsAgainst / team.played : 0;
  });

  return sortStandings(Array.from(standings.values()));
}

/**
 * Calcola la classifica basandosi esclusivamente sulle partite giocate in casa.
 * @param {Match[]} matches - L'array di partite da cui calcolare la classifica.
 * @returns {Standing[]} Un array di oggetti Standing che rappresenta la classifica casalinga, ordinata.
 */
export function calculateHomeStandings(matches: Match[]): Standing[] {
  const standings = new Map<string, Standing>();

  matches.forEach(match => {
    const homeTeam = standings.get(match.squadra_casa) || initializeStanding(match.squadra_casa);

    homeTeam.played++;
    homeTeam.goalsFor += match.gol_casa;
    homeTeam.goalsAgainst += match.gol_trasferta;
    if (match.gol_casa > match.gol_trasferta) {
      homeTeam.wins++;
      homeTeam.points += 3;
    } else if (match.gol_casa === match.gol_trasferta) {
      homeTeam.draws++;
      homeTeam.points += 1;
    } else {
      homeTeam.losses++;
    }

    standings.set(match.squadra_casa, homeTeam);
  });

  standings.forEach(team => {
    team.goalDifference = team.goalsFor - team.goalsAgainst;
    team.goalsForAverage = team.played > 0 ? team.goalsFor / team.played : 0;
    team.goalsAgainstAverage = team.played > 0 ? team.goalsAgainst / team.played : 0;
  });

  return sortStandings(Array.from(standings.values()));
}

/**
 * Calcola la classifica basandosi esclusivamente sulle partite giocate in trasferta.
 * @param {Match[]} matches - L'array di partite da cui calcolare la classifica.
 * @returns {Standing[]} Un array di oggetti Standing che rappresenta la classifica in trasferta, ordinata.
 */
export function calculateAwayStandings(matches: Match[]): Standing[] {
  const standings = new Map<string, Standing>();

  matches.forEach(match => {
    const awayTeam = standings.get(match.squadra_trasferta) || initializeStanding(match.squadra_trasferta);

    awayTeam.played++;
    awayTeam.goalsFor += match.gol_trasferta;
    awayTeam.goalsAgainst += match.gol_casa;
    if (match.gol_trasferta > match.gol_casa) {
      awayTeam.wins++;
      awayTeam.points += 3;
    } else if (match.gol_casa === match.gol_trasferta) {
      awayTeam.draws++;
      awayTeam.points += 1;
    } else {
      awayTeam.losses++;
    }

    standings.set(match.squadra_trasferta, awayTeam);
  });

  standings.forEach(team => {
    team.goalDifference = team.goalsFor - team.goalsAgainst;
    team.goalsForAverage = team.played > 0 ? team.goalsFor / team.played : 0;
    team.goalsAgainstAverage = team.played > 0 ? team.goalsAgainst / team.played : 0;
  });

  return sortStandings(Array.from(standings.values()));
}

/**
 * Calcola e ordina la classifica in base al miglior attacco (gol fatti).
 * @param {Match[]} matches - L'array di partite da cui calcolare la classifica.
 * @returns {Standing[]} Un array di oggetti Standing ordinato per gol fatti.
 */
export function calculateAttackStandings(matches: Match[]): Standing[] {
  const standings = calculateGeneralStandings(matches);
  return standings.sort((a, b) => {
    if (a.goalsFor !== b.goalsFor) {
      return b.goalsFor - a.goalsFor;
    }
    return b.goalsForAverage - a.goalsForAverage;
  });
}

/**
 * Calcola e ordina la classifica in base alla miglior difesa (gol subiti).
 * @param {Match[]} matches - L'array di partite da cui calcolare la classifica.
 * @returns {Standing[]} Un array di oggetti Standing ordinato per gol subiti (crescente).
 */
export function calculateDefenseStandings(matches: Match[]): Standing[] {
  const standings = calculateGeneralStandings(matches);
  return standings.sort((a, b) => {
    if (a.goalsAgainst !== b.goalsAgainst) {
      return a.goalsAgainst - b.goalsAgainst;
    }
    return a.goalsAgainstAverage - b.goalsAgainstAverage;
  });
}

/**
 * Calcola la classifica dello stato di forma basandosi sulle ultime 10 partite di ogni squadra.
 * @param {Match[]} matches - L'array completo delle partite della stagione.
 * @returns {Standing[]} Un array di oggetti Standing che rappresenta la classifica dello stato di forma.
 */
export function calculateFormStandings(matches: Match[]): Standing[] {
  const teamMatches = new Map<string, Match[]>();
  const standings = new Map<string, Standing>();

  // Raggruppa le partite per squadra
  matches.forEach(match => {
    const homeMatches = teamMatches.get(match.squadra_casa) || [];
    const awayMatches = teamMatches.get(match.squadra_trasferta) || [];

    homeMatches.push(match);
    awayMatches.push(match);

    teamMatches.set(match.squadra_casa, homeMatches);
    teamMatches.set(match.squadra_trasferta, awayMatches);
  });

  // Calcola lo stato di forma per ogni squadra
  teamMatches.forEach((matches, teamName) => {
    const standing = initializeStanding(teamName);
    const last10Matches = matches
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 10);

    last10Matches.forEach(match => {
      const isHome = match.squadra_casa === teamName;
      const teamGoals = isHome ? match.gol_casa : match.gol_trasferta;
      const opponentGoals = isHome ? match.gol_trasferta : match.gol_casa;

      standing.played++;
      standing.goalsFor += teamGoals;
      standing.goalsAgainst += opponentGoals;

      if (teamGoals > opponentGoals) {
        standing.wins++;
        standing.points += 3;
        standing.form.unshift('V'); // Vittoria
      } else if (teamGoals === opponentGoals) {
        standing.draws++;
        standing.points += 1;
        standing.form.unshift('N'); // Nullo (pareggio)
      } else {
        standing.losses++;
        standing.form.unshift('S'); // Sconfitta
      }
    });

    standing.goalDifference = standing.goalsFor - standing.goalsAgainst;
    standing.goalsForAverage = standing.played > 0 ? standing.goalsFor / standing.played : 0;
    standing.goalsAgainstAverage = standing.played > 0 ? standing.goalsAgainst / standing.played : 0;

    standings.set(teamName, standing);
  });

  return sortStandings(Array.from(standings.values()));
}
