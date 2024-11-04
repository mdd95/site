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
	import {
		Questionnaire,
		QuestionnaireChoice,
		QuestionnaireProblem
	} from '@/components/questionnaire/index.js';

	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();

	const editor = new Editor();
	editor.activeMarks = new ActiveMarks();

	let questions: Array<any> = $state([]);
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
		<Questionnaire>
			<QuestionnaireProblem item={i + 1} />

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<QuestionnaireChoice name="problem-1" value="A" />
				<QuestionnaireChoice name="problem-1" value="B" />
				<QuestionnaireChoice name="problem-1" value="C" />
				<QuestionnaireChoice name="problem-1" value="D" />
			</div>
		</Questionnaire>
	{/each}
	<div class="flex justify-center gap-2">
		<Button onclick={() => questions.push({})}>Add new</Button>
		<Button>Save</Button>
	</div>
</div>

<style>
	:global(.ProseMirror:focus) {
		outline: none;
	}
</style>
