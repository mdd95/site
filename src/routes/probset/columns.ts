import { createRawSnippet } from 'svelte';
import { renderSnippet } from '@/components/ui/data-table/index.js';

import type { ColumnDef } from '@tanstack/table-core';
import type { ProblemSet } from '@/server/db/schema';

export const columns: ColumnDef<ProblemSet>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => {
			const snippet = createRawSnippet<[string]>((getId) => {
				const id = getId();
				return { render: () => `<a href="/probset/${id}">${id}</a>` };
			});
			return renderSnippet(snippet, row.getValue('id'));
		}
	},
	{
		accessorKey: 'createAt',
		header: 'Date Created',
		cell: ({ row }) => {
			const formatter = new Intl.DateTimeFormat('default', {
				dateStyle: 'long',
				timeStyle: 'short'
			});
			return formatter.format(row.getValue('createAt'));
		}
	},
	{ accessorKey: 'published', header: 'Published' }
];
