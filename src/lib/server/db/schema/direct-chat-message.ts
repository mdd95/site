import { sql } from 'drizzle-orm';
import { check, index, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const directChat = pgTable(
	'direct_chat',
	{
		id: text('id').primaryKey(),
		user1Id: text('user1_id')
			.notNull()
			.references(() => user.id),
		user2Id: text('user2_id')
			.notNull()
			.references(() => user.id),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		uniqueIndex('direct_chat_unique_pair').on(table.user1Id, table.user2Id),
		check('direct_chat_no_self', sql`${table.user1Id} <> ${table.user2Id}`),
		index('direct_chat_user1_idx').on(table.user1Id),
		index('direct_chat_user2_idx').on(table.user2Id),
		index('direct_chat_updated_at_idx').on(table.updatedAt)
	]
);

export const directChatMessage = pgTable(
	'direct_chat_message',
	{
		id: text('id').primaryKey(),
		chatId: text('chat_id')
			.notNull()
			.references(() => directChat.id, { onDelete: 'cascade' }),
		senderId: text('sender_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		content: text('content').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [
		index('direct_chat_message_chat_idx').on(table.chatId),
		index('direct_chat_message_created_at_idx').on(table.chatId, table.createdAt),
		index('direct_chat_message_sender_idx').on(table.senderId)
	]
);
