<script lang="ts" generics="Data, Value">
	import { getCoreRowModel } from '@tanstack/table-core';
	import { createSvelteTable, FlexRender } from '@/components/ui/data-table/index.js';
	import * as Table from '@/components/ui/table/index.js';

	import type { ColumnDef } from '@tanstack/table-core';

	type DataTableProps<Data, Value> = {
		columns: ColumnDef<Data, Value>[];
		data: Data[];
	};

	type Props = {};

	let { columns, data }: Props & DataTableProps<Data, Value> = $props();

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel()
	});
</script>

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
