<script lang="ts">
	import '../styles/index.js';
	import favicon from '#lib/assets/favicon.svg';
	import { initTheme, preloadScript } from '#lib/client/theme-preload.js';

	let { children } = $props();
	initTheme();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	{@html preloadScript}
</svelte:head>

{@render children()}
