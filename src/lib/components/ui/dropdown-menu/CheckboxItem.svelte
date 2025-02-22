<script lang="ts">
	import { DropdownMenu, type WithoutChildrenOrChild } from 'bits-ui';
	import Check from 'svelte-lucide/Check.svelte';
	import Minus from 'svelte-lucide/Minus.svelte';
	import type { Snippet } from 'svelte';

	let {
		children,
		checked = $bindable(false),
		indeterminate = $bindable(false),
		...restProps
	}: WithoutChildrenOrChild<DropdownMenu.CheckboxItemProps> & {
		children?: Snippet;
	} = $props();
</script>

<DropdownMenu.CheckboxItem bind:checked bind:indeterminate {...restProps}>
	{#snippet child({ props, checked, indeterminate })}
		<button {...props} class={['peer', props.class]}>
			<span>
				{#if indeterminate}
					<Minus />
				{:else}
					<Check class={[!checked && 'text-transparent']} />
				{/if}
			</span>
			{@render children?.()}
		</button>
	{/snippet}
</DropdownMenu.CheckboxItem>

<style>
	@reference '../../../../app.css';

	@layer components {
		button {
			@apply relative flex w-full cursor-default items-center gap-2 px-3 py-1.5 transition-colors duration-150 outline-none select-none;

			&[data-disabled] {
				@apply pointer-events-none opacity-50;
			}
			&[data-highlighted] {
				@apply bg-primary text-primary-foreground;
			}
			& :global(svg) {
				@apply size-4 shrink-0;
			}
		}
	}
</style>
