import type { Match } from '../types/Match';

export interface OddsRange {
  min: number;
  max: number | null;
  label: string;
}

export const ODDS_RANGES: OddsRange[] = [
  { min: 0, max: 1.5, label: 'Under 1.50' },
  { min: 1.5, max: 1.8, label: '1.50 - 1.80' },
  { min: 1.8, max: 2.0, label: '1.80 - 2.00' },
  { min: 2.0, max: 3.0, label: '2.00 - 3.00' },
  { min: 3.0, max: null, label: 'Over 3.00' }
];

export function getOddsRange(odds: number): OddsRange {
  return ODDS_RANGES.find(range => 
    odds >= range.min && (range.max === null || odds <= range.max)
  ) || ODDS_RANGES[0];
}

export function filterMatchesByOdds(
  matches: Match[],
  teamName: string,
  isHome: boolean,
  targetOdds: number
): Match[] {
  const targetRange = getOddsRange(targetOdds);
  
  return matches.filter(match => {
    const odds = isHome ? match.quota_1 : match.quota_2;
    return odds >= targetRange.min && (targetRange.max === null || odds <= targetRange.max);
  });
}
