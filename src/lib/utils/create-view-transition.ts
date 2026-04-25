export function createViewTransition(callback: () => void | Promise<void>) {
	if (!document.startViewTransition) {
		return Promise.resolve(callback());
	}
	return document.startViewTransition(callback).finished;
}
