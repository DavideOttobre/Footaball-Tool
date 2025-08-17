import React from 'react';
import type { Match } from '../../types/Match';
import { calculateCombinedProbabilities } from '../../utils/analysis/probabilityCalculator';

interface GoalsAnalyzerProps {
  matches: Match[];
  homeTeam: string;
  awayTeam: string;
}

export default class GoalsAnalyzer extends React.Component<GoalsAnalyzerProps> {
  getStats() {
    return calculateCombinedProbabilities(
      this.props.matches,
      this.props.homeTeam,
      this.props.awayTeam
    );
  }

  render() {
    const stats = this.getStats();

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-6">Probabilità Combinate</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Over 0.5 Primo Tempo"
            value={stats.over05HT}
            matches={stats.matchCount}
          />
          <StatCard
            label="Over 1.5 Secondo Tempo"
            value={stats.over15ST}
            matches={stats.matchCount}
          />
          <StatCard
            label="Over 2.5"
            value={stats.over25FT}
            matches={stats.matchCount}
          />
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium mb-4">Timing Specifici</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              label="Gol entro 39'"
              value={stats.goalBefore39}
              matches={stats.matchCount}
            />
            <StatCard
              label="Gol 39'-45'++"
              value={stats.goalAfter39HT}
              matches={stats.matchCount}
            />
            <StatCard
              label="Gol entro 70' (0-0 HT)"
              value={stats.goalBefore70With00HT}
              matches={stats.matchCount}
            />
            <StatCard
              label="Gol dopo 80'"
              value={stats.goalAfter80}
              matches={stats.matchCount}
            />
          </div>
        </div>
      </div>
    );
  }
}

interface StatCardProps {
  label: string;
  value: number;
  matches: number;
}

function StatCard({ label, value, matches }: StatCardProps) {
  const getColorClass = (probability: number) => {
    if (probability >= 75) return 'bg-green-50 text-green-700';
    if (probability >= 60) return 'bg-blue-50 text-blue-700';
    return 'bg-gray-50 text-gray-700';
  };

  return (
    <div className={`p-6 rounded-lg ${getColorClass(value)}`}>
      <h4 className="text-lg font-medium mb-2">{label}</h4>
      <p className="text-3xl font-bold mb-1">{value.toFixed(1)}%</p>
      <p className="text-sm opacity-75">
        Basato su {matches} partite
      </p>
    </div>
  );
}