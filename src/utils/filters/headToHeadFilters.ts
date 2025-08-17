import type { Match } from '../../types/Match';

export function filterHeadToHeadMatches(
  matches: Match[],
  homeTeam: string,
  awayTeam: string,
  directMatchesOnly: boolean = true
): Match[] {
  if (!directMatchesOnly) {
    // Return all matches involving either team
    return matches.filter(match => 
      match.squadra_casa === homeTeam || 
      match.squadra_trasferta === homeTeam ||
      match.squadra_casa === awayTeam || 
      match.squadra_trasferta === awayTeam
    ).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }

  // Return only direct matches where home team played at home and away team played away
  return matches
    .filter(match => 
      match.squadra_casa === homeTeam && match.squadra_trasferta === awayTeam
    )
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
}