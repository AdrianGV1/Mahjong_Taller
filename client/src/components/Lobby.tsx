import React, { useState } from 'react';

interface LobbyProps {
  joinGame: (name: string) => void;
}

export const Lobby: React.FC<LobbyProps> = ({ joinGame }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) joinGame(name.trim());
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      background: 'radial-gradient(circle, #1a1d2e 0%, #0f1117 100%)'
    }}>
      <div className="glass-panel" style={{ 
        padding: '48px', 
        textAlign: 'center', 
        maxWidth: '400px', 
        width: '90%',
        animation: 'fade-in-up 0.8s ease-out'
      }}>
        <h1 style={{ fontSize: '3.5rem', color: 'var(--gold)', marginBottom: '8px' }}>🀄</h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px', letterSpacing: '2px' }}>MAHJONG COOP</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Play together in real time.</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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