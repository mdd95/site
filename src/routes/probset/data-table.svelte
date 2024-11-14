<script lang="ts">
	import { getCoreRowModel } from '@tanstack/table-core';
	import { Button } from '@/components/ui/button/index.js';
	import { Checkbox } from '@/components/ui/checkbox/index.js';
	import {
		createSvelteTable,
		FlexRender,
		renderSnippet
	} from '@/components/ui/data-table/index.js';
	import * as Table from '@/components/ui/table/index.js';

	import type { ColumnDef } from '@tanstack/table-core';
	import type { ProblemSet } from '@/server/db/schema';

	type Props = {
		data: Array<ProblemSet>;
	};

	let { data }: Props = $props();

	const columns: ColumnDef<ProblemSet>[] = [
		{
			accessorKey: 'id',
			header: 'ID',
			cell: ({ row }) => {
				return renderSnippet(snippetCellId, row.getValue('id'));
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
		{
			accessorKey: 'published',
			header: 'Published',
			cell: ({ row }) => {
				return renderSnippet(cellPublished, row.getValue('published'));
			}
		}
	];

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel()
	});
</script>

{#snippet snippetCellId(id: string)}
	<Button variant="link" href="/probset/{id}">{id}</Button>
{/snippet}

{#snippet cellPublished(publihsed: boolean)}
	<Checkbox checked={publihsed} />
{/snippet}

<Table.Root>
	<Table.Header>
		{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
			<Table.Row>
				{#each headerGroup.headers as header (header.id)}
					<Table.Head>
						{#if !header.isPlaceholder}
							<FlexRender
								content={header.column.columnDef.header}
								context={header.getContext()}
							/>
						{/if}
					</Table.Head>
				{/each}
			</Table.Row>
		{/each}
	</Table.Header>
	<Table.Body>
		{#each table.getRowModel().rows as row (row.id)}
			<Table.Row data-state={row.getIsSelected() && 'selected'}>
				{#each row.getVisibleCells() as cell (cell.id)}
					<Table.Cell>
						<FlexRender
							content={cell.column.columnDef.cell}
							context={cell.getContext()}
						/>
					</Table.Cell>
				{/each}
			</Table.Row>
		{:else}
			<Table.Row>
				<Table.Cell colspan={columns.length} class="h-24 text-center">
					You have not created any problem sets.
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
