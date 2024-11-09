import { json, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: varchar('id', { length: 255 }).primaryKey(),
	email: text('email').unique(),
	username: text('username').unique(),
	passwordHash: text('password_hash'),
	googleId: varchar('google_id', { length: 255 }).unique(),
	googleEmail: text('google_email').unique(),
	googleName: text('google_name'),
	googleAvatarUrl: text('google_avatar_url'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});
export type User = typeof user.$inferSelect;

export const session = pgTable('session', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});
export type Session = typeof session.$inferSelect;

export const problemSet = pgTable('problem_set', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	createAt: timestamp('create_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	content: json('content')
});
export type ProblemSet = typeof problemSet.$inferSelect;
