import React from 'react';
import { Tile as TileType } from '../types';

function getSymbolColor(symbol: string): string {
  const palette = ['#2c3e50', '#5d3a00', '#3d5a2b', '#5b2a5b', '#8b1e1e', '#1f4f75'];
  const code = symbol.codePointAt(0) ?? 0;
  return palette[code % palette.length];
}

interface TileProps {
  tile: TileType;
  currentPlayerId: string;
  onSelect: (tileId: string) => void;
  style?: React.CSSProperties;
}

export const Tile: React.FC<TileProps> = React.memo(({ tile, currentPlayerId, onSelect, style }) => {
  if (tile.isMatched) {
    return null;
  }

  const isLockedByOther = tile.lockedBy !== null && tile.lockedBy !== currentPlayerId;
  const isSelected = tile.lockedBy === currentPlayerId;
  const canClick = tile.isEnabled && !isLockedByOther;

  const handleClick = () => {
    if (canClick) onSelect(tile.id);
  };

  const symbolColor = getSymbolColor(tile.symbol);

  return (
    <div 
      className={`solitaire-tile ${isLockedByOther ? 'locked' : ''} ${isSelected ? 'selected' : ''} ${tile.isEnabled ? 'enabled' : 'disabled'}`}
      onClick={handleClick}
      style={style}
    >
      <div className="solitaire-tile-face">
        <span className="tile-corner top-left" style={{ color: symbolColor }}>{tile.symbol}</span>
        <span className="tile-corner top-right" style={{ color: symbolColor }}>{tile.symbol}</span>
        <span className="tile-corner bottom-left" style={{ color: symbolColor }}>{tile.symbol}</span>
        <span className="tile-symbol" style={{ color: symbolColor }}>{tile.symbol}</span>
        <span className="tile-corner bottom-right" style={{ color: symbolColor }}>{tile.symbol}</span>
      </div>
    </div>
  );
});

Tile.displayName = 'Tile';