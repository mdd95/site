import { generateId } from 'better-auth';
import * as v from 'valibot';
import { form, getRequestEvent, query } from '$app/server';
import { db } from '$lib/server/db/index.js';
import { publicChatMessage } from '$lib/server/db/schema/public-chat-message.js';

export const getMessages = query(async () => {
	return await db.select().from(publicChatMessage);
});

export const sendMessage = form(
	v.object({
		content: v.pipe(v.string(), v.minLength(1))
	}),
	async (data) => {
		const { locals } = getRequestEvent();
		if (locals.user) {
			const result = await db
				.insert(publicChatMessage)
				.values({
					id: generateId(),
					senderId: locals.user.id,
					content: data.content
				})
				.returning();
			return { data: result[0] };
		}
		void getMessages().refresh();
	}
);
