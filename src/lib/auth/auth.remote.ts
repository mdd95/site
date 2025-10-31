import * as argon2 from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { command, form, getRequestEvent, query } from '$app/server';
import { db } from '../server/db/index.js';
import * as table from '../server/db/schema.js';
import * as auth from './auth.js';
import * as schema from './schema.js';

const hashConfig = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1,
};

export const login = form(schema.login, async (data) => {
	const [result] = await db.select().from(table.users).where(eq(table.users.email, data.email));
	if (!result) {
		return { error: 'Cannot find user!' };
	}
	if (!(await argon2.verify(result.passwordHash, data.password, hashConfig))) {
		return { error: 'Password is invalid!' };
	}
	const event = getRequestEvent();
	const sessionToken = auth.generateSessionToken();
	const session = await auth.createSession(event, sessionToken, result.id);
	auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
});

export const signup = form(schema.signup, async (data) => {
	const [result] = await db
		.insert(table.users)
		.values({
			username: data.username,
			email: data.email,
			passwordHash: await argon2.hash(data.password, hashConfig),
		})
		.returning({
			id: table.users.id,
		});
	if (!result) {
		return { error: 'Cannot create user!' };
	}
	const event = getRequestEvent();
	const sessionToken = auth.generateSessionToken();
	const session = await auth.createSession(event, sessionToken, result.id);
	auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return { user: result, session };
});

export const logout = command(async () => {
	const event = getRequestEvent();
	if (!event.locals.session) {
		return { error: '' };
	}
	await auth.invalidateSession(event.locals.session.id);
	auth.deleteSessionTokenCookie(event);

	event.locals.session = null;
	event.locals.user = null;

	user().refresh();
});

export const user = query(() => {
	const event = getRequestEvent();
	return {
		user: event.locals.user,
		session: event.locals.session,
	};
});
