<script lang="ts">
	import 'inter-ui/inter.css';
	import 'inter-ui/inter-variable.css';
	import '../app.css';

	import { ModeWatcher } from 'mode-watcher';

	import type { Snippet } from 'svelte';
	import type { LayoutServerData } from './$types';

	type Props = {
		children: Snippet;
		data: LayoutServerData;
	};

	let { children, data }: Props = $props();
</script>

<svelte:head>
	{#if data.colorThemeHue}
		<link rel="stylesheet" href="/color_theme/{data.colorThemeHue}.css" />
	{/if}
</svelte:head>

<ModeWatcher />
{@render children()}
