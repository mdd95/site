<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<header>
	<div>
		{@render children?.()}
	</div>
</header>

<style>
	@reference '../../../app.css';

	@layer components {
		header {
			@apply bg-background;
		}
		div {
			@apply container mx-auto flex h-16 items-center justify-between px-4;
		}
	}
</style>
