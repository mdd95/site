import { onMount } from 'svelte';

export type UseWebSocketOptions = {
	onmessage?: (data: Record<string, any>) => void;
};

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
	let ws: WebSocket;

	const connect = () => {
		ws = new WebSocket('ws://localhost:3000/app' + url);
		ws.onmessage = async (e) => {
			const text = await e.data.text();
			const data = JSON.parse(text);
			options.onmessage?.(data);
		};
	};

	onMount(() => {
		connect();
		return () => {
			ws.close();
		};
	});

	const send = (data: Parameters<typeof ws.send>[0]) => {
		if (ws.readyState === WebSocket.OPEN) {
			ws.send(data);
		}
	};
	const sendJson = (data: Record<string, any>) => {
		send(JSON.stringify(data));
	};

	return { send, sendJson };
}
