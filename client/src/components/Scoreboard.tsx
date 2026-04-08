import React from 'react';
import { Player } from '../types';
import { getAvatarOption } from '../avatarOptions';

interface ScoreboardProps {
  players: Player[];
  currentPlayerId: string;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ players, currentPlayerId }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="glass-panel scoreboard-card" style={{ padding: '20px', minWidth: '280px' }}>
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
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              marginRight: '12px',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 10px 18px rgba(0,0,0,0.28)'
            }}>
              <img
                src={getAvatarOption(player.avatar).src}
                alt={player.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
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