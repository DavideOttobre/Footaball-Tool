import type { Match } from '../types/Match';

export type StandingType = 'general' | 'home' | 'away' | 'firstHalf' | 'secondHalf' | 'attack' | 'defense' | 'form';

export function filterHeadToHeadMatches(
  matches: Match[],
  homeTeam: string,
  awayTeam: string,
  directMatchesOnly: boolean = false,
  sameVenueOnly: boolean = false
): Match[] {
  if (directMatchesOnly) {
    const directMatches = matches.filter(match => 
      (match.squadra_casa === homeTeam && match.squadra_trasferta === awayTeam) ||
      (match.squadra_casa === awayTeam && match.squadra_trasferta === homeTeam)
    );

    if (sameVenueOnly) {
      return directMatches.filter(match =>
        match.squadra_casa === homeTeam && match.squadra_trasferta === awayTeam
      );
    }

    return directMatches;
  }

  return matches;
}

export function filterMatchesByStandingType(matches: Match[], teamName: string, type: StandingType): Match[] {
  const teamMatches = matches.filter(m => 
    m.squadra_casa === teamName || m.squadra_trasferta === teamName
  );

  switch (type) {
    case 'home':
      return matches.filter(m => m.squadra_casa === teamName);
    
    case 'away':
      return matches.filter(m => m.squadra_trasferta === teamName);
    
    case 'firstHalf':
      return teamMatches.map(m => ({
        ...m,
        gol: m.gol.filter(g => {
          const minute = parseInt(g.minuto);
          return minute <= 45 || g.minuto.includes('45+');
        })
      }));
    
    case 'secondHalf':
      return teamMatches.map(m => ({
        ...m,
        gol: m.gol.filter(g => {
          const minute = parseInt(g.minuto);
          return minute > 45 || g.minuto.includes('90+');
        })
      }));
    
    case 'attack':
      return teamMatches.filter(m => {
        const goals = m.squadra_casa === teamName ? m.gol_casa : m.gol_trasferta;
        return goals > 0;
      });
    
    case 'defense':
      return teamMatches.filter(m => {
        const goalsAgainst = m.squadra_casa === teamName ? m.gol_trasferta : m.gol_casa;
        return goalsAgainst === 0;
      });
    
    case 'form':
      return teamMatches.slice(-10); // ultime 10 partite
    
    case 'general':
    default:
      return teamMatches;
  }
}
