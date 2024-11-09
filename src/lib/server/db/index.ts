import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { DATABASE_URL } from '$env/static/private';
import { generateId } from '../utils.js';
import * as table from './schema.js';

const client = postgres(DATABASE_URL);
export const db = drizzle(client);

export async function createProblemSet(userId: string, content: any): Promise<{ id: string }> {
	const id = generateId(18);
	await db.insert(table.problemSet).values({ id, userId, content });
	return { id };
}

export async function getProblemSetById(id: string): Promise<table.ProblemSet | undefined> {
	const [result] = await db.select().from(table.problemSet).where(eq(table.problemSet.id, id));
	return result;
}
