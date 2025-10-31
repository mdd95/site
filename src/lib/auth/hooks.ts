import * as session from './session.js';
import type { Handle } from '@sveltejs/kit';

export const hooks: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(session.KEY);

	if (!token) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const result = await session.validate(token);
	if (result && result.session) {
		session.setCookie(event, token, result.session.expiresAt);
	} else {
		session.deleteCookie(event);
	}

	event.locals.session = result.session;
	event.locals.user = result.user;
	return resolve(event);
};
