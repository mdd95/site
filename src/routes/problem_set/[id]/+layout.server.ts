import { error } from '@sveltejs/kit';
import { getProblemSetById } from '@/server/db';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
	const result = await getProblemSetById(params.id);
	if (result === undefined) {
		throw error(404, 'Not found');
	}
	return result;
};
