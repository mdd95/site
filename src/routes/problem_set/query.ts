import { table } from '@/server/db/index.js';

// prettier-ignore
export const query = {
	id:          table.problemSet.id,
	title:       table.problemSet.title,
	content:     table.problemSet.content,
	createdAt:   table.problemSet.createdAt,
	modifiedAt:  table.problemSet.modifiedAt,
	isPublished: table.problemSet.isPublished,
	isEncrypted: table.problemSet.isEncrypted
};

// prettier-ignore
export type ProblemSetData = {
	id:          string,
	title:       string,
	content:     string,
	createdAt:   string,
	modifiedAt:  string,
	isPublished: boolean,
	isEncrypted: boolean
};
