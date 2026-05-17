// import { redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth';
import * as v from 'valibot';
import { form } from '$app/server';
import { auth } from './server/auth.js';

export const signInEmail = form(
	v.object({
		email: v.pipe(v.string(), v.email()),
		password: v.string()
	}),
	async (data) => {
		try {
			await auth.api.signInEmail({
				body: {
					email: data.email,
					password: data.password
				}
			});
		} catch (err) {
			return handleAuthError(err);
		}
		// redirect(302, '');
	}
);

export const signUpEmail = form(
	v.pipe(
		v.object({
			email: v.pipe(v.string(), v.email()),
			password: v.string(),
			passwordConfirm: v.string()
		}),
		v.forward(
			v.partialCheck(
				[['password'], ['passwordConfirm']],
				(data) => data.password === data.passwordConfirm,
				'Passwords do not match'
			),
			['passwordConfirm']
		)
	),
	async (data) => {
		try {
			await auth.api.signUpEmail({
				body: {
					email: data.email,
					password: data.password,
					name: ''
				}
			});
		} catch (err) {
			return handleAuthError(err);
		}
	}
);

function handleAuthError(err: unknown) {
	if (err instanceof APIError) {
		return { user: null, error: { status: err.statusCode, message: err.body?.message } };
	}
	return { user: null, error: { status: 500, message: 'Internal server error' } };
}
