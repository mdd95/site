<script lang="ts">
	import { onMount } from 'svelte';
	import Sudoku from './sudoku-worker.js?worker';

	let game: Worker;
	let d = $state.raw(new Uint8Array(81));

	onMount(() => {
		game = new Sudoku();

		game.addEventListener('message', (e) => {
			console.log(e.data);
			d = e.data;
		});
	});

	function generate() {
		game.postMessage('generate');
	}
</script>

<button onclick={generate}>Generate</button>

<div class="grid">
	{#each d as m, i (i)}
		<div class="cell">{m === 0 ? ' ' : m}</div>
	{/each}
</div>

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
