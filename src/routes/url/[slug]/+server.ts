import { eq } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const [record] = await db
		.select({
			longUrl: table.shortUrls.longUrl,
		})
		.from(table.shortUrls)
		.where(eq(table.shortUrls.slug, params.slug));

	if (!record) {
		error(404);
	}
	redirect(303, record.longUrl);
};
