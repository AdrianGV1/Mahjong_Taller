import { Server as SocketIOServer, Socket } from 'socket.io';
import { addPlayer, createGame, removePlayer, selectTile } from './game';
import { Game } from './types';

let game: Game = createGame('mahjong-1');

export function setupSocket(io: SocketIOServer): void {
	io.on('connection', (socket: Socket) => {
		socket.emit('game:state', game);

		socket.on('player:join', ({ name }: { name: string }) => {
			game = addPlayer(game, socket.id, name);
			io.emit('game:state', game);
		});

		socket.on('tile:select', ({ tileId }: { tileId: string }) => {
			game = selectTile(game, tileId, socket.id);
			io.emit('game:state', game);
		});

		socket.on('disconnect', () => {
			game = removePlayer(game, socket.id);
			io.emit('game:state', game);
		});
	});
}
