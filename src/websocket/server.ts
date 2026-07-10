import type { Server } from 'node:http';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { type WebSocket, WebSocketServer } from 'ws';

export const wss = new WebSocketServer({ noServer: true });

const listeners = {
	publicChat: new Set<WebSocket>()
};

function broadcast(listeners: Set<WebSocket>, data: any) {
	listeners.forEach((ws) => {
		if (ws.readyState === ws.OPEN) ws.send(data);
	});
}

wss.on('connection', (ws, req) => {
	if (req.url === '/ws/public-chat') {
		listeners.publicChat.add(ws);
	}

	ws.on('message', (data) => {
		if (req.url === '/ws/public-chat') {
			broadcast(listeners.publicChat, data);
		}
	});
});

export function registerWebSocket(server: Server, secret: string) {
	server.on('upgrade', (req, socket, head) => {
		const url = new URL(req.url ?? '/', 'http://localhost:5173');
		const match = url.pathname.match(/^\/app\/([^/]+)$/);
		const slug = match?.at(1);

		if (match && slug) {
			const cookies = cookie.parseCookie(req.headers.cookie ?? '');
			const token = cookies['app.token'];

			if (!token) {
				console.log('No token provided');
				socket.destroy();
				return;
			}

			try {
				const decoded = jwt.verify(token, secret);

				wss.handleUpgrade(req, socket, head, (ws) => {
					wss.emit('connection', ws, req, decoded, slug);
				});
			} catch (err) {
				console.log('Invalid token', err);
				socket.destroy();
			}
		}
	});
}
