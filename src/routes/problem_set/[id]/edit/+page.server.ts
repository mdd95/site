import { error, fail } from '@sveltejs/kit';
import { hash } from '@node-rs/argon2';
import { and, eq } from 'drizzle-orm';
import { db, table } from '@/server/db/index.js';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!(event.locals.user && event.locals.session)) {
		error(401, 'Unauthorized');
	}

	const result = await db
		.select()
		.from(table.problemSet)
		.where(
			and(
				eq(table.problemSet.id, event.params.id),
				eq(table.problemSet.userId, event.locals.user.id)
			)
		);
	const data = result.at(0);

	if (data) {
		return { result: data };
	}
	error(404, 'Not Found');
};

export const actions: Actions = {
	updatePassword: async (event) => {
		if (!(event.locals.user && event.locals.session)) {
			error(401, 'Unauthorized');
		}

		const formData = await event.request.formData();
		const password = formData.get('password');

		if (!(typeof password === 'string' && password.length >= 6 && password.length < 255)) {
			return fail(400);
		}

		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		await db
			.update(table.problemSet)
			.set({ passwordHash })
			.where(
				and(
					eq(table.problemSet.id, event.params.id),
					eq(table.problemSet.userId, event.locals.user.id)
				)
			);
	}
};
