<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { bindContentToProxy, ProseMirror } from '@/components/prosemirror';
	import {
		backspaceMath,
		createMathSchema,
		insertMathCommand,
		makeMathDisplayInputRule,
		makeMathInlineInputRule,
		mathPlugin,
		REGEX_MATH_DISPLAY,
		REGEX_MATH_INLINE
	} from '@/components/prosemirror/plugins/math.js';
	import Trash from 'svelte-radix/Trash.svelte';
	import type { PageServerData } from './$types';
	import { inputRules } from 'prosemirror-inputrules';
	import {
		chainCommands,
		deleteSelection,
		joinBackward,
		selectNodeBackward
	} from 'prosemirror-commands';
	import { placeholder } from '@/prosemirror/plugins/placeholder.js';

	type Props = {
		data: PageServerData;
	};

	let { data }: Props = $props();

	let problems = $state(data.result.content as any[]);

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

		<ProseMirror
			class="mb-4 rounded-md border p-4 shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
			content={prob.question.value}
			extend={{ nodes: createMathSchema() }}
			keymap={({ schema }) => {
				const backspace = chainCommands(
					backspaceMath,
					deleteSelection,
					joinBackward,
					selectNodeBackward
				);
				return {
					Backspace: backspace,
					'Mod-Backspace': backspace,
					'Shift-Backspace': backspace,
					'Alt-=': insertMathCommand(schema.nodes.math_inline)
				};
			}}
			plugins={({ schema }) => [
				bindContentToProxy(schema, prob.question),
				mathPlugin,
				inputRules({
					rules: [
						makeMathInlineInputRule(REGEX_MATH_INLINE, schema.nodes.math_inline),
						makeMathDisplayInputRule(REGEX_MATH_DISPLAY, schema.nodes.math_display)
					]
				}),
				placeholder('Enter your question...')
			]}
		/>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			{#each prob.choices as choice}
				<div
					class="grid grid-cols-[auto_1fr] rounded-md border p-4 shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
				>
					<div class="mr-4">
						<input type="radio" name="problem-1" />
						<label for="" class="text-muted-foreground">{choice.name}</label>
					</div>
					<ProseMirror
						content={choice.value}
						plugins={({ schema }) => [bindContentToProxy(schema, choice)]}
					/>
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
