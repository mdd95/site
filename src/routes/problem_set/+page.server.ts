import { fail, redirect } from '@sveltejs/kit';
import { table } from '@/server/db/index.js';

import type { Actions, PageServerLoad } from './$types';
import type { ProblemSetData } from './query';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return { user: null, result: null };
	}

	const response = await event.fetch('/problem_set?limit=20&offset=0', {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		}
	});
	const result: ProblemSetData[] = await response.json();
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
