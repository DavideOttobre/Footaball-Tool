import type { Match } from '../../../types/Match';

export function calculateZeroZeroStats(matches: Match[]) {
  const totalMatches = matches.length;
  if (totalMatches === 0) {
    return {
      firstHalf: { count: 0, percentage: 0 },
      fullTime: { count: 0, percentage: 0 }
    };
  }

  const zeroZeroHT = matches.filter(m => 
    m.gol_primo_tempo_casa === 0 && m.gol_primo_tempo_trasferta === 0
  ).length;

  const zeroZeroFT = matches.filter(m => 
    m.gol_casa === 0 && m.gol_trasferta === 0
  ).length;

  return {
    firstHalf: {
      count: zeroZeroHT,
      percentage: (zeroZeroHT / totalMatches) * 100
    },
    fullTime: {
      count: zeroZeroFT,
      percentage: (zeroZeroFT / totalMatches) * 100
    }
  };
}