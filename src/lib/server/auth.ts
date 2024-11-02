import type { RequestEvent } from '@sveltejs/kit';

import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db/index.js';
import { tableUser, type User } from './db/schema/user.js';
import { tableSession, type Session } from './db/schema/session.js';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth_session';

export function generateId(length: number): string {
	return encodeBase64url(crypto.getRandomValues(new Uint8Array(length)));
}

export function generateSessionToken(): string {
	return generateId(18);
}

export async function createSession(token: string, userId: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
	};
	await db.insert(tableSession).values(session);
	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const [result] = await db
		.select({
			user: { id: tableUser.id, username: tableUser.username },
			session: tableSession
		})
		.from(tableSession)
		.innerJoin(tableUser, eq(tableSession.userId, tableUser.id))
		.where(eq(tableSession.id, sessionId));

	if (!result) {
		return { session: null, user: null };
	}
	const { session, user } = result;

	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		await db.delete(tableSession).where(eq(tableSession.id, session.id));
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await db
			.update(tableSession)
			.set({ expiresAt: session.expiresAt })
			.where(eq(tableSession.id, session.id));
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
	await db.delete(tableSession).where(eq(tableSession.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}

export async function createUserFromGoogleId(
	googleId: string,
	email: string,
	name: string,
	avatarUrl: string
) {
	const userId = generateId(15);
	const user = {
		id: userId,
		email,
		username: userId,
		googleId,
		name,
		avatarUrl
	};
	await db.insert(tableUser).values(user);
	return user;
}

export async function getUserFromGoogleId(googleId: string): Promise<User | null> {
	const [result] = await db.select().from(tableUser).where(eq(tableUser.googleId, googleId));
	if (!result) return null;
	return result;
}
