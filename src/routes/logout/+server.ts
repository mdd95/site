import { redirect } from '@sveltejs/kit';
import * as auth from '@/server/auth.js';

export async function POST(event) {
	if (event.locals.session === null) {
		redirect(302, '/');
	}
	await auth.invalidateSession(event.locals.session.id);
	auth.deleteSessionTokenCookie(event);
	return redirect(302, '/');
}
