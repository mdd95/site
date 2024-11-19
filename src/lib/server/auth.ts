import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { db, table, generateId } from './db/index.js';

import type { RequestEvent } from '@sveltejs/kit';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth_session';

export function generateSessionToken(): string {
	return generateId(18);
}

// prettier-ignore
export const userQuery = {
	id:              table.user.id,
	role:            table.user.role,
	email:           table.user.email,
	username:        table.user.username,
	googleId:        table.user.googleId,
	googleEmail:     table.user.googleEmail,
	googleName:      table.user.googleName,
	googleAvatarUrl: table.user.googleAvatarUrl,
	createdAt:       table.user.createdAt
}

export async function createSession(token: string, userId: string): Promise<table.Session | null> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const [session] = await db
		.insert(table.session)
		.values({
			id: sessionId,
			userId,
			expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
		})
		.returning();

	if (!session) return null;
	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const [result] = await db
		.select({
			user: userQuery,
			session: table.session
		})
		.from(table.session)
		.innerJoin(table.user, eq(table.session.userId, table.user.id))
		.where(eq(table.session.id, sessionId));

	if (!result) {
		return { session: null, user: null };
	}
	const { session, user } = result;

	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(table.session).where(eq(table.session.id, session.id));
		return { session: null, user: null };
	}

	if (Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await db
			.update(table.session)
			.set({
				lastRefreshAt: new Date(),
				expiresAt: session.expiresAt
			})
			.where(eq(table.session.id, session.id));
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
	await db.delete(table.session).where(eq(table.session.id, sessionId));
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
