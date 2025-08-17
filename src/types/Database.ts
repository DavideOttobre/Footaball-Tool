interface Range {
  min: number;
  max: number;
}

export interface PreMatchStatsQuery {
  btts: Range;
  over15: Range;
  over25: Range;
  avgGoalsFirstHalf: Range;
  avgGoalsConcededFirstHalf: Range;
  probScoringFirst: Range;
  probConcedingFirst: Range;
}