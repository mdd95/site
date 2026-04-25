export function createViewTransition(callback: () => void | Promise<void>) {
	if (typeof document.startViewTransition !== 'function') {
		return Promise.resolve(callback());
	}
	return document.startViewTransition(callback).finished;
}
