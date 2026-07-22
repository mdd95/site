import { redirect } from '@sveltejs/kit';
import { generateId } from 'better-auth';
import jwt from 'jsonwebtoken';
import { SECRET } from '$app/env/private';
import { form, getRequestEvent, query } from '$app/server';
import * as schema from '$lib/schema/form/auth.js';
import { auth } from '$lib/server/auth.js';
import { db } from '$lib/server/db/index.js';
import { userInfo } from '$lib/server/db/schema/index.js';

export const signInEmail = form(schema.signInEmail, async (data) => {
	try {
		await auth.api.signInEmail({ body: data });
		redirect(302, '/');
	} catch (err) {}
});

export const signUpEmail = form(schema.signUpEmail, async (data) => {
	try {
		const result = await auth.api.signUpEmail({ body: data });

		await db.insert(userInfo).values({
			id: generateId(),
			userId: result.user.id
		});
		redirect(302, '/');
	} catch (err) {}
});

export const signOut = form('unchecked', async () => {
	const { request } = getRequestEvent();

	try {
		await auth.api.signOut({
			headers: request.headers
		});
		redirect(302, '/signin');
	} catch (err) {}
});

export const getUser = query(async () => {
	const { request } = getRequestEvent();

	try {
		const result = await auth.api.getSession({
			headers: request.headers
		});

		if (!result) throw new Error();

		const { session, user } = result;
		const token = jwt.sign(user, SECRET);

		return { data: user, session, token };
	} catch (err) {}
});
