<script lang="ts">
	import '@fontsource-variable/inter/wght.css';
	import '../app.css';
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import { dev } from '$app/env';
	import favicon from '$lib/assets/favicon.svg';
	import Debug from '$lib/components/debug.svelte';
	import { getUser } from '$lib/remote/auth.remote.js';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header>
	<div></div>
	<div>
		<button>
			<Moon />
			<Sun class="hidden" />
			<span class="sr-only">Toggle Dark Mode</span>
		</button>
	</div>
</header>
{@render children()}

{#if dev}
	<Debug data={await getUser()} />
{/if}

<style>
	header {
		padding: 0 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.hidden {
		display: none;
	}
</style>
