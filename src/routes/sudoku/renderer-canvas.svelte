<script lang="ts">
	import { onMount } from 'svelte';

	const BASE_WIDTH = 2000;
	const MINOR_GRIDLINE = 4;
	const MAJOR_GRIDLINE = 12;
	const COLOR_BACKGROUND = '#FFFFFF';
	const COLOR_PRIMARY = '#325AAF';
	const COLOR_SECONDARY = '#344861';
	const COLOR_HIGHLIGHT = '#E2EBF3';
	const CELL_SIZE = Math.floor((BASE_WIDTH - 6 * MINOR_GRIDLINE - 4 * MAJOR_GRIDLINE) / 9);
	const CANVAS_SIZE = CELL_SIZE * 9 + 6 * MINOR_GRIDLINE + 4 * MAJOR_GRIDLINE;

	let canvas: HTMLCanvasElement | null = null;
	let active_cell = $state<number | null>(null);

	function draw_gridlines(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = COLOR_SECONDARY;

		for (let i = 0; i < 4; i++) {
			const offset = i * MAJOR_GRIDLINE + 2 * i * MINOR_GRIDLINE + 3 * i * CELL_SIZE;
			ctx.fillRect(offset, 0, MAJOR_GRIDLINE, CANVAS_SIZE);
			ctx.fillRect(0, offset, CANVAS_SIZE, MAJOR_GRIDLINE);
		}

		ctx.fillStyle = COLOR_SECONDARY + '80';

		for (let i = 0; i < 6; i++) {
			const j = Math.floor(i * 0.5) + 1;
			const offset = j * MAJOR_GRIDLINE + i * MINOR_GRIDLINE + (j + i) * CELL_SIZE;
			ctx.fillRect(offset, 0, MINOR_GRIDLINE, CANVAS_SIZE);
			ctx.fillRect(0, offset, CANVAS_SIZE, MINOR_GRIDLINE);
		}
	}

	function on_outside_click(e: PointerEvent) {
		if (e.target === canvas) {
			return;
		}
		active_cell = null;
	}

	onMount(() => {
		window.addEventListener('pointerdown', on_outside_click);
		return () => {
			window.removeEventListener('pointerdown', on_outside_click);
		};
	});


	function attach_renderer(node: HTMLCanvasElement) {
		const ctx = node.getContext('2d');
		if (ctx === null) return;

		draw_gridlines(ctx);
	}
</script>

<canvas width={CANVAS_SIZE} height={CANVAS_SIZE} {@attach attach_renderer}></canvas>

<style>
	canvas {
		width: min(100%, 32rem);
		aspect-ratio: 1 / 1;
		margin: auto 0;
	}
</style>
