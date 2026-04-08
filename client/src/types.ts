export interface Tile {
  id: string;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
  lockedBy: string | null;
  isEnabled: boolean;
  x: number;
  y: number;
  z: number;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  isConnected: boolean;
}

export interface ScoreSnapshot {
  timestamp: number;
  scores: Record<string, number>;
}

export interface GameState {
  tiles: Tile[];
  players: Player[];
  scoreHistory: ScoreSnapshot[];
  isGameOver: boolean;
  startTime: number | null;
}