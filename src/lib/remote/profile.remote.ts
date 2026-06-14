import { eq } from 'drizzle-orm';
import * as v from 'valibot';
import { form, getRequestEvent, query } from '$app/server';
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
			return RequestError.notFound();
		}

		return { data: result.at(0)! };
	} catch (err) {
		return RequestError.internalServerError();
	}
});

type QueryData<T extends (...args: never[]) => unknown> =
	Awaited<ReturnType<T>> extends { data: infer D } | { error: unknown } ? NonNullable<D> : never;

export type UserProfile = QueryData<typeof getUserProfile>;

export const updateUserProfile = form(
	v.object({
		email: v.pipe(v.string(), v.email()),
		name: v.pipe(v.string(), v.maxLength(64)),
		avatarUrl: v.string(),
		coverUrl: v.string(),
		bio: v.pipe(v.string(), v.maxLength(200))
	}),
	async (data) => {
		const { locals } = getRequestEvent();

		if (!locals.user) {
			return RequestError.forbidden();
		}

		try {
			await Promise.all([
				db
					.update(user)
					.set({
						email: data.email,
						name: data.name
					})
					.where(eq(user.id, locals.user.id)),
				db
					.update(userInfo)
					.set({
						bio: data.bio,
						coverUrl: data.coverUrl,
						avatarUrl: data.avatarUrl
					})
					.where(eq(userInfo.userId, locals.user.id))
			]);
		} catch (err) {
			return RequestError.internalServerError();
		}
	}
);
