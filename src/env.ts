import { defineEnvVars } from '@sveltejs/kit/hooks';

export const variables = defineEnvVars({
	DATABASE_URL: {
		public: false
	},
	ORIGIN: {
		public: true
	},
	SECRET: {
		public: false
	}
});
