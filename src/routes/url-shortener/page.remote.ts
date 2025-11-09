import { eq } from 'drizzle-orm';
import * as v from 'valibot';
import { form, getRequestEvent, query } from '$app/server';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export const getAllRecords = query(async () => {
	const event = getRequestEvent();
	if (!event.locals.user || event.locals.user.role !== 'admin') {
		return;
	}
	return await db.select().from(table.shortUrls);
});

export const getRecords = query(async () => {
	const event = getRequestEvent();

	if (!event.locals.user) {
		return;
	}

	return await db
		.select()
		.from(table.shortUrls)
		.where(eq(table.shortUrls.userId, event.locals.user.id));
});

export const create = form(
	v.object({
		longUrl: v.pipe(v.string(), v.url()),
		slug: v.pipe(v.string(), v.minLength(4)),
	}),
	async (data) => {
		const event = getRequestEvent();

		if (!event.locals.user) {
			return;
		}

		const [record] = await db
			.insert(table.shortUrls)
			.values({
				userId: event.locals.user.id,
				longUrl: data.longUrl,
				slug: data.slug,
			})
			.returning();

		return { ...record };
	}
);
