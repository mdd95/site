<script lang="ts">
	import { initializeTheme, provideThemeContext } from '$lib/theme-context.js';
	import { THEME_STORAGE_KEY } from '$lib/theme-mode.svelte.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	provideThemeContext();
</script>

<svelte:head>
	{@html `<script>(${initializeTheme.toString()})("${THEME_STORAGE_KEY}");</script>`}
</svelte:head>
{@render children()}
