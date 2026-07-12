import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import type { IncomingMessage, Server } from 'node:http';
import { type WebSocket, WebSocketServer } from 'ws';

export const wss = new WebSocketServer({ noServer: true });

const rooms = new Map<string, Set<WebSocket>>();
rooms.set('public-chat', new Set());

function send(clients: Set<WebSocket>, data: any) {
	for (const ws of clients) {
		if (ws.readyState === ws.OPEN) {
			ws.send(data);
		}
	}
}

type ConnectionData = {
	slug: string;
	url: URL;
	user: Record<string, any>;
};
wss.on('connection', (ws: WebSocket, req: IncomingMessage, conn: ConnectionData) => {
	const cleanup = new Set<() => void>();

	switch (conn.slug) {
		case 'public-chat':
			const room = rooms.get('public-chat')!;
			room.add(ws);
			cleanup.add(() => room.delete(ws));
			break;
		default:
			break;
	}

	ws.on('message', (data) => {
		switch (conn.slug) {
			case 'public-chat':
				const room = rooms.get('public-chat')!;
				send(room, data);
				break;
			default:
				break;
		}
	});

	ws.on('close', () => {
		for (const fn of cleanup) fn();
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
