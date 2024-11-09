import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { DATABASE_URL } from '$env/static/private';
import { generateId } from '../utils.js';
import * as table from './schema.js';

const client = postgres(DATABASE_URL);
export const db = drizzle(client);

export async function createProblemSet(userId: string, content: any) {
	const problemSetId = generateId(18);
	const problemSet: Partial<table.ProblemSet> & {
		id: string;
		userId: string;
	} = {
		id: problemSetId,
		userId,
		content
	};
	await db.insert(table.problemSet).values(problemSet);
}
