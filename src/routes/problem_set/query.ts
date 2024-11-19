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
export type ProblemSetData = Omit<table.ProblemSet, 'passwordHash' | 'userId'>;
