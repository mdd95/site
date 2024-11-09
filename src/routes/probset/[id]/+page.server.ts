import { getProblemSetById } from '@/server/db';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const result = await getProblemSetById(params.id);
	if (result === undefined) {
		error(404, 'Not found');
	}
	return result;
};
