import React, { useEffect, useState } from 'react';
import { Tile as TileType } from '../types';
import { Tile } from './Tile';

interface BoardProps {
  tiles: TileType[];
  currentPlayerId: string;
  selectTile: (tileId: string) => void;
}

export const Board: React.FC<BoardProps> = ({ tiles, currentPlayerId, selectTile }) => {
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const spacingScale = viewportWidth < 640 ? 0.72 : viewportWidth < 1024 ? 0.8 : 0.86;
  const tileWidth = viewportWidth < 640 ? 74 : 84;
  const tileHeight = viewportWidth < 640 ? 92 : 104;
  const unitX = Math.round(22 * spacingScale);
  const unitY = Math.round(48 * spacingScale);
  const layerOffset = Math.round(8 * spacingScale);
  const sortedTiles = [...tiles].sort((a, b) => a.z - b.z || a.y - b.y || a.x - b.x);
  const tileBounds = tiles.reduce(
    (bounds, tile) => {
      const left = tile.x * unitX + tile.z * layerOffset;
      const top = tile.y * unitY - tile.z * layerOffset;
      return {
        minLeft: Math.min(bounds.minLeft, left),
        maxRight: Math.max(bounds.maxRight, left + tileWidth),
        minTop: Math.min(bounds.minTop, top),
        maxBottom: Math.max(bounds.maxBottom, top + tileHeight),
      };
    },
    {
      minLeft: Number.POSITIVE_INFINITY,
      maxRight: Number.NEGATIVE_INFINITY,
      minTop: Number.POSITIVE_INFINITY,
      maxBottom: Number.NEGATIVE_INFINITY,
    }
  );

  const boardWidth = Math.max(0, Math.ceil(tileBounds.maxRight - tileBounds.minLeft));
  const boardHeight = Math.max(0, Math.ceil(tileBounds.maxBottom - tileBounds.minTop));

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
            width: `${tileWidth}px`,
            height: `${tileHeight}px`,
            left: `${tile.x * unitX + tile.z * layerOffset - tileBounds.minLeft}px`,
            top: `${tile.y * unitY - tile.z * layerOffset - tileBounds.minTop}px`,
            zIndex: tile.z * 100 + tile.y,
          }}
        />
      ))}
      </div>
    </div>
  );
};