import { fail, redirect } from '@sveltejs/kit';
import { login } from '$lib/schema.js';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, url }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const validate = login.safeParse({ email, password });

		if (!validate.success) {
			return fail(400);
		}

		// const redirectUrl = url.searchParams.get('r');
		// return redirect(302, redirectUrl || '/');
	}
};
