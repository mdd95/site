<script lang="ts">
	import '@fontsource-variable/inter/wght.css';
	import '../app.css';
	import { dev } from '$app/env';
	import favicon from '$lib/assets/favicon.svg';
	import Debug from '$lib/components/debug.svelte';
	import { getUser } from '$lib/remote/auth.remote.js';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
{@render children()}

{#if dev}
	<Debug data={await getUser()} />
{/if}
