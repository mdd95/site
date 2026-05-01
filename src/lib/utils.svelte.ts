export function createId(length: number = 8) {
	const bytes = new Uint8Array(length);
	crypto.getRandomValues(bytes);

	return btoa(String.fromCharCode(...bytes))
		.replace(/[^a-zA-Z0-9]/g, '')
		.slice(0, length);
}

export function createViewTransition(callback: () => void | Promise<void>) {
	if (typeof document.startViewTransition !== 'function') {
		return Promise.resolve(callback());
	}
	return document.startViewTransition(callback).finished;
}

export function useInterval(callback: () => void, delay: number = 1000) {
	let id: ReturnType<typeof setInterval>;

	$effect(() => {
		id = setInterval(callback, delay);

		return () => {
			clearInterval(id);
		};
	});
}
