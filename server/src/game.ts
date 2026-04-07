import { Game, Player, Tile } from './types';

/**
 * Fisher-Yates Shuffle Algorithm
 * Mezcla un array de forma aleatoria
 */
function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface TilePosition {
  x: number;
  y: number;
  z: number;
}

const SYMBOLS = [
  '🀇', '🀈', '🀉', '🀊', '🀋', '🀌',
  '🀍', '🀎', '🀏', '🀙', '🀚', '🀛',
  '🀜', '🀝', '🀞', '🀐', '🀑', '🀒',
  '🀓', '🀔', '🀕', '🀀', '🀁', '🀂',
  '🀃', '🀄', '🀅', '🀆', '🀢',
];

function createRow(startX: number, count: number, y: number, z: number): TilePosition[] {
  return Array.from({ length: count }, (_, index) => ({
    x: startX + index * 2,
    y,
    z,
  }));
}

const LAYOUT: TilePosition[] = [
  // Base layer
  ...createRow(4, 6, 0, 0),
  ...createRow(2, 8, 1, 0),
  ...createRow(0, 10, 2, 0),
  ...createRow(0, 10, 3, 0),
  ...createRow(2, 8, 4, 0),
  ...createRow(4, 6, 5, 0),
  // Middle layer
  ...createRow(6, 4, 1, 1),
  ...createRow(4, 6, 2, 1),
  ...createRow(2, 8, 3, 1),
  ...createRow(4, 6, 4, 1),
  ...createRow(6, 4, 5, 1),
  // Upper layer
  ...createRow(8, 2, 2, 2),
  ...createRow(6, 4, 3, 2),
  ...createRow(6, 4, 4, 2),
  ...createRow(8, 2, 5, 2),
  // Top layer
  ...createRow(8, 2, 3, 3),
  ...createRow(8, 2, 4, 3),
];

function overlapsOnTop(tile: Tile, candidate: Tile): boolean {
  return Math.abs(tile.x - candidate.x) < 2 && Math.abs(tile.y - candidate.y) < 1;
}

function recalculateEnabled(tiles: Tile[]): Tile[] {
  const recalculated = tiles.map((tile) => {
    if (tile.paired) {
      return { ...tile, enabled: false, lockedBy: null };
    }

    const hasTileAbove = tiles.some((candidate) =>
      !candidate.paired && candidate.z > tile.z && overlapsOnTop(tile, candidate)
    );

    const hasLeftNeighbor = tiles.some((candidate) =>
      !candidate.paired && candidate.z === tile.z && candidate.y === tile.y && candidate.x === tile.x - 2
    );
    const hasRightNeighbor = tiles.some((candidate) =>
      !candidate.paired && candidate.z === tile.z && candidate.y === tile.y && candidate.x === tile.x + 2
    );

    const enabled = !hasTileAbove && (!hasLeftNeighbor || !hasRightNeighbor);
    return { ...tile, enabled };
  });

  const enabledCount = recalculated.filter((tile) => tile.enabled).length;
  if (enabledCount >= 8) {
    return recalculated;
  }

  const promotableTiles = recalculated
    .filter((tile) => !tile.paired && !tile.enabled)
    .filter((tile) => !recalculated.some((candidate) =>
      !candidate.paired && candidate.z > tile.z && overlapsOnTop(tile, candidate)
    ))
    .map((tile) => ({
      tile,
      blockerCount: [
        recalculated.some((candidate) =>
          !candidate.paired && candidate.z === tile.z && candidate.y === tile.y && candidate.x === tile.x - 2
        ),
        recalculated.some((candidate) =>
          !candidate.paired && candidate.z === tile.z && candidate.y === tile.y && candidate.x === tile.x + 2
        ),
      ].filter(Boolean).length,
    }))
    .sort((a, b) => a.blockerCount - b.blockerCount || a.tile.z - b.tile.z || a.tile.y - b.tile.y || a.tile.x - b.tile.x)
    .slice(0, Math.max(0, 8 - enabledCount))
    .map(({ tile }) => tile.id);

  const promotedIds = new Set(promotableTiles);
  return recalculated.map((tile) =>
    promotedIds.has(tile.id) ? { ...tile, enabled: true } : tile
  );
}

function seedStartingPairs(tiles: Tile[]): Tile[] {
  const enabledTiles = tiles
    .filter((tile) => tile.enabled)
    .sort((a, b) => a.z - b.z || a.y - b.y || a.x - b.x);

  const playableCount = Math.min(16, enabledTiles.length - (enabledTiles.length % 2));
  if (playableCount < 4) {
    return tiles;
  }

  const pairTypes = fisherYatesShuffle([...SYMBOLS]).slice(0, playableCount / 2);
  const enabledIdsToType = new Map<string, string>();

  for (let index = 0; index < playableCount; index += 2) {
    const type = pairTypes[index / 2];
    enabledIdsToType.set(enabledTiles[index].id, type);
    enabledIdsToType.set(enabledTiles[index + 1].id, type);
  }

  return tiles.map((tile) =>
    enabledIdsToType.has(tile.id)
      ? { ...tile, type: enabledIdsToType.get(tile.id)! }
      : tile
  );
}

/**
 * Genera las fichas del juego de Mahjong
 * Crea pares de fichas con tipos (1-9)
 */
function generateTiles(): Tile[] {
  const pairCount = LAYOUT.length / 2;
  const pairTypes = Array.from({ length: pairCount }, (_, index) => SYMBOLS[index % SYMBOLS.length]);
  const shuffledTypes = fisherYatesShuffle(pairTypes.flatMap((type) => [type, type]));

  const tiles: Tile[] = LAYOUT.map((position, index) => ({
    id: `tile-${index}`,
    type: shuffledTypes[index],
    paired: false,
    flipped: true,
    lockedBy: null,
    enabled: false,
    x: position.x,
    y: position.y,
    z: position.z,
  }));

  return seedStartingPairs(recalculateEnabled(tiles));
}

/**
 * Crea una nueva partida
 */
export function createGame(gameId: string): Game {
  return {
    id: gameId,
    players: [],
    tiles: generateTiles(),
    status: 'waiting',
    currentPlayer: null,
    selectedTiles: [],
    winner: null,
    createdAt: new Date(),
  };
}

/**
 * Agrega un jugador a la partida
 */
export function addPlayer(game: Game, playerId: string, playerName: string): Game {
  // Verificar que el jugador no exista ya
  if (game.players.some((p) => p.id === playerId)) {
    return game;
  }

  const newPlayer: Player = {
    id: playerId,
    name: playerName,
    score: 0,
  };

  const updatedGame = {
    ...game,
    players: [...game.players, newPlayer],
    tiles: recalculateEnabled(game.tiles),
  };

  // Si hay al menos 1 jugador, empezar el juego
  if (updatedGame.players.length >= 1) {
    updatedGame.status = 'playing';
    updatedGame.currentPlayer = updatedGame.players[0].id;
  }

  return updatedGame;
}

/**
 * Remueve un jugador de la partida
 */
export function removePlayer(game: Game, playerId: string): Game {
  const updatedGame = {
    ...game,
    players: game.players.filter((p) => p.id !== playerId),
    tiles: recalculateEnabled(game.tiles),
  };

  // Si no quedan jugadores, finalizar
  if (updatedGame.players.length === 0) {
    updatedGame.status = 'finished';
    updatedGame.currentPlayer = null;
  }

  return updatedGame;
}

/**
 * Selecciona una ficha
 * Maneja el bloqueo y verifica emparejamiento
 */
export function selectTile(game: Game, tileId: string, playerId: string): Game {
  const tile = game.tiles.find((t) => t.id === tileId);

  // Si la ficha no existe o ya está emparejada
  if (!tile || tile.paired || !tile.enabled) {
    return game;
  }

  // Si la ficha está bloqueada por otro jugador
  if (tile.lockedBy && tile.lockedBy !== playerId) {
    return game;
  }

  if (game.selectedTiles.includes(tileId) || game.selectedTiles.length >= 2) {
    return game;
  }

  const updatedGame = {
    ...game,
    tiles: game.tiles.map((t) =>
      t.id === tileId ? { ...t, lockedBy: playerId } : t
    ),
    selectedTiles: [...game.selectedTiles, tileId],
  };

  // Si hay 2 fichas seleccionadas, verificar emparejamiento
  if (updatedGame.selectedTiles.length === 2) {
    return checkMatch(updatedGame, playerId);
  }

  return {
    ...updatedGame,
    tiles: recalculateEnabled(updatedGame.tiles),
  };
}

/**
 * Verifica si hay emparejamiento entre 2 fichas seleccionadas
 * Maneja puntajes y fin del juego
 */
export function checkMatch(game: Game, playerId: string): Game {
  if (game.selectedTiles.length !== 2) {
    return game;
  }

  const [tile1Id, tile2Id] = game.selectedTiles;
  const tile1 = game.tiles.find((t) => t.id === tile1Id);
  const tile2 = game.tiles.find((t) => t.id === tile2Id);

  if (!tile1 || !tile2) {
    return game;
  }

  // Verificar si las fichas son del mismo tipo
  const isMatch = tile1.type === tile2.type;

  let updatedGame: Game;

  if (isMatch) {
    // Emparejamiento exitoso
    updatedGame = {
      ...game,
      tiles: game.tiles.map((t) =>
        t.id === tile1Id || t.id === tile2Id
          ? { ...t, paired: true, lockedBy: null }
          : t
      ),
      selectedTiles: [],
    };

    // Aumentar puntaje del jugador
    updatedGame.players = updatedGame.players.map((p) =>
      p.id === playerId ? { ...p, score: p.score + 10 } : p
    );
  } else {
    // No hay emparejamiento, desbloquear fichas
    updatedGame = {
      ...game,
      tiles: game.tiles.map((t) =>
        (t.id === tile1Id || t.id === tile2Id)
          ? { ...t, lockedBy: null }
          : t
      ),
      selectedTiles: [],
    };
  }

  updatedGame = {
    ...updatedGame,
    tiles: recalculateEnabled(updatedGame.tiles),
  };

  // Verificar si el juego terminó (todas las fichas emparejadas)
  const allPaired = updatedGame.tiles.every((t) => t.paired);
  if (allPaired) {
    updatedGame.status = 'finished';
    const winner = updatedGame.players.reduce((prev, current) =>
      current.score > prev.score ? current : prev
    );
    updatedGame.winner = winner.id;
  }

  return updatedGame;
}
