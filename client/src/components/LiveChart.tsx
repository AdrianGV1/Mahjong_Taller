import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { ScoreSnapshot, Player } from '../types';

interface LiveChartProps {
  scoreHistory: ScoreSnapshot[];
  players: Player[];
}

export const LiveChart: React.FC<LiveChartProps> = ({ scoreHistory, players }) => {
  const chartData = scoreHistory.map(snapshot => ({
    time: new Date(snapshot.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ...snapshot.scores
  }));

  const colors = ['#c9a84c', '#4caf7d', '#4a9eff', '#e07b39', '#a855f7'];

  return (
    <div className="glass-panel" style={{ padding: '20px', height: '300px', marginTop: '24px' }}>
      <h3 style={{ color: 'var(--text-secondary)', marginBottom: '15px', fontSize: '0.9rem', textTransform: 'uppercase' }}>
        Score Evolution
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="time" 
            stroke="var(--text-secondary)" 
            fontSize={12} 
            tickLine={false}
          />
          <YAxis 
            stroke="var(--text-secondary)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--tile-back)', border: '1px solid var(--gold)', borderRadius: '8px' }}
            itemStyle={{ fontSize: '12px' }}
          />
          {players.map((player, index) => (
            <Line
              key={player.id}
              type="monotone"
              dataKey={player.name}
              stroke={colors[index % colors.length]}
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: '#fff' }}
              animationDuration={1000}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};