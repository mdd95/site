import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';

export const sessions = pgTable('sessions', {
	id: varchar('id', { length: 64 }).primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
	ipAddress: varchar('ip_address', { length: 45 }),
	userAgent: varchar('user_agent', { length: 512 }),
});

export const sessionRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));
