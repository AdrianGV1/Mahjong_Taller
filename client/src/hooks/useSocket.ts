import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, Player, ScoreSnapshot, Tile } from '../types';

interface ServerTile {
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

interface ServerPlayer {
  id: string;
  name: string;
  score: number;
}

interface ServerGame {
  id: string;
  players: ServerPlayer[];
  tiles: ServerTile[];
  status: 'waiting' | 'playing' | 'finished';
  currentPlayer: string | null;
  selectedTiles: string[];
  winner: string | null;
  createdAt: string | Date;
}

const SERVER_URL = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_SERVER_URL ?? 'http://localhost:3001';

function toTile(tile: ServerTile): Tile {
  return {
    id: tile.id,
    symbol: tile.type,
    isFlipped: tile.flipped,
    isMatched: tile.paired,
    lockedBy: tile.lockedBy,
    isEnabled: tile.enabled,
    x: tile.x,
    y: tile.y,
    z: tile.z,
  };
}

function toPlayer(player: ServerPlayer): Player {
  return {
    id: player.id,
    name: player.name,
    score: player.score,
    isConnected: true,
  };
}

function buildSnapshot(players: Player[]): ScoreSnapshot {
  const scores: Record<string, number> = {};
  for (const player of players) {
    scores[player.name] = player.score;
  }
  return {
    timestamp: Date.now(),
    scores,
  };
}

function scoresChanged(previous: ScoreSnapshot | undefined, current: ScoreSnapshot): boolean {
  if (!previous) {
    return true;
  }

  const prevKeys = Object.keys(previous.scores);
  const currKeys = Object.keys(current.scores);

  if (prevKeys.length !== currKeys.length) {
    return true;
  }

  for (const key of currKeys) {
    if (previous.scores[key] !== current.scores[key]) {
      return true;
    }
  }

  return false;
}

function mapServerGame(serverGame: ServerGame, previousState: GameState | null): GameState {
  const players = serverGame.players.map(toPlayer);
  const tiles = serverGame.tiles.map(toTile);
  const newSnapshot = buildSnapshot(players);

  const previousHistory = previousState?.scoreHistory ?? [];
  const lastSnapshot = previousHistory[previousHistory.length - 1];
  const shouldPushSnapshot = scoresChanged(lastSnapshot, newSnapshot);

  return {
    tiles,
    players,
    scoreHistory: shouldPushSnapshot
      ? [...previousHistory, newSnapshot].slice(-40)
      : previousHistory,
    isGameOver: serverGame.status === 'finished',
    startTime: new Date(serverGame.createdAt).getTime(),
  };
}

export const useSocket = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [pendingPlayerName, setPendingPlayerName] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SERVER_URL, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('game:state', (serverGame: ServerGame) => {
      setGameState((previous) => mapServerGame(serverGame, previous));
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!pendingPlayerName) {
      return;
    }

    const socket = socketRef.current;
    if (!socket?.connected) {
      return;
    }

    socket.emit('player:join', { name: pendingPlayerName });
  }, [pendingPlayerName, isConnected]);

  const joinGame = (name: string) => {
    setPendingPlayerName(name);
    setCurrentPlayerId(socketRef.current?.id ?? null);
  };

  const selectTile = (tileId: string) => {
    const socket = socketRef.current;
    if (!socket?.connected) {
      return;
    }
    socket.emit('tile:select', { tileId });
  };

  return {
    gameState,
    isConnected,
    joinGame,
    selectTile,
    currentPlayerId,
  };
};