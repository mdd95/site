import { defineEnvVars } from '@sveltejs/kit/env';
import * as v from 'valibot';

export const variables = defineEnvVars({
	DATABASE_URL: {
		description: 'Connection string for postgres database',
		public: false,
		schema: v.pipe(v.string(), v.startsWith('postgres://')),
		static: true
	},
	ORIGIN: {
		description: 'Public base URL of the application',
		public: true,
		schema: v.pipe(v.string(), v.url()),
		static: true
	},
	SECRET: {
		description: 'Secret key for signing cryptographic tokens',
		public: false,
		schema: v.pipe(v.string(), v.minLength(32)),
		static: true
	}
});
