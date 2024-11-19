import { and, eq } from 'drizzle-orm';
import { error, json } from '@sveltejs/kit';
import { db, table } from '@/server/db/index.js';
import { query } from '../query.js';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	let result;

	try {
		result = await db
			.select(query)
			.from(table.problemSet)
			.where(eq(table.problemSet.id, event.params.id));
	} catch (err) {
		error(500, 'Internal server error');
	}
	return json(result);
};

export const PATCH: RequestHandler = async (event) => {
	if (!event.locals.user) error(401, 'Unauthorized');

	const data = await event.request.json();
	let result;

	try {
		result = await db
			.update(table.problemSet)
			.set(data)
			.where(
				and(
					eq(table.problemSet.id, event.params.id),
					eq(table.problemSet.userId, event.locals.user.id)
				)
			)
			.returning(query);
	} catch (err) {
		error(500, 'Internal server error');
	}
	if (!result) error(404, 'Not found');
	return json(result);
};

export const DELETE: RequestHandler = async (event) => {
	if (!event.locals.user) error(401, 'Unauthorized');

	let result;

	try {
		result = await db
			.delete(table.problemSet)
			.where(
				and(
					eq(table.problemSet.id, event.params.id),
					eq(table.problemSet.userId, event.locals.user.id)
				)
			)
			.returning(query);
	} catch (err) {
		error(500, 'Internal server error');
	}
	if (!result) error(404, 'Not found');
	return json(result);
};
