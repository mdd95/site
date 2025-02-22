<script lang="ts">
	import { Checkbox, type WithoutChildrenOrChild } from 'bits-ui';
	import Check from 'svelte-lucide/Check.svelte';
	import Minus from 'svelte-lucide/Minus.svelte';

	let {
		checked = $bindable(false),
		indeterminate = $bindable(false),
		...restProps
	}: WithoutChildrenOrChild<Checkbox.RootProps> = $props();
</script>

<Checkbox.Root bind:checked bind:indeterminate {...restProps}>
	{#snippet child({ props, checked, indeterminate })}
		<button {...props} class={['peer', props.class]}>
			{#if indeterminate}
				<Minus />
			{:else}
				<Check class={[!checked && 'text-transparent']} />
			{/if}
		</button>
	{/snippet}
</Checkbox.Root>

<style>
	@reference '../../../app.css';

	@layer components {
		button {
			@apply box-content inline-flex size-4 cursor-pointer items-center justify-center rounded-sm;
			@apply border-muted border;

			&:focus-visible {
				@apply ring-primary/50 ring-2 outline-none;
			}
			&:disabled {
				@apply pointer-events-none cursor-default opacity-50;
			}
			&[data-state='checked'] {
				@apply border-primary bg-primary text-primary-foreground;
			}
			& :global(svg) {
				@apply size-3.5;
			}
		}
	}
</style>
