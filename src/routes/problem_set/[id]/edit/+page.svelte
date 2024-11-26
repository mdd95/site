<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Breadcrumb from '@/components/ui/breadcrumb';
	import Trash from 'svelte-radix/Trash.svelte';
	import LightSwitch from '@/components/light-switch.svelte';
	import Question from './question.svelte';
	import Choice from './choice.svelte';
	import { useId } from '@/utils.js';

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
		<Button variant="secondary">Settings</Button>
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

<style>
	:global(.ProseMirror:focus) {
		outline: none;
	}
</style>
