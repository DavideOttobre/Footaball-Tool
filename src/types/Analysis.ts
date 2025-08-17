export interface Analysis {
  id: string;
  name: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  notes?: string;
  tags?: string[];
  timestamp: number;
}