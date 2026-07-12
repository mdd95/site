import { svelteKitHandler } from 'better-auth/svelte-kit';
import jwt from 'jsonwebtoken';
import { building } from '$app/env';
import { SECRET } from '$app/env/private';
import { auth } from '$lib/server/auth.js';
import type { Handle } from '@sveltejs/kit';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;

		const token = jwt.sign(session.user, SECRET, { expiresIn: '1h' });
		event.cookies.set('app.token', token, { path: '/' });
	}
	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = handleBetterAuth;
