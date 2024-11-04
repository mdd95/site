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
	import { Editor, ActiveMarks } from '$lib/prosemirror/index.js';
	import type { PageServerData } from './$types';

	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();

	const editor = new Editor();
	editor.activeMarks = new ActiveMarks();
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

<div class="container">
	<div
		class="text-editor rounded-md border p-4 shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
		use:editor.bind
	></div>
</div>

<style>
	.text-editor :global(.ProseMirror:focus) {
		outline: none;
	}
</style>
