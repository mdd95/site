<script lang="ts">
	import { Dialog, type WithoutChildrenOrChild } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import Close from './Close.svelte';
	import Overlay from './Overlay.svelte';

	let {
		children,
		closeBtn = true,
		portalProps,
		...restProps
	}: WithoutChildrenOrChild<Dialog.ContentProps> & {
		children?: Snippet;
		closeBtn?: boolean;
		portalProps?: Dialog.PortalProps;
	} = $props();
</script>

<Dialog.Portal {...portalProps}>
	<Overlay />
	<Dialog.Content {...restProps}>
		{#snippet child({ props })}
			<div {...props}>
				{@render children?.()}
				{#if closeBtn}
					<Close />
				{/if}
			</div>
		{/snippet}
	</Dialog.Content>
</Dialog.Portal>

<style>
	@reference '../../../../app.css';

	@layer components {
		div {
			@apply bg-elevated border-elevated-2;
			@apply fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
			@apply grid max-h-[calc(100vh-4rem)] w-full max-w-lg gap-4 rounded-lg border-2 p-6 shadow-lg duration-200;

			&[data-state='open'] {
				@apply animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2;
			}
			&[data-state='closed'] {
				@apply animate-out fade-out-0 zoom-out-95 slide-out-to-bottom-2;
			}
		}
	}
</style>
