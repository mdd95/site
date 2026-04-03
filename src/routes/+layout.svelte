<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import '@fontsource-variable/inter/wght.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher disableHeadScriptInjection={true} />
{@render children()}
