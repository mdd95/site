import * as argon2 from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { command, form, getRequestEvent, query } from '$app/server';
import { db } from '../server/db/index.js';
import * as table from '../server/db/schema/index.js';
import * as schema from './schema.js';
import * as session from './session.js';

const config = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1,
};

export const user = query(() => {
	const event = getRequestEvent();

	return {
		user: event.locals.user,
		session: event.locals.session,
	};
});

export const login = form(schema.login, async (data) => {
	const [result] = await db.select().from(table.users).where(eq(table.users.email, data.email));

	if (!result) {
		// User does not exist
		return;
	}

	if (!(await argon2.verify(result.passwordHash, data.password, config))) {
		// Invalid password
		return;
	}

	const event = getRequestEvent();
	const token = session.generateToken();

	session.setCookie(event, token, (await session.create(event, token, result.id)).expiresAt);
});

export const signup = form(schema.signup, async (data) => {
	const [result] = await db
		.insert(table.users)
		.values({
			username: data.username,
			email: data.email,
			passwordHash: await argon2.hash(data.password, config),
		})
		.returning({
			id: table.users.id,
		});

	if (!result) {
		// Error creating user
		return;
	}

	const event = getRequestEvent();
	const token = session.generateToken();
	const _session = await session.create(event, token, result.id);
	session.setCookie(event, token, _session.expiresAt);

	return { user: result, session: _session };
});

export const logout = command(async () => {
	const event = getRequestEvent();

	if (!event.locals.session) {
		// No current session
		return;
	}

	await session.invalidate(event.locals.session.id);
	session.deleteCookie(event);

	event.locals.session = null;
	event.locals.user = null;

	user().refresh();
});

export const update = form(schema.update, async (data) => {
	const event = getRequestEvent();

	if (!event.locals.user) {
		// Prevent non user update data
		return;
	}

	await db
		.update(table.users)
		.set({
			email: data.email,
			username: data.username,
			birthdate: data.birthdate.toISOString(),
			bio: data.bio,
		})
		.where(eq(table.users.id, event.locals.user.id));
});

export const password = form(schema.password, async (data) => {
	const event = getRequestEvent();

	if (!event.locals.user) {
		// Prevent non user
		return;
	}

	const [result] = await db
		.select({
			passwordHash: table.users.passwordHash,
		})
		.from(table.users)
		.where(eq(table.users.id, event.locals.user.id));

	if (!argon2.verify(result.passwordHash, data.previousPassword, config)) {
		// Invalid password
		return {};
	}

	await db
		.update(table.users)
		.set({
			passwordHash: await argon2.hash(data.password, config),
		})
		.where(eq(table.users.id, event.locals.user.id));
});
