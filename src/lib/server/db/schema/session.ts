import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { tableUser } from './user';

export const tableSession = pgTable('session', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id')
		.notNull()
		.references(() => tableUser.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export type Session = typeof tableSession.$inferSelect;
