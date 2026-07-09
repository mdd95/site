import { defineEnvVars } from '@sveltejs/kit/hooks';

export const variables = defineEnvVars({
	SECRET: {
		public: false
	},
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
