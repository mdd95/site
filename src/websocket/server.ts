import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import type { IncomingMessage, Server } from 'node:http';
import { type WebSocket, WebSocketServer } from 'ws';
import { public_chat } from './app/public-chat';

export const wss = new WebSocketServer({ noServer: true });

type ConnectionData = {
	slug: string;
	url: URL;
	user: Record<string, any>;
};
wss.on('connection', (ws: WebSocket, req: IncomingMessage, conn: ConnectionData) => {
	switch (conn.slug) {
		case 'public-chat':
			public_chat(ws);
			break;
		default:
			break;
	}
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
