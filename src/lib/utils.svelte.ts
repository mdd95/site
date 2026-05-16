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
	let fn = callback;

	$effect(() => {
		fn = callback;
	});

	$effect(() => {
		const id = setInterval(() => {
			fn();
		}, delay);

		return () => clearInterval(id);
	});
}

export function useAnimationFrame(callback: (delta: number) => void) {
	let fn = callback;

	$effect(() => {
		fn = callback;
	});

	$effect(() => {
		let id: number;
		let prev = performance.now();

		const frame = (time: number) => {
			const delta = time - prev;
			prev = time;
			fn(delta);
			id = requestAnimationFrame(frame);
		};

		id = requestAnimationFrame(frame);
		return () => cancelAnimationFrame(id);
	});
}
