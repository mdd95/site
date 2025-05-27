<script lang="ts">
	import { getCoreRowModel, type ColumnDef } from '@tanstack/table-core';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		createSvelteTable,
		FlexRender,
		renderSnippet
	} from '$lib/components/ui/data-table/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';

	type ShortUrl = {
		id: string;
		slug: string;
		url: string;
	};

	// let { data }: Props = $props();
	let data: ShortUrl[] = [
		{ id: '1', slug: 'test', url: 'https://example.com' },
		{ id: '2', slug: 'test2', url: 'https://example.com' },
		{ id: '3', slug: 'test3', url: 'https://example.com' }
	];

	const columns: ColumnDef<ShortUrl>[] = [
		{ accessorKey: 'slug', header: 'Slug' },
		{ accessorKey: 'url', header: 'URL' },
		{
			id: 'actions',
			cell: ({ row }) =>
				renderSnippet(dataTableAction, {
					props: { id: row.original.id }
				})
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

<div class="container mx-auto px-4 py-2">
	<Button>New</Button>
</div>

<div class="container mx-auto p-4">
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
						No results.
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

{#snippet dataTableAction()}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="ghost" size="icon">
					<span class="sr-only">Open menu</span>
					<Ellipsis />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Item>Info</DropdownMenu.Item>
			<DropdownMenu.Item>Archive</DropdownMenu.Item>
			<DropdownMenu.Item>Delete</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/snippet}
