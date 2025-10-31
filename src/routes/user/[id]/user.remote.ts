import { eq } from 'drizzle-orm';
import * as v from 'valibot';
import { query } from '$app/server';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export const user = query(v.string(), async (username) => {
	const [result] = await db
		.select({
			username: table.users.username,
			birthdate: table.users.birthdate,
			bio: table.users.bio,
		})
		.from(table.users)
		.where(eq(table.users.username, username));

	return result;
});
