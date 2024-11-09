<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { bindContentToProxy, RichText } from '@/components/rich-text';
	import Trash from 'svelte-radix/Trash.svelte';
	import type { PageServerData } from './$types';

	type Props = {
		data: PageServerData;
	};

	let { data }: Props = $props();

	let problems = $state(data.content as any[]);

	async function save() {
		const content = $state.snapshot(problems);
		await fetch(`/probset/${data.id}/edit/`, {
			method: 'PATCH',
			body: JSON.stringify(content),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
</script>

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

		<RichText
			class="mb-4 rounded-md border p-4 shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
			content={prob.question.value}
			plugins={({ schema }) => [bindContentToProxy(schema, prob.question)]}
		>
			<p class="mb-2 text-muted-foreground">Problem {i + 1}</p>
		</RichText>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			{#each prob.choices as choice}
				<div
					class="grid grid-cols-[auto_1fr] rounded-md border p-4 shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
				>
					<div class="mr-4">
						<input type="radio" name="problem-1" />
						<label for="" class="text-muted-foreground">{choice.name}</label>
					</div>
					<RichText
						content={choice.value}
						plugins={({ schema }) => [bindContentToProxy(schema, choice)]}
					></RichText>
				</div>
			{/each}
		</div>
	</div>
{/each}

<div class="flex gap-4">
	<Button
		onclick={() => {
			problems.push({
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
