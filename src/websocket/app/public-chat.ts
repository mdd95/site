import type { WebSocket } from 'ws';
import { send } from '../utils.js';

let clients = new Set<WebSocket>();

export function public_chat(ws: WebSocket) {
	clients.add(ws);

	ws.on('message', (data) => {
		send(clients, data, ws);
	});

	ws.on('close', () => {
		clients.delete(ws);
	});
}
