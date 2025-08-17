import type { Match } from '../../../types/Match';
import { calculateFirstHalfStandings, calculateSecondHalfStandings } from '../../halfTimeStandingsCalculator';

export function calculatePositionStats(
  matches: Match[], 
  teamName: string,
  context: 'all' | 'home' | 'away'
) {
  // Per le classifiche complete, usa tutte le partite
  if (context === 'all') {
    const firstHalfStandings = calculateFirstHalfStandings(matches);
    const secondHalfStandings = calculateSecondHalfStandings(matches);
    
    return {
      firstHalf: firstHalfStandings.findIndex(s => s.name === teamName) + 1,
      secondHalf: secondHalfStandings.findIndex(s => s.name === teamName) + 1
    };
  }

  // Per le classifiche casa/trasferta, crea classifiche separate
  const homeTeams = new Set(matches.map(m => m.squadra_casa));
  const awayTeams = new Set(matches.map(m => m.squadra_trasferta));
  
  // Filtra le partite in base al contesto (casa o trasferta)
  const relevantMatches = matches.filter(m => {
    if (context === 'home') {
      // Per la classifica delle partite in casa, considera solo le partite in casa di tutte le squadre
      return homeTeams.has(m.squadra_casa);
    } else {
      // Per la classifica delle partite in trasferta, considera solo le partite in trasferta di tutte le squadre
      return awayTeams.has(m.squadra_trasferta);
    }
  });

  const firstHalfStandings = calculateFirstHalfStandings(relevantMatches);
  const secondHalfStandings = calculateSecondHalfStandings(relevantMatches);

  return {
    firstHalf: firstHalfStandings.findIndex(s => s.name === teamName) + 1,
    secondHalf: secondHalfStandings.findIndex(s => s.name === teamName) + 1
  };
}