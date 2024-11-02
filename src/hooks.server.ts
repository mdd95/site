import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import { TokenBucket } from '$lib/server/rate-limit.js';
import { sequence } from '@sveltejs/kit/hooks';

const bucket = new TokenBucket<string>(100, 1);

const handleRateLimit: Handle = async ({ event, resolve }) => {
	const clientIp = event.request.headers.get('X-Forwarded-For');
	if (!clientIp) return resolve(event);

	const cost = event.request.method === 'GET' || event.request.method === 'OPTIONS' ? 1 : 3;
	if (!bucket.consume(clientIp, cost)) {
		return new Response('Too many requests', { status: 429 });
	}
	return resolve(event);
};

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handle = sequence(handleRateLimit, handleAuth);
