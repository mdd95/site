import { date, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { relations } from 'drizzle-orm';

export const userInfo = pgTable(
	'user_info',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		avatarUrl: text('avatar_url'),
		coverUrl: text('cover_url'),
		bio: text('bio'),
		birthdate: date('birthdate'),
		location: text('location'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [index('user_info_user_id_idx').on(table.userId)]
);

export const userInfoRelations = relations(userInfo, ({ one }) => ({
	user: one(user, {
		fields: [userInfo.userId],
		references: [user.id]
	})
}));
