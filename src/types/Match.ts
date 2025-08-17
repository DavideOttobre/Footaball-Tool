export interface Goal {
  squadra: string;
  minuto: string;
  risultato_corrente_casa: number;
  risultato_corrente_trasferta: number;
}

export interface PlayerStats {
  nome_giocatore: string;
  gol: number;
  assist: number;
}

export interface TeamPreMatchStats {
  btts: number;
  percentuale_partite_0_0: number;
  clean_sheet: number;
  media_segnare_gol_primo_tempo: number;
  media_subire_gol_primo_tempo: number;
  over_1_5: number;
  over_2_5: number;
  percentuale_gol_primi_15: number;
  percentuale_gol_ultimi_15: number;
  media_punti_segna_prima: number;
  media_punti_subisce_prima: number;
  prob_segnare_primi: number;
  prob_subire_primi: number;
  prob_segnare: number;
  prob_subire: number;
  risultati_primo_tempo_frequenti: Array<{
    risultato: string;
    percentuale: number;
  }>;
  top_marcatori: Array<{
    giocatore: string;
    gol: number;
  }>;
  top_assistman: Array<{
    giocatore: string;
    assist: number;
  }>;
  rating: number;
}

export interface CombinedStats {
  prob_comb_btts: number;
  prob_comb_over_1_5: number;
  prob_comb_over_2_5: number;
  prob_comb_under_2_5: number;
  prob_comb_vittoria_casa: number;
  prob_comb_vittoria_trasferta: number;
  prob_comb_pareggio: number;
  differenza_gol_prevista: number;
  prob_comb_segna_prima_casa: number;
  prob_comb_segna_prima_trasferta: number;
  prob_comb_gol_primi_15: number;
  prob_comb_gol_ultimi_15: number;
  risultati_probabili: Array<{
    risultato: string;
    percentuale: number;
  }>;
}

export interface Match {
  data: string;
  squadra_casa: string;
  squadra_trasferta: string;
  campionato: string;
  paese_campionato: string;
  paese_squadra_casa: string;
  paese_squadra_trasferta: string;
  stagione: string;
  modulo_casa: string;
  modulo_trasferta: string;
  gol_primo_tempo_casa: number;
  gol_primo_tempo_trasferta: number;
  gol_secondo_tempo_casa: number;
  gol_secondo_tempo_trasferta: number;
  gol_casa: number;
  gol_trasferta: number;
  possesso_palla_casa: number;
  possesso_palla_trasferta: number;
  tiri_casa: number;
  tiri_trasferta: number;
  tiri_porta_casa: number;
  tiri_porta_trasferta: number;
  tiri_fuori_casa: number;
  tiri_fuori_trasferta: number;
  calci_angolo_casa: number;
  calci_angolo_trasferta: number;
  fuorigioco_casa: number;
  fuorigioco_trasferta: number;
  parate_casa: number;
  parate_trasferta: number;
  falli_casa: number;
  falli_trasferta: number;
  attacchi_casa: number;
  attacchi_trasferta: number;
  attacchi_pericolosi_casa: number;
  attacchi_pericolosi_trasferta: number;
  quota_1: number;
  quota_x: number;
  quota_2: number;
  gol: Goal[];
  statistiche_giocatori: PlayerStats[];
  "Stats Pre Match": {
    [key: string]: TeamPreMatchStats;
  };
  "Combined Stats": CombinedStats;
}