import { json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db, table } from '@/server/db/index.js';

import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async (event) => {
	if (!(event.locals.user && event.locals.session)) {
		return new Response('Unauthorized', { status: 401 });
	}
	const body = await event.request.json();

	const result = await db
		.update(table.problemSet)
		.set(body)
		.where(
			and(
				eq(table.problemSet.id, event.params.id),
				eq(table.problemSet.userId, event.locals.user.id)
			)
		)
		.returning();

	const data = result.at(0);

	if (data) return json(data);
	return new Response('Not Found', { status: 404 });
};

export const DELETE: RequestHandler = async (event) => {
	if (!(event.locals.user && event.locals.session)) {
		return new Response('Unauthorized', { status: 401 });
	}

	const result = await db
		.delete(table.problemSet)
		.where(
			and(
				eq(table.problemSet.id, event.params.id),
				eq(table.problemSet.userId, event.locals.user.id)
			)
		)
		.returning();

	const data = result.at(0);

	if (data) return json(data);
	return new Response('Not Found', { status: 404 });
};
