import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { setupSocket } from './socket';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
	cors: {
		origin: '*',
	},
});

setupSocket(io);

app.get('/health', (_req, res) => {
	res.json({ ok: true, service: 'mahjong-server' });
});

const PORT = Number(process.env.PORT ?? 3001);

server.listen(PORT, () => {
	console.log(`Mahjong server running on http://localhost:${PORT}`);
});
