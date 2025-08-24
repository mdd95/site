<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { setThemeMode } from '$lib/theme-manager.svelte.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	setThemeMode();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
