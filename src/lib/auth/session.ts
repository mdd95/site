import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '../server/db/index.js';
import * as table from '../server/db/schema/index.js';
import type { RequestEvent } from '@sveltejs/kit';

export const KEY = 'auth_session_token';
const DAY = 1000 * 60 * 60 * 24;

export function generateToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	return encodeBase64url(bytes);
}

export function encodeId(token: string) {
	return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

export async function create(event: RequestEvent, token: string, userId: string) {
	const [result] = await db
		.insert(table.sessions)
		.values({
			id: encodeId(token),
			userId,
			expiresAt: new Date(Date.now() + DAY * 30),
			ipAddress: event.getClientAddress(),
		})
		.returning({
			id: table.sessions.id,
			userId: table.sessions.userId,
			expiresAt: table.sessions.expiresAt,
		});

	return result;
}

export async function validate(token: string) {
	const sessionId = encodeId(token);

	const [result] = await db
		.select({
			user: {
				id: table.users.id,
				username: table.users.username,
				email: table.users.email,
				bio: table.users.bio,
				birthdate: table.users.birthdate,
			},
			session: {
				id: table.sessions.id,
				userId: table.sessions.userId,
				expiresAt: table.sessions.expiresAt,
			},
		})
		.from(table.sessions)
		.innerJoin(table.users, eq(table.sessions.userId, table.users.id))
		.where(eq(table.sessions.id, sessionId));

	if (!result) {
		return { session: null, user: null };
	}

	// Session expired
	if (Date.now() >= result.session.expiresAt.getTime()) {
		await db.delete(table.sessions).where(eq(table.sessions.id, sessionId));
		return { session: null, user: null };
	}

	// Refresh token
	if (Date.now() >= result.session.expiresAt.getTime() + DAY * 30) {
		result.session.expiresAt = new Date(Date.now() + DAY * 30);
		await db
			.update(table.sessions)
			.set({
				expiresAt: result.session.expiresAt,
			})
			.where(eq(table.sessions.id, sessionId));
	}

	return result;
}

export type Locals = Awaited<ReturnType<typeof validate>>;

export async function invalidate(sessionId: string) {
	await db.delete(table.sessions).where(eq(table.sessions.id, sessionId));
}

export function setCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(KEY, token, {
		expires: expiresAt,
		path: '/',
	});
}

export function deleteCookie(event: RequestEvent) {
	event.cookies.delete(KEY, {
		path: '/',
	});
}
