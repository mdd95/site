<script lang="ts">
	import { onMount } from 'svelte';
	import Sudoku from './sudoku-worker.js?worker';
	import RendererCanvas from './renderer-canvas.svelte';

	let game: Worker;

	let grid = $state.raw(new Uint8Array(81));
	let solution = $state<number[]>([]);
	let loading = $state(false);

	const size = 960;
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

		function keyup(e: KeyboardEvent) {
			if (selection == null) return;

			const row = Math.floor(selection / 9);
			const col = selection % 9;

			const move = {
				ArrowUp: () => row > 0 && (selection! -= 9),
				ArrowDown: () => row < 8 && (selection! += 9),
				ArrowLeft: () => col > 0 && (selection! -= 1),
				ArrowRight: () => col < 8 && (selection! += 1),
				w: () => row > 0 && (selection! -= 9),
				s: () => row < 8 && (selection! += 9),
				a: () => col > 0 && (selection! -= 1),
				d: () => col < 8 && (selection! += 1),
			};

			if (move[e.key]) {
				move[e.key]();
				return;
			}

			if (/^[1-9]$/.test(e.key)) {
				solution[selection] = Number(e.key);
			} else if (e.key === '0' || e.key === 'Backspace' || e.key === 'Delete') {
				solution[selection] = 0;
			}
		}

		window.addEventListener('keyup', keyup);
		return () => {
			window.removeEventListener('keyup', keyup);
		};
	});

	function generate() {
		loading = true;
		game.postMessage('generate');
	}
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" class="sudoku">
	<rect x="0" y="0" width={size} height={size} fill="#3a3a3a" />
	{#each { length: 81 }, i}
		{@const n = grid[i]}
		{@const m = solution[i]}
		{@const c = i % 9}
		{@const r = Math.floor(i / 9)}
		{@const x = c * cell_size + spacing * spacing_mult[c]}
		{@const y = r * cell_size + spacing * spacing_mult[r]}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<rect
			{x}
			{y}
			width={cell_size}
			height={cell_size}
			fill={selection === i ? '#dadada' : '#ffffff'}
			onclick={() => (selection = i)}
			role="gridcell"
			tabindex="-1"
			aria-label="{'abcdefghi'[r]}{c + 1}"
		/>
		<text
			x={x + cell_size * 0.5}
			y={y + cell_size * 0.5}
			fill="#000000"
			font-family="Arial, sans-serif"
			font-size={cell_size * 0.7}
			dominant-baseline="central"
			text-anchor="middle"
		>
			{n === 0 ? (m === 0 ? '' : m) : n}
		</text>
	{/each}
</svg>
<button onclick={generate} disabled={loading}>Generate</button>
<RendererCanvas />

<style>
	.sudoku {
		width: min(100%, 32rem);
		aspect-ratio: 1 / 1;
		user-select: none;

		rect {
			outline: none;
		}

		text {
			pointer-events: none;
		}
	}
</style>
