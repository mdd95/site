import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth/minimal';
import { username } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { SECRET } from '$app/env/private';
import { ORIGIN } from '$app/env/public';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';

export const auth = betterAuth({
	baseURL: ORIGIN,
	secret: SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8
	},
	plugins: [
		username({
			minUsernameLength: 6,
			maxUsernameLength: 20
		}),
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
});
