import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const tableUser = pgTable('user', {
	id: varchar('id', { length: 255 }).primaryKey(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	username: varchar('username', { length: 32 }).notNull().unique(),
	passwordHash: text('password_hash'),
	googleId: text('google_id').unique(),
	name: text('name'),
	avatarUrl: text('avatar_url'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'date' })
});

export type User = typeof tableUser.$inferSelect;
