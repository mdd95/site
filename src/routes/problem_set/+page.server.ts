import { error, fail, redirect } from '@sveltejs/kit';
import { generateId } from '@/server/utils.js';
import { db } from '@/server/db/index.js';
import * as table from '@/server/db/schema.js';

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
	const result = await response.json();

	return { user: event.locals.user, result };
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const data = {
			id: generateId(18),
			userId: event.locals.user.id,
			title: ''
		};

		try {
			const r = await db.insert(table.problemSet).values(data);
			console.log(r);
		} catch (err) {
			error(500, 'Internal server error');
		}
		redirect(302, `/problem_set/${data.id}/edit`);
	}
};
