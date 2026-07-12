import type { IncomingMessage, Server } from 'node:http';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { type WebSocket, WebSocketServer } from 'ws';

export const wss = new WebSocketServer({ noServer: true });
const rooms = new Map<string, Map<string, WebSocket>>();

function forwardTo(clients: Map<string, WebSocket>, data: any) {
	for (const ws of clients.values()) {
		if (ws.readyState === ws.OPEN) {
			ws.send(data);
		}
	}
}

type User = {
	id: string;
	email: string;
	name: string;
};
type Data = {
	url: URL;
	user: User;
	slug: string;
};
wss.on('connection', (ws: WebSocket, req: IncomingMessage, data: Data) => {
	switch (data.slug) {
		case 'chat':
			const roomId = data.url.searchParams.get('id');
			if (roomId) {
				const room = rooms.getOrInsert(roomId, new Map());
				room.set(data.user.id, ws);
			}
			break;

		default:
			break;
	}
	ws.on('message', (msg) => {
		switch (data.slug) {
			case 'chat':
				const roomId = data.url.searchParams.get('id');
				if (roomId) {
					const room = rooms.get(roomId)!;
					forwardTo(room, msg);
				}
				break;
		}
	});
});

type RegisterWebSocketOptions = {
	origin: string;
	secret: string;
	server: Server;
};

export function registerWebSocket({ origin, secret, server }: RegisterWebSocketOptions) {
	server.on('upgrade', (req, socket, head) => {
		const url = new URL(req.url ?? '/', origin);
		const match = url.pathname.match(/^\/app\/([^\/]+)$/);

		if (match) {
			const cookies = cookie.parseCookie(req.headers.cookie ?? '');
			const token = cookies['app.token'];

			if (!token) {
				socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
				socket.destroy();
				return;
			}

			try {
				const user = jwt.verify(token, secret);
				wss.handleUpgrade(req, socket, head, (ws) => {
					wss.emit('connection', ws, req, { url, user, slug: match[1] });
				});
			} catch (err) {
				socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
				socket.destroy();
			}
		}
	});
}
