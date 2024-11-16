import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { encodeBase64url } from '@oslojs/encoding';
import { DATABASE_URL } from '$env/static/private';

export * as table from './schema.js';

const client = postgres(DATABASE_URL);
export const db = drizzle(client);

export function generateId(length: number): string {
	return encodeBase64url(crypto.getRandomValues(new Uint8Array(length)));
}
