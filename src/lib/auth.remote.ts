import { eq } from 'drizzle-orm';
import * as v from 'valibot';
import * as p from '@node-rs/argon2';
import { form, getRequestEvent } from '$app/server';
import { db } from '$lib/server/db/index.js';
import * as table from '$lib/server/db/schema.js';
import * as auth from '$lib/server/auth.js';
import { redirect } from '@sveltejs/kit';

export const loginWithPassword = form(
	v.object({
		email: v.pipe(v.string(), v.email()),
		password: v.string(),
	}),
	async (data) => {
		const [result] = await db
			.select()
			.from(table.users)
			.where(eq(table.users.email, data.email));
		if (!result) {
			return { error: 'Cannot find user!' };
		}
		const isPasswordValid = p.verify(result.passwordHash, data.password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1,
		});
		if (!isPasswordValid) {
			return { error: 'Password is invalid!' };
		}
		const event = getRequestEvent();
		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(event, sessionToken, result.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		redirect(303, '/dashboard');
	}
);
