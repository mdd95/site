import { eq } from 'drizzle-orm';
import { db, table } from '@/server/db/index.js';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const result = await db
		.select()
		.from(table.problemSet)
		.where(eq(table.problemSet.id, event.params.id));

	const data = result.at(0);

	if (data && data.isPublished) {
		return data;
	}
	return {};
};
