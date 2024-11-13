import { redirect } from '@sveltejs/kit';
import { generateCodeVerifier, generateState } from 'arctic';
import { google } from '@/server/oauth.js';

import type { CookieSerializeOptions } from 'cookie';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = google.createAuthorizationURL(state, codeVerifier, ['openid', 'profile', 'email']);

	const cookieOptions = {
		httpOnly: true,
		maxAge: 60 * 10,
		secure: import.meta.env.PROD,
		path: '/',
		sameSite: 'lax'
	} satisfies CookieSerializeOptions;

	event.cookies.set('google_oauth_state', state, cookieOptions);
	event.cookies.set('google_code_verifier', codeVerifier, cookieOptions);
	redirect(302, url.toString());
};
