import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { tableUser } from './user';

export const tableSession = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => tableUser.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export type Session = typeof tableSession.$inferSelect;
