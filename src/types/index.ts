export interface Golfer {
  id: string;
  name: string;
  rank: number;
  score?: number;
  thru?: number;
  today?: number;
  total?: number;
}

export interface Entry {
  id: string;
  userId: string;
  userName: string;
  email: string;
  topGolfers: string[];
  outsideGolfers: string[];
  birdieTiebreaker: number;
  timestamp: number;
  paid: boolean;
  totalScore?: number;
}

export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  year: number;
  currentRound?: number;
  leaderBirdies?: number;
  lastUpdate?: number;
}