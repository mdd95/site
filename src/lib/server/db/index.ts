import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { DATABASE_URL } from '$env/static/private';
import { generateId } from '../utils.js';
import * as table from './schema.js';
import { error } from '@sveltejs/kit';

const client = postgres(DATABASE_URL);
export const db = drizzle(client);

export async function createProblemSet(userId: string, content: any): Promise<{ id: string }> {
	const id = generateId(18);
	await db.insert(table.problemSet).values({ id, userId, content });
	return { id };
}

export async function getProblemSetList(userId: string): Promise<table.ProblemSet[]> {
	const result = await db
		.select()
		.from(table.problemSet)
		.where(eq(table.problemSet.userId, userId));
	return result;
}

export async function getProblemSetById(id: string): Promise<table.ProblemSet | undefined> {
	const [result] = await db.select().from(table.problemSet).where(eq(table.problemSet.id, id));
	return result;
}

export async function updateProblemSet(id: string, content: any): Promise<void> {
	await db.update(table.problemSet).set({ content }).where(eq(table.problemSet.id, id));
}

export async function deleteProbSetById(user: any, id: string) {
	const result = await db.select().from(table.problemSet).where(eq(table.problemSet.id, id));

	if (result.length === 0) error(404, 'Not found');

	const data = result[0];
	if (data.userId !== user.id) error(401, 'Unauthorized');

	await db.delete(table.problemSet).where(eq(table.problemSet.id, id));
}
