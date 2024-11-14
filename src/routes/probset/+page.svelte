<script lang="ts">
	import { Button } from '@/components/ui/button/index.js';
	import * as Avatar from '@/components/ui/avatar/index.js';
	import * as DropdownMenu from '@/components/ui/dropdown-menu/index.js';
	import LightSwitch from '@/components/light-switch.svelte';
	import DataTable from './data-table.svelte';

	import type { RowSelectionState } from '@tanstack/table-core';
	import type { PageServerData } from './$types';

	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();

	let rowSelection = $state<RowSelectionState>({});
	let items = $state.raw(data.result || []);

	async function deleteSelected() {
		if (items.length === 0) return;

		const selectedId = Object.keys($state.snapshot(rowSelection)).map(Number);

		for (const id of selectedId) {
			const dataId = items[id].id;
			await fetch(`/probset/${dataId}`, { method: 'DELETE' });
		}
		items = items.filter((_, i) => !selectedId.includes(i));
		rowSelection = {};
	}

	type AvatarProps = {
		username: string;
		imgUrl: string;
	};
</script>

{#snippet avatar({ imgUrl, username }: AvatarProps)}
	<Avatar.Root>
		<Avatar.Image src={imgUrl} alt={username} />
		<Avatar.Fallback class="uppercase">{username.slice(0, 2)}</Avatar.Fallback>
	</Avatar.Root>
{/snippet}

{#snippet dropdown()}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{@render avatar({
				imgUrl: data.user?.googleAvatarUrl || '',
				username: data.user?.googleEmail?.split('@')[0] || ''
			})}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end" class="w-56">
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading>
					<p>{data.user!.googleName}</p>
					<p class="text-muted-foreground">{data.user!.googleEmail}</p>
				</DropdownMenu.GroupHeading>
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="w-full">
					{#snippet child({ props })}
						<form method="POST" action="/logout" style="display: contents;">
							<button type="submit" {...props}>Sign out</button>
						</form>
					{/snippet}
				</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/snippet}

<header class="sticky top-0 z-50 border-b border-border/40 bg-background">
	<div class="container flex h-16 items-center justify-between">
		<div class="mr-4">
			<img src="/favicon.png" class="size-10" alt="logo" />
		</div>
		<div class="flex items-center">
			<LightSwitch />
			{#if data.user === null}
				<Button href="/login/google" variant="ghost">Sign in with Google</Button>
			{:else}
				{@render dropdown()}
			{/if}
		</div>
	</div>
</header>

<div class="container">
	<div class="flex justify-between py-4">
		<form method="post" style="display: contents;">
			<Button type="submit">Create</Button>
		</form>

		{#if Object.values(rowSelection).some((value) => value)}
			<Button variant="destructive" onclick={deleteSelected}>Delete selected</Button>
		{/if}
	</div>

	<DataTable bind:data={items} bind:rowSelection />
</div>

<style>
	:global(.ProseMirror:focus) {
		outline: none;
	}
</style>
