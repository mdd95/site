import { fail, redirect } from '@sveltejs/kit';
import { createProblemSet } from '@/server/db';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	const user = locals.user;
	return { user };
};

export const actions: Actions = {
	default: async (event) => {
		const user = event.locals.user;
		if (!user) return fail(401);

		const { id } = await createProblemSet(user.id, []);
		redirect(302, `/probset/${id}`);
	}
};
