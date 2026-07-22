import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';

export function registerSocketIO(server: import('http').Server, secret: string) {
	const io = new Server(server);

	io.use((socket, next) => {
		const token = socket.handshake.auth.token;
		if (!token) return next(new Error('Missing token'));
		try {
			const payload = jwt.verify(token, secret);
			socket.data.user = payload;
			next();
		} catch {
			next(new Error(`Invalid token: ${token}`));
		}
	});

	io.on('connection', (socket) => {
		console.log('Connected:', socket.data.user);

		socket.on('chat message', (data) => {
			socket.broadcast.emit('chat message', data);
		});
	});
}
