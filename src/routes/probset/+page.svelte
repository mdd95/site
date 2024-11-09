<script lang="ts">
	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle
	} from '@/components/ui/alert-dialog/index.js';
	import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar/index.js';
	import { Button } from '@/components/ui/button/index.js';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
		DialogTrigger
	} from '@/components/ui/dialog/index.js';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuGroupHeading,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '@/components/ui/dropdown-menu/index.js';
	import { ScrollArea } from '@/components/ui/scroll-area/index.js';
	import LightSwitch from '@/components/light-switch.svelte';
	import { RichText, bindContentToProxy } from '@/components/rich-text/index.js';
	import Trash from 'svelte-radix/Trash.svelte';
	import type { PageServerData } from './$types';
	import { cn } from '@/utils';

	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();

	let questions: Array<any> = $state([]);

	function save() {
		const q = $state.snapshot(questions);
		console.log(q);
	}

	let openAlertDialog = $state(false);

	function getUsernameFromEmail(email: string) {
		return email.split('@')[0];
	}

	type AvatarProps = {
		username: string;
		imgUrl: string;
	};
</script>

{#snippet avatar({ imgUrl, username }: AvatarProps)}
	<Avatar>
		<AvatarImage src={imgUrl} alt={username} />
		<AvatarFallback class="uppercase">{username.slice(0, 2)}</AvatarFallback>
	</Avatar>
{/snippet}

{#snippet dropdown()}
	<DropdownMenu>
		<DropdownMenuTrigger>
			{@render avatar({
				imgUrl: data.user?.googleAvatarUrl || '',
				username: getUsernameFromEmail(data.user?.googleEmail || '')
			})}
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end" class="w-56">
			<DropdownMenuGroup>
				<DropdownMenuGroupHeading>
					<p>{data.user!.googleName}</p>
					<p class="text-muted-foreground">{data.user!.googleEmail}</p>
				</DropdownMenuGroupHeading>
				<DropdownMenuSeparator />
				<DropdownMenuItem class="w-full">
					{#snippet child({ props })}
						<form method="POST" action="/logout" style="display: contents;">
							<button type="submit" {...props}>Sign out</button>
						</form>
					{/snippet}
				</DropdownMenuItem>
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
				<Button href="/login/google" variant="ghost">Sign in with Google</Button>
			{:else}
				{@render dropdown()}
			{/if}
		</div>
	</div>
</header>

{#snippet createForm()}
	{#each questions as q, i}
		<div class="px-2">
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
{/snippet}

{#snippet alertOnClose()}
	<AlertDialog bind:open={openAlertDialog}>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>Unsaved changes</AlertDialogTitle>
				<AlertDialogDescription>
					You have unsaved changes. Are you sure you want to leave this page?
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<AlertDialogAction>Leave</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
{/snippet}

{#snippet createDialog()}
	<Dialog>
		<DialogTrigger>
			{#snippet child({ props })}
				<Button {...props}>Create</Button>
			{/snippet}
		</DialogTrigger>
		<DialogContent
			class="w-[calc(100%-2rem)] max-w-2xl"
			onInteractOutside={(e) => {
				e.preventDefault();
				openAlertDialog = true;
			}}
			onEscapeKeydown={(e) => {
				e.preventDefault();
				openAlertDialog = true;
			}}
		>
			<DialogHeader>
				<DialogTitle>New problem set</DialogTitle>
				<DialogDescription>Create a new set of problems</DialogDescription>
			</DialogHeader>
			<ScrollArea class="px-4">
				{@render createForm()}
			</ScrollArea>
			<DialogFooter>
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
			</DialogFooter>
		</DialogContent>
		{@render alertOnClose()}
	</Dialog>
{/snippet}

<div class="container flex h-16 items-center">
	{@render createDialog()}

	<form method="post">
		<Button type="submit">Create</Button>
	</form>
</div>

<style>
	:global(.ProseMirror:focus) {
		outline: none;
	}
</style>
