import React from 'react';
import { Download } from 'lucide-react';
import { useMatchStore } from '../store/matchStore';
import { calculateCombinedProbabilities } from '../utils/analysis/probabilityCalculator';
import { calculateTeamStats } from '../utils/statsCalculator';
import { calculateDetailedTeamStats } from '../utils/stats/detailedTeamStats';
import { analyzeFirstHalfGoalsPatterns } from '../utils/analysis/firstHalfGoalsAnalyzer';
import { analyzeSecondHalfGoalsPatterns } from '../utils/analysis/secondHalfGoalsAnalyzer';
import { findSimilarHistoricalMatches } from '../utils/analysis/historicalMatcher';
import { calculatePreMatchProbabilities } from '../utils/analysis/preMatchAnalyzer';

interface ExportDataProps {
  homeTeam: string;
  awayTeam: string;
}

export default function ExportData({ homeTeam, awayTeam }: ExportDataProps) {
  const { matches } = useMatchStore();

  const exportStats = () => {
    if (!homeTeam || !awayTeam) {
      alert('Seleziona entrambe le squadre prima di esportare i dati');
      return;
    }

    // Calcola tutte le statistiche
    const combinedProbs = calculateCombinedProbabilities(matches, homeTeam, awayTeam);
    const homeStats = calculateTeamStats(matches, homeTeam);
    const awayStats = calculateTeamStats(matches, awayTeam);
    const homeDetailedStats = calculateDetailedTeamStats(matches, homeTeam, 'home');
    const awayDetailedStats = calculateDetailedTeamStats(matches, awayTeam, 'away');
    const firstHalfPatterns = analyzeFirstHalfGoalsPatterns(matches, homeTeam, awayTeam);
    const secondHalfPatterns = analyzeSecondHalfGoalsPatterns(matches, homeTeam, awayTeam);
    const historicalMatches = findSimilarHistoricalMatches(matches, calculatePreMatchProbabilities(matches, homeTeam, awayTeam));

    // Prepara i dati per l'export seguendo la struttura delle tab
    const data = {
      panoramica: {
        info_generali: {
          squadre: `${homeTeam} vs ${awayTeam}`,
          data_analisi: new Date().toISOString().split('T')[0],
          partite_analizzate: matches.length
        },
        statistiche_casa: {
          squadra: homeTeam,
          partite: homeStats.totalMatches,
          vittorie: homeStats.wins,
          pareggi: homeStats.draws,
          sconfitte: homeStats.losses,
          gol_fatti: homeStats.goalsScored,
          gol_subiti: homeStats.goalsConceded,
          media_punti: homeStats.averagePoints.toFixed(2)
        },
        statistiche_trasferta: {
          squadra: awayTeam,
          partite: awayStats.totalMatches,
          vittorie: awayStats.wins,
          pareggi: awayStats.draws,
          sconfitte: awayStats.losses,
          gol_fatti: awayStats.goalsScored,
          gol_subiti: awayStats.goalsConceded,
          media_punti: awayStats.averagePoints.toFixed(2)
        }
      },
      prestazioni: {
        casa: {
          media_gol_fatti: homeStats.averageGoalsScored.toFixed(2),
          media_gol_subiti: homeStats.averageGoalsConceded.toFixed(2),
          clean_sheet_percentage: ((homeStats.totalMatches - homeStats.goalsConceded) / homeStats.totalMatches * 100).toFixed(1) + '%',
          goal_segnati_distribution: homeDetailedStats.scoringPattern
        },
        trasferta: {
          media_gol_fatti: awayStats.averageGoalsScored.toFixed(2),
          media_gol_subiti: awayStats.averageGoalsConceded.toFixed(2),
          clean_sheet_percentage: ((awayStats.totalMatches - awayStats.goalsConceded) / awayStats.totalMatches * 100).toFixed(1) + '%',
          goal_segnati_distribution: awayDetailedStats.scoringPattern
        }
      },
      tempistiche: {
        primo_tempo: {
          over05: combinedProbs.over05HT.toFixed(1) + '%',
          pattern_gol: firstHalfPatterns
        },
        secondo_tempo: {
          over15: combinedProbs.over15ST.toFixed(1) + '%',
          pattern_gol: secondHalfPatterns
        },
        statistiche_timing: {
          gol_ultimi_15: combinedProbs.goalsLast15.toFixed(1) + '%',
          segna_prima_casa: combinedProbs.homeScoresFirst.toFixed(1) + '%'
        }
      },
      storico: {
        partite_simili: historicalMatches,
        head_to_head: matches.filter(m => 
          (m.squadra_casa === homeTeam && m.squadra_trasferta === awayTeam) ||
          (m.squadra_casa === awayTeam && m.squadra_trasferta === homeTeam)
        ).map(m => ({
          data: m.data,
          risultato: `${m.gol_casa}-${m.gol_trasferta}`,
          primo_tempo: `${m.gol_primo_tempo_casa}-${m.gol_primo_tempo_trasferta}`,
          gol: m.gol
        }))
      },
      database: {
        partite_casa: matches.filter(m => m.squadra_casa === homeTeam).map(m => ({
          data: m.data,
          avversario: m.squadra_trasferta,
          risultato: `${m.gol_casa}-${m.gol_trasferta}`,
          primo_tempo: `${m.gol_primo_tempo_casa}-${m.gol_primo_tempo_trasferta}`,
          statistiche: {
            possesso: m.possesso_palla_casa,
            tiri: m.tiri_casa,
            tiri_porta: m.tiri_porta_casa,
            calci_angolo: m.calci_angolo_casa
          }
        })),
        partite_trasferta: matches.filter(m => m.squadra_trasferta === awayTeam).map(m => ({
          data: m.data,
          avversario: m.squadra_casa,
          risultato: `${m.gol_casa}-${m.gol_trasferta}`,
          primo_tempo: `${m.gol_primo_tempo_casa}-${m.gol_primo_tempo_trasferta}`,
          statistiche: {
            possesso: m.possesso_palla_trasferta,
            tiri: m.tiri_trasferta,
            tiri_porta: m.tiri_porta_trasferta,
            calci_angolo: m.calci_angolo_trasferta
          }
        }))
      }
    };

    // Converti in JSON e scarica
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analisi_${homeTeam}_vs_${awayTeam}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={exportStats}
      disabled={!homeTeam || !awayTeam}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
        ${(!homeTeam || !awayTeam) 
          ? 'bg-gray-300 cursor-not-allowed' 
          : 'bg-green-500 hover:bg-green-600 text-white'}
      `}
    >
      <Download className="w-4 h-4" />
      <span>Esporta Statistiche</span>
    </button>
  );
}