<script lang="ts">
	import { onMount } from 'svelte';
	import Sudoku from './sudoku-worker.js?worker';

	let game: Worker;

	let grid = $state.raw(new Uint8Array(81));
	let loading = $state(false);

	onMount(() => {
		game = new Sudoku();

		game.addEventListener('message', (e) => {
			grid = e.data[0];
			loading = false;
		});
	});

	function generate() {
		loading = true;
		game.postMessage('generate');
	}
</script>

<div class="grid">
	{#each grid as m, i (i)}
		<div class="cell">{m === 0 ? ' ' : m}</div>
	{/each}
</div>
<button onclick={generate} disabled={loading}>Generate</button>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(9, 2rem);
		grid-template-rows: repeat(9, 2rem);
	}

	.cell {
		border: 1px solid #121212;
		display: grid;
		place-items: center;
	}
</style>
