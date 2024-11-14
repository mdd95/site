<script lang="ts">
	import { getCoreRowModel } from '@tanstack/table-core';
	import { Checkbox } from '@/components/ui/checkbox/index.js';
	import {
		createSvelteTable,
		FlexRender,
		renderSnippet
	} from '@/components/ui/data-table/index.js';
	import * as Table from '@/components/ui/table/index.js';

	import type { ColumnDef, RowSelectionState } from '@tanstack/table-core';
	import type { CheckboxProps } from '@/components/ui/checkbox';
	import type { ProblemSet } from '@/server/db/schema';

	type Props = {
		data: Array<ProblemSet>;
	};

	let { data }: Props = $props();

	const columns: ColumnDef<ProblemSet>[] = [
		{
			accessorKey: 'id',
			header: ({ table }) => {
				return renderSnippet(cellCheckbox, {
					checked: table.getIsAllRowsSelected(),
					indeterminate:
						table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
					onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
					'aria-label': 'Select all rows'
				});
			},
			cell: ({ row }) =>
				renderSnippet(cellCheckbox, {
					checked: row.getIsSelected(),
					onCheckedChange: (value) => row.toggleSelected(!!value),
					'aria-label': 'Select row'
				}),
			enableSorting: false,
			enableHiding: false
		},
		{
			accessorKey: 'title',
			header: 'Title',
			cell: ({ row }) => {
				return renderSnippet(cellTitle, {
					id: row.getValue('id') as string,
					title: (row.getValue('title') || 'Untitled problem set...') as string
				});
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
				return renderSnippet(cellCheckbox, {
					checked: row.getValue('published') as boolean,
					'aria-label': 'Publish'
				});
			}
		}
	];

	let rowSelection = $state<RowSelectionState>({});

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		state: {
			get rowSelection() {
				return rowSelection;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		}
	});

	type CellTitleProps = {
		id: string;
		title: string;
	};
</script>

{#snippet cellCheckbox({ ...props }: CheckboxProps)}
	<Checkbox {...props} />
{/snippet}

{#snippet cellTitle({ id, title }: CellTitleProps)}
	<a href="/probset/{id}" class="hover:underline">{title}</a>
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
