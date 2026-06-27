import { onMount } from 'svelte';

export type UseWebSocketOptions = {
	onmessage?: (event: MessageEvent) => void;
};

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
	let ws: WebSocket;

	const connect = () => {
		ws = new WebSocket(url);
		ws.onmessage = (e) => options.onmessage?.(e);
	};

	onMount(() => {
		connect();
		return () => {
			ws.close();
		};
	});

	const send = (data: string | Blob | BufferSource) => {
		if (ws.readyState === WebSocket.OPEN) {
			ws.send(data);
		}
	};
	const sendJson = (data: Record<string, unknown>) => {
		send(JSON.stringify(data));
	};

	return { send, sendJson };
}
