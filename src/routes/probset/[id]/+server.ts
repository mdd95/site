import { error } from '@sveltejs/kit';
import { deleteProbSetById } from '@/server/db/index.js';

import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async (event) => {
	if (!event.locals.user) error(401, 'Unauthorized');

	await deleteProbSetById(event.locals.user, event.params.id);
	return new Response(null, { status: 200 });
};
