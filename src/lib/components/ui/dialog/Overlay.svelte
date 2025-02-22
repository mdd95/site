<script lang="ts">
	import { Dialog, type WithoutChildrenOrChild } from 'bits-ui';

	let { ...restProps }: WithoutChildrenOrChild<Dialog.OverlayProps> = $props();
</script>

<Dialog.Overlay {...restProps}>
	{#snippet child({ props })}
		<div {...props}></div>
	{/snippet}
</Dialog.Overlay>

<style>
	@reference '../../../../app.css';

	@layer components {
		div {
			@apply fixed inset-0 bg-black/40;

			&[data-state='open'] {
				@apply animate-in fade-in-0;
			}
			&[data-state='closed'] {
				@apply animate-out fade-out-0;
			}
		}
	}
</style>
