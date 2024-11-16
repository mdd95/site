import { fail, redirect } from '@sveltejs/kit';
import { table } from '@/server/db/index.js';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return { user: null, result: null };
	}

	const response = await event.fetch('/problem_set', {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		}
	});
	const result: table.ProblemSet[] = await response.json();

	return { user: event.locals.user, result };
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		let result: table.ProblemSet;

		try {
			const response = await event.fetch('/problem_set', {
				method: 'POST'
			});
			[result] = await response.json();
		} catch (err) {
			return fail(500, { message: 'Internal server error' });
		}
		redirect(302, `/problem_set/${result.id}/edit`);
	}
};
