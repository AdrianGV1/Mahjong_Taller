import React from 'react';
import { useSocket } from './hooks/useSocket';
import { Lobby } from './components/Lobby';
import { Board } from './components/Board';
import { Scoreboard } from './components/Scoreboard';
import { LiveChart } from './components/LiveChart';
import './styles.css';

const App: React.FC = () => {
  const { gameState, isConnected, joinGame, selectTile, currentPlayerId } = useSocket();

  if (!currentPlayerId) {
    return <Lobby joinGame={joinGame} />;
  }

  if (!gameState) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}>Loading Sanctuary...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', padding: '24px' }}>
      {/* Top Bar */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        padding: '0 20px'
      }}>
        <div>
          <h1 style={{ color: 'var(--gold)', fontSize: '1.5rem', letterSpacing: '1px' }}>MAHJONG COOP</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: isConnected ? 'var(--jade)' : 'red' 
            }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {isConnected ? 'LIVE CONNECTION' : 'DISCONNECTED'}
            </span>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '8px 20px', color: 'var(--gold)', fontWeight: 'bold' }}>
          TIME: 12:45
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 320px', 
        gap: '24px', 
        maxWidth: '1400px', 
        margin: '0 auto' 
      }}>
        <section>
          <div className="glass-panel" style={{ background: 'rgba(0,0,0,0.2)', padding: '10px' }}>
            <Board 
              tiles={gameState.tiles} 
              currentPlayerId={currentPlayerId} 
              selectTile={selectTile} 
            />
          </div>
          <LiveChart scoreHistory={gameState.scoreHistory} players={gameState.players} />
        </section>

        <aside>
          <Scoreboard players={gameState.players} currentPlayerId={currentPlayerId} />
        </aside>
      </main>

      {/* Game Over Modal */}
      {gameState.isGameOver && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          backdropFilter: 'blur(8px)'
        }}>
          <div className="glass-panel" style={{ 
            padding: '60px', 
            textAlign: 'center', 
            border: '2px solid var(--gold)',
            animation: 'match-bounce 0.6s ease'
          }}>
            <h2 style={{ fontSize: '3rem', color: 'var(--gold)', marginBottom: '10px' }}>VICTORY</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '30px' }}>Final scores have been recorded.</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: 'var(--gold)',
                color: 'var(--bg-dark)',
                border: 'none',
                padding: '12px 40px',
                borderRadius: '30px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;