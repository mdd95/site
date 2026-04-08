import type { Maybe } from '../types.js';

export function useInterval(callback: () => void, delay: number = 1000) {
	let id: Maybe<NodeJS.Timeout>;

	$effect(() => {
		id = setInterval(callback, delay);
		return () => {
			if (id) clearInterval(id);
		};
	});
}
