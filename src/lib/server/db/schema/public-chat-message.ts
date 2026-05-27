import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const publicChatMessage = pgTable('public_chat_message', {
	id: text('id').primaryKey(),
	senderId: text('sender_id').notNull(),
	content: text('content').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const publicChatMessageRelations = relations(publicChatMessage, ({ one }) => ({
	sender: one(user, {
		fields: [publicChatMessage.senderId],
		references: [user.id]
	})
}));
