<script lang="ts">
	import { createRawSnippet } from 'svelte';
	import { getCoreRowModel, type ColumnDef } from '@tanstack/table-core';
	import { applyAction, enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		createSvelteTable,
		FlexRender,
		renderSnippet
	} from '$lib/components/ui/data-table/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { IsMobile } from '$lib/utils.js';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import Plus from '@lucide/svelte/icons/plus';
	import Share from '@lucide/svelte/icons/share';

	type ShortUrl = {
		id: string;
		createdAt: string;
		slug: string;
		url: string;
	};

	// let { data }: Props = $props();
	let data: ShortUrl[] = $state.raw([]);

	const columns: ColumnDef<ShortUrl>[] = [
		{
			accessorKey: 'createdAt',
			header: 'Date Created',
			cell: ({ row }) => {
				const date = new Date(row.getValue('createdAt'));
				const dateString = Intl.DateTimeFormat('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				});
				return renderSnippet(
					createRawSnippet(() => ({
						render: () => `<span>${dateString.format(date)}</span>`
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
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel()
	});

	const isMobile = new IsMobile();
	let isCreateDialogOpen = $state(false);
</script>

<svelte:head>
	<title>Shorten URL</title>
	<meta name="description" content="Shorten URL" />
</svelte:head>

{#snippet createForm()}
	<form
		method="POST"
		action="?/create"
		use:enhance={() => {
			return async ({ formData, result }) => {
				if (result.type === 'success') {
					data = [
						...data,
						{
							id: crypto.randomUUID(),
							slug: formData.get('slug') as string,
							url: formData.get('url') as string,
							createdAt: new Date().toISOString()
						}
					];
					// data = [...data, result.data as ShortUrl];
					isCreateDialogOpen = false;
				} else {
					await applyAction(result);
				}
			};
		}}
		class="p-4"
	>
		<Label class="my-2">Slug</Label>
		<Input name="slug" />

		<Label class="my-2">URL</Label>
		<Input type="url" name="url" autocomplete="url" />

		<Button type="submit" class="mt-4 w-full">Shorten</Button>
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
						data = data.filter((shortUrl) => shortUrl.id !== props.id);
					}}
				>
					Delete
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
{/snippet}
