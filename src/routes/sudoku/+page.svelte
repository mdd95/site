<script lang="ts">
	import { onMount } from 'svelte';
	import Sudoku from './sudoku-worker.js?worker';

	let game: Worker;

	let grid = $state.raw(new Uint8Array(81));
	let loading = $state(false);

	const size = 1080;
	const spacing = 4;
	const spacing_mult = [1, 2, 3, 5, 6, 7, 9, 10, 11];
	const cell_size = (size - 12 * spacing) / 9;

	let selection = $state<number | null>(null);

	onMount(() => {
		game = new Sudoku();

		game.addEventListener('message', (e) => {
			grid = e.data[0];
			loading = false;
		});

		generate();
	});

	function generate() {
		loading = true;
		game.postMessage('generate');
	}
</script>

<svg xmlns="" viewBox="0 0 {size} {size}" class="sudoku">
	<rect x="0" y="0" width={size} height={size} fill="#3a3a3a" />
	{#each { length: 81 }, i}
		{@const n = grid[i]}
		{@const c = i % 9}
		{@const r = Math.floor(i / 9)}
		{@const x = c * cell_size + spacing * spacing_mult[c]}
		{@const y = r * cell_size + spacing * spacing_mult[r]}
		<rect
			{x}
			{y}
			width={cell_size}
			height={cell_size}
			fill={selection === i ? '#dadada' : '#ffffff'}
			onclick={() => (selection = i)}
		/>
		<text
			x={x + cell_size * 0.5}
			y={y + cell_size * 0.5}
			fill="#000000"
			font-family="Arial, sans-serif"
			font-size="82"
			dominant-baseline="central"
			text-anchor="middle"
		>
			{n === 0 ? '' : n}
		</text>
	{/each}
</svg>
<button onclick={generate} disabled={loading}>Generate</button>

<style>
	svg.sudoku {
		width: min(100%, 32rem);
		aspect-ratio: 1 / 1;
		user-select: none;
	}

	svg.sudoku text {
		pointer-events: none;
	}
</style>
