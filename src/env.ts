import { defineEnvVars } from '@sveltejs/kit/hooks';

export const variables = defineEnvVars({
	ORIGIN: {
		public: false
	},
	DATABASE_URL: {
		public: false
	},
	BETTER_AUTH_SECRET: {
		public: false
	}
});
