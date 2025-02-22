<script lang="ts">
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	let {
		children,
		href = undefined,
		...restProps
	}: HTMLButtonAttributes & HTMLAnchorAttributes = $props();
</script>

{#if href}
	<a {href} {...restProps}>
		{@render children?.()}
	</a>
{:else}
	<button {...restProps}>
		{@render children?.()}
	</button>
{/if}

<style>
	@reference '../../../app.css';

	@layer components {
		a,
		button {
			@apply inline-flex h-10 items-center justify-center gap-2 px-4;
			@apply cursor-pointer rounded-md whitespace-nowrap transition-colors;
			@apply bg-primary text-primary-foreground;

			&:focus-visible {
				@apply ring-primary/50 ring-2 outline-none;
			}
			&:disabled {
				@apply pointer-events-none opacity-50;
			}
			& :global(svg) {
				@apply pointer-events-none size-5 shrink-0;
			}
			&.ghost {
				@apply hover:bg-ghost bg-transparent text-inherit;
			}
			&.link {
				@apply text-primary/80 hover:text-primary;
			}
			&.icon {
				@apply size-10;
			}
		}
	}
</style>
