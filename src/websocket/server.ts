import { WebSocketServer } from 'ws';
import type { Server } from 'node:http';

export const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
	ws.on('message', (data) => {
		ws.send(data);
	});
});

export function registerWebSocket(server: Server) {
	server.on('upgrade', (req, socket, head) => {
		if (req.url?.startsWith('/ws')) {
			wss.handleUpgrade(req, socket, head, (ws) => {
				wss.emit('connection', ws, req);
			});
		}
	});
}
