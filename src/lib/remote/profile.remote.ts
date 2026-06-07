import { eq } from 'drizzle-orm';
import * as v from 'valibot';
import { query } from '$app/server';
import { db } from '$lib/server/db/index.js';
import { user } from '$lib/server/db/schema/auth.js';
import { userInfo } from '$lib/server/db/schema/user-info.js';

export const getUserProfile = query(v.string(), async (username) => {
	const result = await db
		.select()
		.from(user)
		.leftJoin(userInfo, eq(user.id, userInfo.userId))
		.where(eq(user.username, username));

	return result.at(0);
});
