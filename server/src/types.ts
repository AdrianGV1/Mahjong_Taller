export interface Tile {
  id: string;
  type: string;
  paired: boolean;
  flipped: boolean;
  lockedBy: string | null;
  enabled: boolean;
  x: number;
  y: number;
  z: number;
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface Game {
  id: string;
  players: Player[];
  tiles: Tile[];
  status: 'waiting' | 'playing' | 'finished';
  currentPlayer: string | null;
  selectedTiles: string[];
  winner: string | null;
  createdAt: Date;
}
