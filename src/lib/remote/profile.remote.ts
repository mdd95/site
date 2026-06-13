import { eq } from 'drizzle-orm';
import * as v from 'valibot';
import { query } from '$app/server';
import { db } from '$lib/server/db/index.js';
import { user, userInfo } from '$lib/server/db/schema/index.js';
import { RequestError } from '$lib/request-error.js';

export const getUserProfile = query(v.string(), async (username) => {
	try {
		const result = await db
			.select()
			.from(user)
			.leftJoin(userInfo, eq(user.id, userInfo.userId))
			.where(eq(user.username, username));

		if (result.length === 0) {
			return { error: RequestError.notFound() };
		}

		return { data: result.at(0)! };
	} catch (err) {
		return { error: RequestError.internalServerError() };
	}
});

type QueryData<T extends (...args: never[]) => unknown> =
	Awaited<ReturnType<T>> extends { data: infer D } | { error: unknown } ? NonNullable<D> : never;

export type UserProfile = QueryData<typeof getUserProfile>;
