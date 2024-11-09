import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const result = await parent();
	if (locals.user === null || locals.user.id !== result.userId) {
		throw error(401, 'Unauthorized');
	}
	return result;
};
