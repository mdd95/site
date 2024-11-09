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
	import type { PageServerData } from './$types';

	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();

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

<div class="container flex h-16 items-center">
	<form method="post">
		<Button type="submit">Create</Button>
	</form>
</div>

{#if data.result !== null}
	<div class="container">
		{#each data.result as set, i}
			<div>
				<a href="/probset/{set.id}/edit">{set.id}</a>
			</div>
		{/each}
	</div>
{/if}

<style>
	:global(.ProseMirror:focus) {
		outline: none;
	}
</style>
