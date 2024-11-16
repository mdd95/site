import { and, eq, inArray } from 'drizzle-orm';
import { error, json } from '@sveltejs/kit';
import { generateId } from '@/server/utils.js';
import { db } from '@/server/db/index.js';
import * as table from '@/server/db/schema.js';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	if (!event.locals.user) error(401, 'Unauthorized');

	let result;

	try {
		result = await db
			.select()
			.from(table.problemSet)
			.where(eq(table.problemSet.userId, event.locals.user.id))
			.limit(20);
	} catch (err) {
		error(500, 'Internal server error');
	}

	if (!result) error(404, 'Not found');
	return json(result);
};

export const POST: RequestHandler = async (event) => {
	if (!event.locals.user) error(401, 'Unauthorized');

	let result;

	try {
		result = await db
			.insert(table.problemSet)
			.values({
				id: generateId(18),
				userId: event.locals.user.id
			})
			.returning();
	} catch (err) {
		error(500, 'Internal server error');
	}
	return json(result);
};

export const DELETE: RequestHandler = async (event) => {
	if (!event.locals.user) error(401, 'Unauthorized');

	const data = await event.request.json();
	const id = data.id as string | string[] | undefined;

	if (!id) error(400, 'Bad request');
	let result;

	try {
		if (typeof id === 'string') {
			result = await db
				.delete(table.problemSet)
				.where(
					and(
						eq(table.problemSet.userId, event.locals.user.id),
						eq(table.problemSet.id, id)
					)
				)
				.returning();
		} else if (Array.isArray(id)) {
			result = await db
				.delete(table.problemSet)
				.where(
					and(
						eq(table.problemSet.userId, event.locals.user.id),
						inArray(table.problemSet.id, id)
					)
				)
				.returning();
		}
	} catch (err) {
		error(500, 'Internal server error');
	}

	if (!result) error(404, 'Not found');
	return json(result);
};
