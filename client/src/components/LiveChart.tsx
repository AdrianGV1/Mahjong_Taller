import React, { useMemo } from "react";
import { ScoreSnapshot, Player } from "../types";

interface LiveChartProps {
  scoreHistory: ScoreSnapshot[];
  players: Player[];
}

const COLORS = ["#c9a84c", "#4caf7d", "#4a9eff", "#e07b39", "#a855f7"];
const MAX_HEIGHT = 180;
const FIGURE_WIDTH = 44;

function StickFigure({
  color,
  heightPx,
  connected,
}: {
  color: string;
  heightPx: number;
  connected: boolean;
}) {
  const scale = Math.max(0.25, heightPx / MAX_HEIGHT);
  const headR = Math.round(7 * scale);
  const bodyH = Math.round(28 * scale);
  const armW = Math.round(12 * scale);
  const legH = Math.round(18 * scale);
  const cx = FIGURE_WIDTH / 2;
  const top = 4;
  const headCY = top + headR;
  const bodyTop = headCY + headR + 3;
  const bodyBot = bodyTop + bodyH;
  const totalH = headR * 2 + 4 + bodyH + legH + 4;
  const sw = Math.max(1.5, 2.5 * scale);
  const alpha = connected ? 1 : 0.35;

  return (
    <svg
      width={FIGURE_WIDTH}
      height={totalH}
      viewBox={`0 0 ${FIGURE_WIDTH} ${totalH}`}
      style={{ overflow: "visible", opacity: alpha, transition: "height 0.6s ease" }}
    >
      <circle cx={cx} cy={headCY} r={headR} fill={color} />
      <line x1={cx} y1={bodyTop} x2={cx} y2={bodyBot} stroke={color} strokeWidth={Math.max(2, 3 * scale)} strokeLinecap="round" />
      <line x1={cx - armW} y1={bodyTop + bodyH * 0.3} x2={cx + armW} y2={bodyTop + bodyH * 0.3} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1={cx} y1={bodyBot} x2={cx - armW * 0.8} y2={bodyBot + legH} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1={cx} y1={bodyBot} x2={cx + armW * 0.8} y2={bodyBot + legH} stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
}

export const LiveChart: React.FC<LiveChartProps> = ({ scoreHistory, players }) => {
  const currentScores = useMemo(() => {
    if (scoreHistory.length === 0) return {};
    return scoreHistory[scoreHistory.length - 1].scores;
  }, [scoreHistory]);

  const maxScore = useMemo(() => {
    const allScores = players.map((p) => currentScores[p.name] ?? 0);
    return Math.max(1, ...allScores);
  }, [currentScores, players]);

  if (players.length === 0) {
    return (
      <div style={styles.container}>
        <p style={styles.empty}>Waiting for players...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Score Evolution</h3>

      {/* Área de muñecos */}
      <div style={styles.figuresArea}>
        {/* Líneas de referencia del eje Y */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <div
            key={ratio}
            style={{
              ...styles.axisLine,
              bottom: `${ratio * MAX_HEIGHT}px`,
            }}
          />
        ))}

        {players.map((player, index) => {
          const color = COLORS[index % COLORS.length];
          const score = currentScores[player.name] ?? 0;
          const heightPx = Math.max(8, Math.round((score / maxScore) * MAX_HEIGHT));

          return (
            <div key={player.id} style={styles.figureCol}>
              <div style={{ ...styles.figureWrap, height: MAX_HEIGHT }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    height: "100%",
                    transition: "all 0.6s cubic-bezier(.4,0,.2,1)",
                  }}
                >
                  <StickFigure color={color} heightPx={heightPx} connected={player.isConnected} />
                </div>
              </div>

              {/* Puntaje */}
              <span style={{ ...styles.scoreLabel, color }}>{score}</span>

              {/* Nombre con indicador de conexión */}
              <div style={styles.nameRow}>
                <span
                  style={{
                    ...styles.dot,
                    background: player.isConnected ? color : "#888",
                  }}
                />
                <span style={styles.name}>{player.name}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Historial de últimas jugadas */}
      {scoreHistory.length > 1 && (
        <div style={styles.historyRow}>
          {scoreHistory.slice(-5).map((snap, i) => (
            <span key={i} style={styles.historyDot} title={new Date(snap.timestamp).toLocaleTimeString()} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "20px",
    marginTop: "24px",
    background: "var(--tile-back, rgba(255,255,255,0.05))",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  title: {
    color: "var(--text-secondary, #aaa)",
    marginBottom: "16px",
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontWeight: 500,
  },
  figuresArea: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-around",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
    paddingBottom: "0",
    position: "relative",
    height: `${MAX_HEIGHT + 10}px`,
  },
  axisLine: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTop: "0.5px solid rgba(255,255,255,0.06)",
    pointerEvents: "none",
  },
  figureCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  figureWrap: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    width: "100%",
  },
  scoreLabel: {
    fontSize: "16px",
    fontWeight: 500,
    marginTop: "6px",
  },
  nameRow: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    marginTop: "2px",
  },
  dot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    display: "inline-block",
    flexShrink: 0,
  },
  name: {
    fontSize: "12px",
    color: "var(--text-secondary, #aaa)",
    maxWidth: "60px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  historyRow: {
    display: "flex",
    gap: "6px",
    justifyContent: "center",
    marginTop: "12px",
  },
  historyDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    display: "inline-block",
  },
  empty: {
    color: "var(--text-secondary, #aaa)",
    fontSize: "0.85rem",
    textAlign: "center",
    margin: 0,
  },
};
