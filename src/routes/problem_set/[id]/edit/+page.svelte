<script lang="ts">
	import { Tabs } from 'bits-ui';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input/index.js';
	import * as Breadcrumb from '@/components/ui/breadcrumb';
	import * as Dialog from '@/components/ui/dialog/index.js';
	import * as Form from '@/components/ui/form/index.js';
	import Trash from 'svelte-radix/Trash.svelte';
	import LightSwitch from '@/components/light-switch.svelte';
	import Question from './question.svelte';
	import Choice from './choice.svelte';
	import { useId } from '@/utils.js';

	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { updatePasswordFormSchema } from './formSchema.ts';

	import type { PageServerData } from './$types';
	import 'prosemirror-view/style/prosemirror.css';

	type Props = {
		data: PageServerData;
	};

	let { data }: Props = $props();

	type Item = {
		id: string;
		question: '';
		choices: string[];
		answer: 0 | 1 | 2 | 3;
	};

	let problems = $state<Item[]>(data.result.content ? data.result.content : [newItem()]);

	function newItem(): Item {
		return {
			id: useId(6),
			question: '',
			choices: ['', '', '', ''],
			answer: 0
		};
	}

	function deleteItem(id: string) {
		problems = problems.filter((item) => item.id !== id);
	}

	async function saveChanges() {
		await fetch(`/problem_set/${data.result.id}/edit`, {
			method: 'PATCH',
			body: JSON.stringify({ content: $state.snapshot(problems) }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	const formUpdatePassword = superForm(data.formUpdatePassword, {
		validators: zodClient(updatePasswordFormSchema)
	});
</script>

<header class="sticky top-0 z-50 border-b border-border/40 bg-background">
	<div class="container flex h-16 items-center justify-between">
		<div class="mr-4">
			<img src="/favicon.png" class="size-10" alt="logo" />
		</div>
		<div class="flex items-center">
			<LightSwitch />
		</div>
	</div>
</header>

<div class="container space-y-4">
	<Breadcrumb.Root class="mt-4">
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link href="/problem_set">Problem Sets</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				<Breadcrumb.Page class="max-w-80 truncate">
					{data.result.title || 'Untitled Problem Set'}
				</Breadcrumb.Page>
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>

	<div class="flex justify-end gap-2">
		<Button onclick={saveChanges}>Save</Button>
		{@render dialogSettings()}
	</div>

	{#each problems as problem (problem.id)}
		<div class="rounded-md border shadow-sm focus-within:ring-2 focus-within:ring-ring">
			<div class="mb-4 flex justify-end">
				<Button variant="ghost" size="icon" onclick={() => deleteItem(problem.id)}>
					<Trash />
				</Button>
			</div>

			<div class="p-4">
				<Question
					htmlContent={{
						get value() {
							return problem.question;
						},
						set value(v) {
							problem.question = v;
						}
					}}
				>
					{@html $state.snapshot(problem.question)}
				</Question>
			</div>

			<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
				{#each problem.choices as choice, i}
					<div class="grid grid-cols-[auto_1fr] p-4">
						<div class="mr-4">
							<input type="radio" name="problem-1" />
							<label for="" class="text-muted-foreground">{i + 1}</label>
						</div>
						<Choice
							htmlContent={{
								get value() {
									return choice;
								},
								set value(v) {
									problem.choices[i] = v;
								}
							}}
						>
							{@html $state.snapshot(choice)}
						</Choice>
					</div>
				{/each}
			</div>
		</div>
	{/each}

	<div>
		<Button variant="outline" class="w-full" onclick={() => problems.push(newItem())}>+</Button>
	</div>
</div>

{#snippet dialogSettings()}
	<Dialog.Root>
		<Dialog.Trigger>
			{#snippet child({ props })}
				<Button variant="secondary" {...props}>Settings</Button>
			{/snippet}
		</Dialog.Trigger>
		<Dialog.Content class="h-full max-h-[32rem]  w-full max-w-screen-sm">
			<Dialog.Header class="border-b">
				<Dialog.Title>Settings</Dialog.Title>
			</Dialog.Header>
			<Tabs.Root
				value="properties"
				class="grid grid-cols-[8rem_1fr] sm:grid-cols-[12rem_1fr]"
			>
				<Tabs.List class="border-r">
					<Tabs.Trigger
						value="properties"
						class="block w-full cursor-pointer border-l-2 border-transparent px-4 py-2.5 text-left hover:bg-accent data-[state=active]:border-green-500"
					>
						Properties
					</Tabs.Trigger>
					<Tabs.Trigger
						value="encryption"
						class="block w-full cursor-pointer border-l-2 border-transparent px-4 py-2.5 text-left hover:bg-accent data-[state=active]:border-green-500"
					>
						Encryption
					</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="properties">
					{@render propertiesTab()}
				</Tabs.Content>
				<Tabs.Content value="encryption" class="p-4">
					{@render updatePasswordForm()}
				</Tabs.Content>
			</Tabs.Root>
		</Dialog.Content>
	</Dialog.Root>
{/snippet}

{#snippet propertiesTab()}
	<p class="text-xl">Properties</p>
{/snippet}

{#snippet updatePasswordForm()}
	<form method="POST" action="?/updatePassword" class="flex h-full flex-col justify-between">
		<div>
			<input type="text" name="username" value="" autocomplete="username" hidden />
			<Form.Field form={formUpdatePassword} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Password</Form.Label>
						<Input type="password" autocomplete="new-password" {...props} />
					{/snippet}
				</Form.Control>
			</Form.Field>
		</div>
		<div class="flex justify-end">
			<Button type="submit">Save Changes</Button>
		</div>
	</form>
{/snippet}

<style>
	:global(.ProseMirror:focus) {
		outline: none;
	}
</style>
