export interface TeamPosition {
  firstHalf: number;
  secondHalf: number;
}

export interface ZeroZeroStats {
  firstHalf: { count: number; percentage: number };
  fullTime: { count: number; percentage: number };
}

export interface ScoringPattern {
  count: number;
  percentage: number;
  averagePoints: number;
}

export interface DetailedTeamStats {
  zeroZeroStats: ZeroZeroStats;
  positions: TeamPosition;
  scoringPattern: {
    scoredFirst: ScoringPattern;
    concededFirst: ScoringPattern;
  };
}