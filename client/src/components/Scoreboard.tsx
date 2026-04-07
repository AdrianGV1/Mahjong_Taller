import React from 'react';
import { Player } from '../types';

interface ScoreboardProps {
  players: Player[];
  currentPlayerId: string;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ players, currentPlayerId }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="glass-panel" style={{ padding: '20px', minWidth: '280px' }}>
      <h3 style={{ color: 'var(--gold)', marginBottom: '20px', textAlign: 'center' }}>Rankings</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sortedPlayers.map((player) => (
          <div 
            key={player.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              borderRadius: '10px',
              background: player.id === currentPlayerId ? 'rgba(201, 168, 76, 0.15)' : 'rgba(255,255,255,0.03)',
              border: player.id === currentPlayerId ? '1px solid var(--gold)' : '1px solid transparent',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--gold)',
              color: 'var(--bg-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              marginRight: '12px'
            }}>
              {player.name.substring(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{player.name}</div>
              <div style={{ fontSize: '1.2rem', color: 'var(--jade)', fontWeight: '700' }}>
                {player.score.toLocaleString()}
              </div>
            </div>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: player.isConnected ? 'var(--jade)' : '#444',
              boxShadow: player.isConnected ? '0 0 10px var(--jade)' : 'none'
            }} />
          </div>
        ))}
      </div>
    </div>
  );
};