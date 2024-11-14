// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { SessionValidationResult } from '@/server/auth';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: SessionValidationResult['user'];
			session: SessionValidationResult['session'];
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}
