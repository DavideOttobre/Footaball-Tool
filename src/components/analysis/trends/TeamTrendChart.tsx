import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTrendAnalysis } from "../../../hooks/useTrendAnalysis";
import type { Match } from "../../../types/Match";

/**
 * @interface Props
 * @description Definisce le props per il componente TeamTrendChart.
 */
interface Props {
  /**
   * L'array di partite da cui estrarre i dati per il trend.
   */
  matches: Match[];
  /**
   * Il nome della squadra da analizzare.
   */
  teamName: string;
  /**
   * La metrica da visualizzare nel grafico (gol, punti o stato di forma).
   */
  type: "goals" | "points" | "form";
}

/**
 * @component TeamTrendChart
 * @description Un componente React che visualizza un grafico a linea per mostrare l'andamento di una metrica specifica (gol, punti, forma) per una data squadra.
 * La logica di calcolo e preparazione dei dati è interamente gestita dal custom hook `useTrendAnalysis`.
 * @param {Props} props - Le props del componente.
 * @returns {JSX.Element} Il componente del grafico renderizzato.
 */
export default function TeamTrendChart({ matches, teamName, type }: Props) {
  // Utilizza il custom hook per ottenere i dati formattati per il grafico e un tooltip personalizzato.
  const { chartData, CustomTooltip } = useTrendAnalysis(matches, teamName, type);

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="value" name={teamName} stroke="#3b82f6" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
