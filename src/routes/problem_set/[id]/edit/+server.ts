import { getProblemSetById, updateProblemSet } from '@/server/db';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async (event) => {
	if (event.locals.user === null) {
		return new Response('Unauthorized', { status: 401 });
	}
	const result = await getProblemSetById(event.params.id);
	if (result === undefined) {
		return new Response('Not found', { status: 404 });
	}
	if (result.userId !== event.locals.user.id) {
		return new Response('Unauthorized', { status: 401 });
	}

	await updateProblemSet(event.params.id, await event.request.json());
	return new Response('OK');
};
