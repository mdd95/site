import { fail, redirect } from '@sveltejs/kit';
import { createProblemSet, getProblemSetList } from '@/server/db';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (locals.user !== null) {
		const result = await getProblemSetList(locals.user.id);
		return { user, result };
	}
	return { user: null, result: null };
};

export const actions: Actions = {
	default: async (event) => {
		const user = event.locals.user;
		if (!user) return fail(401);

		const { id } = await createProblemSet(user.id, []);
		redirect(302, `/probset/${id}`);
	}
};
