import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './schema/auth';

export const chatRoom = pgTable('chat_room', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	createdBy: text('created_by')
		.notNull()
		.references(() => user.id)
});

export const chatRoomParticipant = pgTable(
	'chat_room_participant',
	{
		roomId: text('room_id')
			.notNull()
			.references(() => chatRoom.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		joinedAt: timestamp('joined_at').defaultNow().notNull()
	},
	(table) => [
		primaryKey({
			columns: [table.roomId, table.userId]
		})
	]
);

export const chatMessage = pgTable('chat_message', {
	id: text('id').primaryKey(),
	roomId: text('room_id')
		.notNull()
		.references(() => chatRoom.id, { onDelete: 'cascade' }),
	senderId: text('sender_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const chatRoomRelations = relations(chatRoom, ({ many, one }) => ({
	messages: many(chatMessage),
	participants: many(chatRoomParticipant),
	creator: one(user, {
		fields: [chatRoom.createdBy],
		references: [user.id]
	})
}));

export const chatRoomParticipantRelations = relations(chatRoomParticipant, ({ one }) => ({
	room: one(chatRoom, {
		fields: [chatRoomParticipant.roomId],
		references: [chatRoom.id]
	}),
	user: one(user, {
		fields: [chatRoomParticipant.userId],
		references: [user.id]
	})
}));

export const chatMessageRelations = relations(chatMessage, ({ one }) => ({
	room: one(chatRoom, {
		fields: [chatMessage.roomId],
		references: [chatRoom.id]
	}),
	sender: one(user, {
		fields: [chatMessage.senderId],
		references: [user.id]
	})
}));

export * from './schema/auth';
export * from './schema/direct-chat-message';
export * from './schema/public-chat-message';
export * from './schema/user-info';
