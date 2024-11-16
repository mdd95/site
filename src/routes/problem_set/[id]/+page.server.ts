import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const response = await event.fetch(`/problem_set/${event.params.id}`, {
		method: 'GET',
		headers: {
			Accept: 'application/json'
		}
	});
	const [result] = await response.json();

	if (!result) error(404, 'Not found');
	return { result };
};
