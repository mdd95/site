<script lang="ts" module>
	import { z } from 'zod/v4-mini';

	export const schema = z.object({
		slug: z.string().check(z.minLength(6)),
		url: z.string().check(z.url())
	});
</script>

<script lang="ts">
	import { createRawSnippet } from 'svelte';
	import { getCoreRowModel, type ColumnDef } from '@tanstack/table-core';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		createSvelteTable,
		FlexRender,
		renderSnippet
	} from '$lib/components/ui/data-table/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Control, Field, FieldErrors, Label } from '$lib/components/ui/form/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import Plus from '@lucide/svelte/icons/plus';
	import Share from '@lucide/svelte/icons/share';
	import { superForm } from 'sveltekit-superforms';
	import type { PageProps } from './$types';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	type ShortUrl = {
		id: string;
		dateCreated: Date;
		slug: string;
		url: string;
	};

	let { data }: PageProps = $props();
	let tableData: ShortUrl[] = $state([]);
	$inspect(tableData);

	const columns: ColumnDef<ShortUrl>[] = [
		{
			accessorKey: 'dateCreated',
			header: 'Date Created',
			cell: ({ row }) => {
				const dateString = Intl.DateTimeFormat('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				});
				return renderSnippet(
					createRawSnippet(() => ({
						render: () =>
							`<span>${dateString.format(row.getValue('dateCreated'))}</span>`
					}))
				);
			}
		},
		{ accessorKey: 'slug', header: 'Slug' },
		{ accessorKey: 'url', header: 'URL' },
		{
			id: 'actions',
			cell: ({ row }) => {
				return renderSnippet(dataTableAction, {
					props: { id: row.original.id }
				});
			}
		}
	];

	const table = createSvelteTable({
		get data() {
			return tableData;
		},
		columns,
		getCoreRowModel: getCoreRowModel()
	});

	const isMobile = new IsMobile();
	let isCreateDialogOpen = $state(false);

	const form = superForm(data.form, {
		validators: zod4Client(schema),
		onResult({ result }) {
			if (result.type === 'success') {
				tableData = [
					...tableData,
					{
						id: crypto.randomUUID(),
						dateCreated: new Date(),
						...result.data?.form.data
					}
				];
				isCreateDialogOpen = false;
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<svelte:head>
	<title>Shorten URL</title>
	<meta name="description" content="Shorten URL" />
</svelte:head>

{#snippet createForm()}
	<form method="POST" action="?/create" use:enhance>
		<Field {form} name="slug">
			<Control>
				{#snippet children({ props })}
					<Label>Slug</Label>
					<Input {...props} bind:value={$formData.slug} />
				{/snippet}
			</Control>
			<FieldErrors />
		</Field>

		<Field {form} name="url">
			<Control>
				{#snippet children({ props })}
					<Label>URL</Label>
					<Input {...props} bind:value={$formData.url} />
				{/snippet}
			</Control>
			<FieldErrors />
		</Field>

		<Button type="submit" class="w-full">Shorten</Button>
	</form>
{/snippet}

<Drawer.Root
	bind:open={
		() => {
			return isMobile.current && isCreateDialogOpen;
		},
		(value) => {
			isCreateDialogOpen = value;
		}
	}
>
	<Drawer.Content>
		{@render createForm()}
	</Drawer.Content>
</Drawer.Root>

<Dialog.Root
	bind:open={
		() => {
			return !isMobile.current && isCreateDialogOpen;
		},
		(value) => {
			isCreateDialogOpen = value;
		}
	}
>
	<Dialog.Content>
		{@render createForm()}
	</Dialog.Content>
</Dialog.Root>

<div class="container mx-auto px-4 pb-2">
	<Button
		onclick={() => {
			isCreateDialogOpen = true;
		}}
	>
		Shorten URL
	</Button>
</div>

<div class="container mx-auto px-4">
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

{#snippet dataTableAction({ props }: { props: { id: string } })}
	<div class="flex justify-end">
		<Button variant="ghost" size="icon">
			<span class="sr-only">Share link</span>
			<Share />
		</Button>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="ghost" size="icon">
						<span class="sr-only">Open menu</span>
						<Ellipsis />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" preventScroll={false}>
				<DropdownMenu.Item>Info</DropdownMenu.Item>
				<DropdownMenu.Item>Archive</DropdownMenu.Item>
				<DropdownMenu.Item
					onclick={() => {
						tableData = tableData.filter((shortUrl) => shortUrl.id !== props.id);
					}}
				>
					Delete
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
{/snippet}
