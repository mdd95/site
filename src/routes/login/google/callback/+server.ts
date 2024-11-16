import { error, redirect } from '@sveltejs/kit';
import { decodeIdToken } from 'arctic';
import { eq } from 'drizzle-orm';
import { db, table, generateId } from '@/server/db/index.js';
import { createSession, generateSessionToken, setSessionTokenCookie } from '@/server/auth.js';
import { google } from '@/server/oauth.js';

import type { OAuth2Tokens } from 'arctic';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const storedState = event.cookies.get('google_oauth_state');
	const codeVerifier = event.cookies.get('google_code_verifier');
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');

	if (!storedState || !codeVerifier || !code || !state) {
		error(400, 'Please restart the process.');
	}
	if (storedState !== state) {
		error(400, 'Please restart the process.');
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (err) {
		error(400, 'Please restart the process.');
	}

	type GoogleUser = {
		sub: string;
		name: string;
		picture: string;
		email: string;
		given_name: string;
		family_name: string;
	};

	const info = decodeIdToken(tokens.idToken()) as GoogleUser;

	let user: table.User;

	try {
		[user] = await db.select().from(table.user).where(eq(table.user.googleId, info.sub));

		if (!user) {
			[user] = await db
				.insert(table.user)
				.values({
					id: generateId(15),
					googleId: info.sub,
					googleEmail: info.email,
					googleName: info.name,
					googleAvatarUrl: info.picture
				})
				.returning();
		}
	} catch (err) {
		error(500, 'Internal server error');
	}
	if (!user) {
		error(500, 'Internal server error');
	}

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);

	setSessionTokenCookie(event, sessionToken, session.expiresAt);
	redirect(302, '/');
};
