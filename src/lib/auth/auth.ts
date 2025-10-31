import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';
import { db } from '../server/db/index.js';
import * as table from '../server/db/schema.js';
import type { Handle, RequestEvent } from '@sveltejs/kit';

const sessionCookieName = 'auth_session_token';
const DAY = 1000 * 60 * 60 * 24;

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	return encodeBase64url(bytes);
}

export function getSessionId(token: string) {
	return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

export async function createSession(event: RequestEvent, token: string, userId: string) {
	const sessionId = getSessionId(token);
	const session = {
		id: sessionId,
		userId,
		createdAt: new Date(),
		expiresAt: new Date(Date.now() + DAY * 30),
	};
	await db.insert(table.sessions).values(session);
	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = getSessionId(token);
	const [result] = await db
		.select({
			user: {
				username: table.users.username,
				email: table.users.email,
			},
			session: table.sessions,
		})
		.from(table.sessions)
		.innerJoin(table.users, eq(table.sessions.userId, table.users.id))
		.where(eq(table.sessions.id, sessionId));
	if (!result) {
		return { session: null, user: null };
	}
	if (Date.now() >= result.session.expiresAt.getTime()) {
		await db.delete(table.sessions).where(eq(table.sessions.id, sessionId));
		return { session: null, user: null };
	}
	if (Date.now() >= result.session.expiresAt.getTime() + 30 * DAY) {
		result.session.expiresAt = new Date(Date.now() + 30 * DAY);
		await db
			.update(table.sessions)
			.set({
				expiresAt: result.session.expiresAt,
			})
			.where(eq(table.sessions.id, sessionId));
	}
	return result;
}
export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
	await db.delete(table.sessions).where(eq(table.sessions.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/',
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, { path: '/' });
}

export const hooks: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}
	const { session, user } = await validateSessionToken(sessionToken);
	if (session) {
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		deleteSessionTokenCookie(event);
	}

	event.locals.session = session;
	event.locals.user = user;
	return resolve(event);
};
