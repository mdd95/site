import { fail } from '@sveltejs/kit';
import { createProblemSet } from '@/server/db';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = (event) => {
	return { user: null };
};

export const actions: Actions = {
	default: async (event) => {
		const user = event.locals.user;
		if (!user) return fail(401);

		await createProblemSet(user.id, []);
	}
};
