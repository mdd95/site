<script lang="ts">
	import { onMount } from 'svelte';
	import { angles, numbers } from './constants.js';
	import Mini from './Mini.svelte';

	let date = $state(new Date());
	let h = $derived(date.getHours());
	let m = $derived(date.getMinutes());
	let s = $derived(date.getSeconds());

	onMount(() => {
		setInterval(() => {
			date = new Date();
		}, 1000);
	});
</script>

<div class="wrapper">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2600 600">
		{#each { length: 24 }, i (i)}
			<Mini
				x={100 * (i % 4)}
				y={100 * Math.floor(i / 4)}
				rot={angles[numbers[Math.floor(h / 10)][i]]}
			/>
			<Mini
				x={400 + 100 * (i % 4)}
				y={100 * Math.floor(i / 4)}
				rot={angles[numbers[h % 10][i]]}
			/>
			<Mini
				x={900 + 100 * (i % 4)}
				y={100 * Math.floor(i / 4)}
				rot={angles[numbers[Math.floor(m / 10)][i]]}
			/>
			<Mini
				x={1300 + 100 * (i % 4)}
				y={100 * Math.floor(i / 4)}
				rot={angles[numbers[m % 10][i]]}
			/>
			<Mini
				x={1800 + 100 * (i % 4)}
				y={100 * Math.floor(i / 4)}
				rot={angles[numbers[Math.floor(s / 10)][i]]}
			/>
			<Mini
				x={2200 + 100 * (i % 4)}
				y={100 * Math.floor(i / 4)}
				rot={angles[numbers[s % 10][i]]}
			/>
		{/each}
	</svg>
</div>

<style>
	.wrapper {
		height: 100vh;
		display: grid;
		place-items: center;
	}

	svg {
		width: 90%;
	}
</style>
