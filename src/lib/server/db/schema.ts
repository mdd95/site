import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	username: varchar('username', { length: 50 }).notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	isActive: boolean('is_active').default(true).notNull(),
	isDeleted: boolean('is_deleted').default(false).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const sessions = pgTable('sessions', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	ipAddress: varchar('ip_address', { length: 45 }),
	userAgent: text('user_agent'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;

export const userRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));
