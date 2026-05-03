<script lang="ts">
	import { getLocalTimeZone, now } from '@internationalized/date';
	import { Button } from 'bits-ui';
	import { toggleMode } from 'mode-watcher';
	import { resolve } from '$app/paths';
	import { createViewTransition } from '$lib/utils.svelte.js';
	import Palette from '@lucide/svelte/icons/palette';
	import PaperCrane from '$lib/assets/icons/PaperCrane.svelte';

	const ranges = [
		{ start: 0, end: 6, greeting: 'Good night' },
		{ start: 6, end: 12, greeting: 'Good morning' },
		{ start: 12, end: 18, greeting: 'Good afternoon' },
		{ start: 18, end: 24, greeting: 'Good evening' }
	];

	let time = $state(now(getLocalTimeZone()));
	let greeting = $derived(
		ranges.find((range) => time.hour >= range.start && time.hour <= range.end)?.greeting ??
			'Welcome'
	);
</script>

<header>
	<nav>
		<div>
			<a href={resolve('/')}>
				<PaperCrane size="32" />
				<div>mjayar.com</div>
			</a>
		</div>
		<div>
			<Button.Root class="secondary" onclick={() => createViewTransition(toggleMode)}>
				<Palette size="16" />
			</Button.Root>
		</div>
	</nav>
</header>

<main>
	<h1>{greeting}!</h1>
</main>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 99;
		height: 3.5rem;
	}

	a {
		display: flex;
		align-items: center;
		gap: 0.325rem;
		color: var(--color-foreground);
		font-size: 0.875rem;
		font-weight: 500;
		text-decoration: none;
	}

	nav {
		margin-inline: 1rem;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	main {
		display: grid;
		place-items: center;
		height: calc(100dvh - 3.5rem);
	}
</style>
