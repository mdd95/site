import * as v from 'valibot';
import { form, query } from '$app/server';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export const records = query(async () => {
	return await db.select().from(table.shortUrls);
});

export const create = form(
	v.object({
		longUrl: v.pipe(v.string(), v.url()),
		slug: v.pipe(v.string(), v.minLength(4)),
	}),
	async (data) => {
		const [record] = await db
			.insert(table.shortUrls)
			.values({
				longUrl: data.longUrl,
				slug: data.slug,
			})
			.returning();

		return { ...record };
	}
);
