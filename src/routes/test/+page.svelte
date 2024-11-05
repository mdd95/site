<script lang="ts">
	import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar/index.js';
	import { Button } from '@/components/ui/button/index.js';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuGroupHeading,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '@/components/ui/dropdown-menu/index.js';
	import LightSwitch from '@/components/light-switch.svelte';
	import { RichText, bindContentToProxy } from '@/components/rich-text/index.js';
	import Trash from 'svelte-radix/Trash.svelte';
	import type { PageServerData } from './$types';

	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();

	let questions: Array<any> = $state([]);

	function save() {
		const q = $state.snapshot(questions);
		console.log(q);
	}
</script>

{#snippet avatar()}
	<Avatar>
		<AvatarImage src="" alt="user" />
		<AvatarFallback>JD</AvatarFallback>
	</Avatar>
{/snippet}

{#snippet dropdown()}
	<DropdownMenu>
		<DropdownMenuTrigger>
			{@render avatar()}
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end" class="w-56">
			<DropdownMenuGroup>
				<DropdownMenuGroupHeading>
					<p>John Doe</p>
					<p class="text-muted-foreground">username@gmail.com</p>
				</DropdownMenuGroupHeading>
				<DropdownMenuSeparator />
				<DropdownMenuItem>Sign out</DropdownMenuItem>
			</DropdownMenuGroup>
		</DropdownMenuContent>
	</DropdownMenu>
{/snippet}

<header class="sticky top-0 z-50 border-b border-border/40 bg-background">
	<div class="container flex h-16 items-center justify-between">
		<div class="mr-4">
			<img src="/favicon.png" class="size-10" alt="logo" />
		</div>
		<div class="flex items-center">
			<LightSwitch />
			{#if data.user === null}
				{@render dropdown()}
			{:else}
				<Button variant="ghost">Sign in with Google</Button>
			{/if}
		</div>
	</div>
</header>

<div class="container flex h-16 items-center">
	<Button>Create</Button>
</div>

<div class="container space-y-4">
	{#each questions as q, i}
		<div class="rounded-md border p-4 shadow-sm">
			<div class="mb-4 flex justify-end">
				<Button
					variant="ghost"
					size="icon"
					onclick={() => {
						questions = questions.filter((i) => {
							const a = $state.snapshot(i).id;
							const b = $state.snapshot(q).id;
							return a !== b;
						});
					}}
				>
					<Trash />
				</Button>
			</div>

			<RichText
				class="mb-4 rounded-md border p-4 shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
				plugins={({ schema }) => [bindContentToProxy(schema, q.question)]}
			>
				<p class="mb-2 text-muted-foreground">Problem {i + 1}</p>
			</RichText>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				{#each q.choices as c, i}
					<div
						class="grid grid-cols-[auto_1fr] rounded-md border p-4 shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
					>
						<div class="mr-4">
							<input type="radio" name="problem-1" />
							<label for="" class="text-muted-foreground">{c.name}</label>
						</div>
						<RichText plugins={({ schema }) => [bindContentToProxy(schema, c)]}
						></RichText>
					</div>
				{/each}
			</div>
		</div>
	{/each}
	<div class="flex justify-center gap-2">
		<Button
			onclick={() =>
				questions.push({
					id: crypto.randomUUID(),
					question: { value: '' },
					choices: [
						{ name: 'A', value: '' },
						{ name: 'B', value: '' },
						{ name: 'C', value: '' },
						{ name: 'D', value: '' }
					]
				})}
		>
			Add new
		</Button>
		<Button onclick={save}>Save</Button>
	</div>
</div>

<style>
	:global(.ProseMirror:focus) {
		outline: none;
	}
</style>
