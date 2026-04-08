import React, { useState } from 'react';
import { AVATAR_OPTIONS, DEFAULT_AVATAR_ID } from '../avatarOptions';

interface LobbyProps {
  joinGame: (name: string, avatar: string) => void;
}

export const Lobby: React.FC<LobbyProps> = ({ joinGame }) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATAR_ID);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) joinGame(name.trim(), selectedAvatar);
  };

  return (
    <div className="lobby-shell">
      <div className="glass-panel lobby-card" style={{ 
        textAlign: 'center', 
        animation: 'fade-in-up 0.8s ease-out'
      }}>
        <h1 style={{ fontSize: '3.5rem', color: 'var(--gold)', marginBottom: '8px' }}>🀄</h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px', letterSpacing: '2px' }}>MAHJONG COOP</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Play together in real time.</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Choose your gorilla
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '10px',
            }}>
              {AVATAR_OPTIONS.map((avatar) => {
                const isSelected = avatar.id === selectedAvatar;

                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.id)}
                    style={{
                      border: isSelected ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.08)',
                      background: isSelected ? 'rgba(201, 168, 76, 0.14)' : 'rgba(0,0,0,0.18)',
                      borderRadius: '14px',
                      padding: '10px 8px',
                      cursor: 'pointer',
                      color: 'white',
                      transition: 'transform 0.2s ease, border-color 0.2s ease, background 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <img
                      src={avatar.src}
                      alt={avatar.label}
                      style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        display: 'block',
                        marginBottom: '8px',
                        background: 'rgba(255,255,255,0.04)',
                      }}
                    />
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: isSelected ? 'var(--gold)' : 'var(--text-secondary)' }}>
                      {avatar.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <input
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: '14px 20px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(0,0,0,0.2)',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--gold)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
          <button
            type="submit"
            style={{
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, var(--gold) 0%, #a68a3d 100%)',
              color: 'var(--bg-dark)',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            JOIN GAME
          </button>
        </form>
      </div>
    </div>
  );
};