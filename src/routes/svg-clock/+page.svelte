<script lang="ts">
	import { useInterval } from '$lib/hooks/use-interval.svelte.js';
	import MiniClock from './MiniClock.svelte';

	const numbers = [
		new Uint8Array([55, 113, 35, 18, 34, 34, 34, 34, 43, 98, 183, 118]),
		new Uint8Array([55, 16, 177, 32, 2, 32, 2, 32, 54, 177, 183, 118]),
		new Uint8Array([55, 113, 183, 18, 55, 98, 35, 118, 43, 113, 183, 118]),
		new Uint8Array([55, 113, 183, 18, 55, 98, 183, 18, 55, 98, 183, 118]),
		new Uint8Array([49, 49, 34, 34, 43, 98, 183, 18, 0, 34, 0, 182]),
		new Uint8Array([55, 113, 35, 118, 43, 113, 183, 18, 55, 98, 183, 118]),
		new Uint8Array([55, 113, 35, 118, 43, 113, 35, 18, 43, 98, 183, 118]),
		new Uint8Array([55, 113, 183, 18, 0, 34, 0, 34, 0, 34, 0, 182]),
		new Uint8Array([55, 113, 35, 18, 43, 98, 35, 18, 43, 98, 183, 118]),
		new Uint8Array([55, 113, 35, 18, 43, 98, 183, 18, 55, 98, 183, 118])
	];

	let now = $state(new Date());
	let t = $derived({ h: now.getHours(), m: now.getMinutes(), s: now.getSeconds() });

	useInterval(() => {
		now = new Date();
	}, 1000);
</script>

{#snippet bits(x: number, y: number, b: number)}
	<MiniClock {x} {y} b={b >> 4} />
	<MiniClock x={100 + x} {y} b={b & 15} />
{/snippet}

<main>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2600 600">
		{#each { length: 12 }, i}
			{@render bits(200 * (i % 2), 100 * Math.floor(i / 2), numbers[Math.floor(t.h / 10)][i])}
			{@render bits(400 + 200 * (i % 2), 100 * Math.floor(i / 2), numbers[t.h % 10][i])}
			{@render bits(
				900 + 200 * (i % 2),
				100 * Math.floor(i / 2),
				numbers[Math.floor(t.m / 10)][i]
			)}
			{@render bits(1300 + 200 * (i % 2), 100 * Math.floor(i / 2), numbers[t.m % 10][i])}
			{@render bits(
				1800 + 200 * (i % 2),
				100 * Math.floor(i / 2),
				numbers[Math.floor(t.s / 10)][i]
			)}
			{@render bits(2200 + 200 * (i % 2), 100 * Math.floor(i / 2), numbers[t.s % 10][i])}
		{/each}
	</svg>
</main>

<style>
	main {
		min-height: 100vh;
		padding: 1rem;
		display: grid;
		place-items: center;
	}
</style>
