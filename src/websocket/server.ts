import { type WebSocket, WebSocketServer } from 'ws';
import type { Server } from 'node:http';

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

export function registerWebSocket(server: Server) {
	server.on('upgrade', (req, socket, head) => {
		if (req.url?.startsWith('/ws')) {
			wss.handleUpgrade(req, socket, head, (ws) => {
				wss.emit('connection', ws, req);
			});
		}
	});
}
