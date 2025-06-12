<script lang="ts" module>
	import { z } from 'zod/v4-mini';

	export const schema = {
		create: z.object({
			slug: z.string().check(z.minLength(6)),
			url: z.string().check(z.url())
		}),
		delete: z.object({
			id: z.string().check(z.uuidv4())
		})
	};
</script>

<script lang="ts">
	import { createRawSnippet } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { getCoreRowModel, type ColumnDef } from '@tanstack/table-core';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		createSvelteTable,
		FlexRender,
		renderSnippet
	} from '$lib/components/ui/data-table/index.js';
	import { Dialog, DialogContent } from '$lib/components/ui/dialog/index.js';
	import { Drawer, DrawerContent } from '$lib/components/ui/drawer/index.js';
	import {
		DropdownMenu,
		DropdownMenuContent,
		Item,
		Trigger
	} from '$lib/components/ui/dropdown-menu/index.js';
	import { Control, Field, FieldErrors, Label } from '$lib/components/ui/form/index.js';
	import { Body, Cell, Head, Header, Row, Table } from '$lib/components/ui/table/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import Share from '@lucide/svelte/icons/share';
	import Spinner from '$lib/components/svg/spinner.svelte';
	import type { PageProps } from './$types';

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

	let isLoading = $state(false);

	const form = superForm(data.form, {
		validators: zod4Client(schema.create),
		onSubmit() {
			isLoading = true;
		},
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

	const getOpenDialog = () => !isMobile.current && isCreateDialogOpen;
	const getOpenDrawer = () => isMobile.current && isCreateDialogOpen;
	const setOpen = (value: boolean) => (isCreateDialogOpen = value);
</script>

<svelte:head>
	<title>Shorten URL</title>
	<meta name="description" content="Shorten URL" />
</svelte:head>

{#snippet createForm()}
	<form method="POST" action="?/create" use:enhance class="space-y-4">
		<div class="">
			<h1 class="text-2xl font-bold">Create Short URL</h1>
			<p class="text-muted-foreground text-sm text-balance">
				Shorten a long URL to a short URL
			</p>
		</div>

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

		<Button type="submit" class="w-full">
			<Spinner class={[!isLoading && 'hidden']} />
			Shorten
		</Button>
	</form>
{/snippet}

<Drawer bind:open={getOpenDrawer, setOpen}>
	<DrawerContent>
		<div class="mx-auto w-full max-w-sm px-4 py-8">
			{@render createForm()}
		</div>
	</DrawerContent>
</Drawer>

<Dialog bind:open={getOpenDialog, setOpen}>
	<DialogContent class="w-sm">
		{@render createForm()}
	</DialogContent>
</Dialog>

<div class="container mx-auto px-4 pb-2">
	<Button onclick={() => setOpen(true)}>Shorten URL</Button>
</div>

<div class="container mx-auto px-4">
	<Table>
		<Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Row>
					{#each headerGroup.headers as header (header.id)}
						<Head>
							{#if !header.isPlaceholder}
								<FlexRender
									content={header.column.columnDef.header}
									context={header.getContext()}
								/>
							{/if}
						</Head>
					{/each}
				</Row>
			{/each}
		</Header>
		<Body>
			{#each table.getRowModel().rows as row (row.id)}
				<Row data-state={row.getIsSelected() && 'selected'}>
					{#each row.getVisibleCells() as cell (cell.id)}
						<Cell>
							<FlexRender
								content={cell.column.columnDef.cell}
								context={cell.getContext()}
							/>
						</Cell>
					{/each}
				</Row>
			{:else}
				<Row>
					<Cell colspan={columns.length} class="h-24 text-center">No results.</Cell>
				</Row>
			{/each}
		</Body>
	</Table>
</div>

{#snippet dataTableAction({ props }: { props: { id: string } })}
	<div class="flex justify-end">
		<Button variant="ghost" size="icon">
			<span class="sr-only">Share link</span>
			<Share />
		</Button>
		<DropdownMenu>
			<Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="ghost" size="icon">
						<span class="sr-only">Open menu</span>
						<Ellipsis />
					</Button>
				{/snippet}
			</Trigger>
			<DropdownMenuContent align="end" preventScroll={false}>
				<Item>Info</Item>
				<Item>Archive</Item>

				<form method="POST" action="?/delete" class="contents">
					<input type="hidden" name="id" value={props.id} />
					<button type="submit" class="contents">
						<Item>Delete</Item>
					</button>
				</form>
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
{/snippet}
