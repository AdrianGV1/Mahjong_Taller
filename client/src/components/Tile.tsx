import React from 'react';
import { Tile as TileType } from '../types';

function getSymbolColor(symbol: string): string {
  const redSet = new Set(['🀄', '🀅', '🀆', '🀀', '🀁', '🀂', '🀃']);
  const greenSet = new Set(['🀐', '🀑', '🀒', '🀓', '🀔', '🀕']);
  const blueSet = new Set(['🀙', '🀚', '🀛', '🀜', '🀝', '🀞']);

  if (redSet.has(symbol)) {
    return '#b8281f';
  }
  if (greenSet.has(symbol)) {
    return '#1d6f43';
  }
  if (blueSet.has(symbol)) {
    return '#14528a';
  }
  return '#202226';
}

interface TileProps {
  tile: TileType;
  currentPlayerId: string;
  onSelect: (tileId: string) => void;
  style?: React.CSSProperties;
}

export const Tile: React.FC<TileProps> = React.memo(({ tile, currentPlayerId, onSelect, style }) => {
  const isLockedByOther = tile.lockedBy !== null && tile.lockedBy !== currentPlayerId;
  const isSelected = tile.lockedBy === currentPlayerId;
  const canClick = !tile.isMatched && tile.isEnabled && !isLockedByOther;

  const handleClick = () => {
    if (canClick) onSelect(tile.id);
  };

  const symbolColor = getSymbolColor(tile.symbol);

  return (
    <div 
      className={`solitaire-tile ${tile.isMatched ? 'matched' : ''} ${isLockedByOther ? 'locked' : ''} ${isSelected ? 'selected' : ''} ${tile.isEnabled ? 'enabled' : 'disabled'}`}
      onClick={handleClick}
      style={style}
    >
      <div className="solitaire-tile-face">
        <span className="tile-symbol" style={{ color: symbolColor }}>{tile.symbol}</span>
      </div>
    </div>
  );
});

Tile.displayName = 'Tile';