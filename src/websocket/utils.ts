import type { WebSocket } from 'ws';

export function send(clients: Set<WebSocket>, data: any, except?: WebSocket) {
	for (const ws of clients) {
		if (ws.readyState === ws.OPEN && ws !== except) {
			ws.send(data);
		}
	}
}
