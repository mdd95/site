<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Breadcrumb from '@/components/ui/breadcrumb';

	import Trash from 'svelte-radix/Trash.svelte';
	import LightSwitch from '@/components/light-switch.svelte';
	import Question from './question.svelte';
	import Choice from './choice.svelte';

	import type { PageServerData } from './$types';
	import 'prosemirror-view/style/prosemirror.css';

	type Props = {
		data: PageServerData;
	};

	let { data }: Props = $props();

	let problems = $state(
		(data.result.content as {
			id: string;
			question: { value: string };
			choices: { name: string; value: string }[];
		}[]) || []
	);

	async function save() {
		const content = $state.snapshot(problems);

		await fetch(`/problem_set/${data.result.id}/`, {
			method: 'PATCH',
			body: JSON.stringify(content),
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

<div class="container">
	<div class="py-4">
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/problem_set">Problem Sets</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>{data.result.title || 'Untitled Problem Set'}</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>

	{#each problems as prob, i}
		<div class="px-2">
			<div class="mb-4 flex justify-end">
				<Button
					variant="ghost"
					size="icon"
					onclick={() => {
						problems = problems.filter((i) => {
							const a = $state.snapshot(i).id;
							const b = $state.snapshot(prob).id;
							return a !== b;
						});
					}}
				>
					<Trash />
				</Button>
			</div>

			<div
				class="mb-4 rounded-md border p-4 shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
			>
				<Question bind:htmlContent={prob.question}>
					{@html $state.snapshot(prob.question.value)}
				</Question>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				{#each prob.choices as choice, i}
					<div
						class="grid grid-cols-[auto_1fr] rounded-md border p-4 shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
					>
						<div class="mr-4">
							<input type="radio" name="problem-1" />
							<label for="" class="text-muted-foreground">{choice.name}</label>
						</div>
						<Choice bind:htmlContent={prob.choices[i]}>
							{@html $state.snapshot(choice.value)}
						</Choice>
					</div>
				{/each}
			</div>
		</div>
	{/each}

	<div class="flex gap-4">
		<Button
			onclick={() => {
				problems.push({
					id: crypto.randomUUID(),
					question: { value: '' },
					choices: [
						{ name: 'A', value: '' },
						{ name: 'B', value: '' },
						{ name: 'C', value: '' },
						{ name: 'D', value: '' }
					]
				});
			}}>+</Button
		>
		<Button onclick={save}>Save</Button>
	</div>
</div>

<style>
	:global(.ProseMirror:focus) {
		outline: none;
	}
</style>
