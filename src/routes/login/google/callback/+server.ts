import { error, redirect } from '@sveltejs/kit';
import { ObjectParser } from '@pilcrowjs/object-parser';
import { decodeIdToken } from 'arctic';
import { google } from '@/server/oauth.js';
import {
	createSession,
	generateSessionToken,
	setSessionTokenCookie,
	createUserFromGoogleId,
	getUserIdFromGoogleId
} from '@/server/auth.js';

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
	} catch (e) {
		error(400, 'Please restart the process.');
	}

	const claims = decodeIdToken(tokens.idToken());
	const claimsParser = new ObjectParser(claims);

	const googleId = claimsParser.getString('sub');
	const name = claimsParser.getString('name');
	const picture = claimsParser.getString('picture');
	const email = claimsParser.getString('email');

	let userId = await getUserIdFromGoogleId(googleId);

	if (!userId) {
		userId = await createUserFromGoogleId(googleId, email, name, picture);
	}

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, userId);

	setSessionTokenCookie(event, sessionToken, session.expiresAt);
	redirect(302, '/');
};
