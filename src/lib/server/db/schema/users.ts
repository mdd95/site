import { relations } from 'drizzle-orm';
import { boolean, date, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { sessions } from './sessions';

export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'moderator']);

export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
	email: varchar('email', { length: 320 }).notNull().unique(),
	username: varchar('username', { length: 50 }).notNull().unique(),
	passwordHash: varchar('password_hash', { length: 128 }).notNull(),
	bio: varchar('bio', { length: 512 }),
	birthdate: date('birthdate'),
	isDeactivated: boolean('is_deactivated').default(false).notNull(),
	deactivatedAt: timestamp('deactivated_at', { withTimezone: true }),
	isBanned: boolean('is_banned').default(false).notNull(),
	bannedAt: timestamp('banned_at', { withTimezone: true }),
	isDeleted: boolean('is_deleted').default(false).notNull(),
	deletedAt: timestamp('deleted_at', { withTimezone: true }),
	lastLogin: timestamp('last_login', { withTimezone: true }),
	role: userRoleEnum('role').default('user').notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
}));
