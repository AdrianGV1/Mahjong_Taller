import React from 'react';
import { Tile as TileType } from '../types';
import { Tile } from './Tile';

interface BoardProps {
  tiles: TileType[];
  currentPlayerId: string;
  selectTile: (tileId: string) => void;
}

export const Board: React.FC<BoardProps> = ({ tiles, currentPlayerId, selectTile }) => {
  const unitX = 20;
  const unitY = 56;
  const layerOffset = 8;
  const sortedTiles = [...tiles].sort((a, b) => a.z - b.z || a.y - b.y || a.x - b.x);
  const maxX = Math.max(...tiles.map((tile) => tile.x), 0);
  const maxY = Math.max(...tiles.map((tile) => tile.y), 0);

  const boardWidth = (maxX + 4) * unitX + 140;
  const boardHeight = (maxY + 4) * unitY + 100;

  return (
    <div className="mahjong-board-shell">
      <div
        className="mahjong-board"
        style={{
          width: `${boardWidth}px`,
          height: `${boardHeight}px`,
        }}
      >
      {sortedTiles.map((tile) => (
        <Tile 
          key={tile.id} 
          tile={tile} 
          currentPlayerId={currentPlayerId} 
          onSelect={selectTile}
          style={{
            left: `${tile.x * unitX + tile.z * layerOffset}px`,
            top: `${tile.y * unitY - tile.z * layerOffset}px`,
            zIndex: tile.z * 100 + tile.y,
          }}
        />
      ))}
      </div>
    </div>
  );
};