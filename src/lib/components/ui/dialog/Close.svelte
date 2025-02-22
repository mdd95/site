<script lang="ts">
	import { Dialog, type WithoutChildrenOrChild } from 'bits-ui';
	import IconX from 'svelte-lucide/X.svelte';

	let { ...restProps }: WithoutChildrenOrChild<Dialog.CloseProps> = $props();
</script>

<Dialog.Close {...restProps}>
	{#snippet child({ props })}
		<button {...props}>
			<IconX />
			<span class="sr-only">Close</span>
		</button>
	{/snippet}
</Dialog.Close>

<style>
	@reference '../../../../app.css';

	@layer components {
		button {
			@apply absolute top-4 right-4;
			@apply inline-flex cursor-pointer items-center justify-center rounded-md;
			@apply disabled:pointer-events-none;

			&:focus-visible {
				@apply ring-primary/50 ring-2 outline-none;
			}
			& :global(svg) {
				@apply size-5;
			}
		}
	}
</style>
