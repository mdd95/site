import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';

export function registerSocketIO(server: import('http').Server, secret: string) {
	const io = new Server(server);

	io.use((socket, next) => {
		const { room, token } = socket.handshake.auth;
		if (!token) return next(new Error('Missing token'));
		try {
			const payload = jwt.verify(token, secret);
			socket.data.user = payload;
			socket.data.room = room;
			next();
		} catch {
			next(new Error(`Invalid token: ${token}`));
		}
	});

	io.on('connection', (socket) => {
		console.log('Connected:', socket.data.user);

		const room = socket.data.room;
		switch (room) {
			case 'public-chat':
				socket.join(room);
				break;
			default:
				break;
		}

		socket.on('chat message', (data) => {
			socket.to(room).emit('chat message', data);
		});
	});
}
