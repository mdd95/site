import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';
import { relations } from 'drizzle-orm';

export const shortUrls = pgTable('short_urls', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	expiresAt: timestamp('expires_at', { withTimezone: true }),
	longUrl: text('long_url').notNull(),
	slug: varchar('slug', { length: 55 }).notNull().unique(),
});

export const shortUrlRelations = relations(shortUrls, ({ one }) => ({
	userId: one(users, {
		fields: [shortUrls.userId],
		references: [users.id],
	}),
}));
