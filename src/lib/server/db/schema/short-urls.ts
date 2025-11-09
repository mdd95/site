import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const shortUrls = pgTable('short_urls', {
	id: uuid('id').defaultRandom().primaryKey(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	longUrl: text('long_url'),
	slug: varchar('slug', { length: 55 }),
});
