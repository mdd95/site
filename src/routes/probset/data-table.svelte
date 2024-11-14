<script lang="ts">
	import { getCoreRowModel } from '@tanstack/table-core';
	import { Button } from '@/components/ui/button/index.js';
	import { Checkbox } from '@/components/ui/checkbox/index.js';
	import {
		createSvelteTable,
		FlexRender,
		renderSnippet
	} from '@/components/ui/data-table/index.js';
	import * as DropdownMenu from '@/components/ui/dropdown-menu/index.js';
	import * as Table from '@/components/ui/table/index.js';
	import DotsHorizontal from 'svelte-radix/DotsHorizontal.svelte';

	import type { ColumnDef, RowSelectionState } from '@tanstack/table-core';
	import type { CheckboxProps } from '@/components/ui/checkbox';
	import type { ProblemSet } from '@/server/db/schema';

	type Props = {
		data: Array<ProblemSet>;
		rowSelection: RowSelectionState;
	};

	let { data = $bindable(), rowSelection = $bindable({}) }: Props = $props();

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
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				return renderSnippet(cellRowActions, {
					id: row.getValue('id') as string
				});
			}
		}
	];

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

	type CellRowActionsProps = {
		id: string;
	};
</script>

{#snippet cellCheckbox({ ...props }: CheckboxProps)}
	<Checkbox {...props} />
{/snippet}

{#snippet cellTitle({ id, title }: CellTitleProps)}
	<a
		href="/probset/{id}"
		class="font-medium text-blue-600 hover:underline dark:text-blue-500"
		{title}
	>
		{title}
	</a>
{/snippet}

{#snippet cellRowActions({ id }: CellRowActionsProps)}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="ghost" size="icon">
					<DotsHorizontal />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
				<DropdownMenu.Item>Copy link</DropdownMenu.Item>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				{#snippet child({ props })}
					<a {...props} href="/probset/{id}/edit">Edit</a>
				{/snippet}
			</DropdownMenu.Item>
			<DropdownMenu.Item>Encrypt</DropdownMenu.Item>
			<DropdownMenu.Item>
				{#snippet child({ props })}
					<button
						{...props}
						onclick={async () => {
							await fetch(`/probset/${id}`, { method: 'DELETE' });
							data = data.filter((i) => i.id !== id);
						}}
						aria-label="Delete problem set"
					>
						Delete
					</button>
				{/snippet}
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
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
