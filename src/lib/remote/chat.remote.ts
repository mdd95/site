import { generateId } from 'better-auth';
import { asc } from 'drizzle-orm';
import * as v from 'valibot';
import { form, getRequestEvent, query } from '$app/server';
import { db } from '$lib/server/db/index.js';
import { publicChatMessage } from '$lib/server/db/schema/index.js';

export const loadPublicChat = query(async () => {
	return await db.select().from(publicChatMessage).orderBy(asc(publicChatMessage.createdAt));
});

export const formPublicChat = form(
	v.object({
		content: v.pipe(v.string(), v.nonEmpty())
	}),
	async (data) => {
		const { locals } = getRequestEvent();

		if (!locals.user) {
			return { error: 'Requires sign in' };
		}

		await db.insert(publicChatMessage).values({
			id: generateId(),
			senderId: locals.user.id,
			content: data.content
		});
	}
);
