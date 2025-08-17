export interface Bookmark {
  id: string;
  matchId: string;
  category: 'statistics' | 'odds' | 'trends';
  type: string;
  value: number | string;
  notes?: string;
  timestamp: number;
}