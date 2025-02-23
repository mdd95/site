// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				COUNTER: DurableObjectNamespace;
			};
			context: {
				waitUntil: (promise: Promise<any>) => void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}

	declare module '*.svx' {
		const component: import('svelte').Component;
		export default component;
		export const metadata: Record<string, unknown>;
	}
}

export {};
