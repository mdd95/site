<script lang="ts">
	import type { Snippet } from 'svelte';

	type NavbarProps = {
		children?: Snippet;
	};
	let { children }: NavbarProps = $props();
</script>

<header class="bg-background">
	<div class="container mx-auto flex h-16 items-center justify-between px-4">
		{@render children?.()}
	</div>
</header>
