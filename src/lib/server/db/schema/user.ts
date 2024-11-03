import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const tableUser = pgTable('user', {
	id: text('id').primaryKey(),
	email: text('email').unique(),
	username: text('username').unique(),
	passwordHash: text('password_hash'),
	googleId: text('google_id').unique(),
	googleEmail: text('google_email').unique(),
	googleName: text('google_name'),
	googleAvatarUrl: text('google_avatar_url'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export type User = typeof tableUser.$inferSelect;
