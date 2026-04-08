<script lang="ts">
	import { cubicInOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';
	import type { TweenOptions } from 'svelte/motion';

	type Props = {
		x: number;
		y: number;
		b: number;
	};

	const tweenOptions: TweenOptions<number> = {
		easing: cubicInOut,
		duration: 200
	};

	let { x, y, b }: Props = $props();
	let r1 = $derived(b >> 2);
	let r2 = $derived(b & 3);
	let a = $derived(r1 === 0 && r2 === 0);

	let t1 = Tween.of(() => (a ? 45 : r1 * 90), tweenOptions);
	let t2 = Tween.of(() => (a ? 45 : r2 * 90), tweenOptions);
</script>

<circle cx={x + 50} cy={y + 50} r={49} />
<rect
	width={5}
	height={48}
	x={x + 47.5}
	y={y + 50}
	transform="rotate({t1.current} {x + 50} {y + 50})"
/>
<rect
	width={5}
	height={48}
	x={x + 47.5}
	y={y + 50}
	transform="rotate({t2.current} {x + 50} {y + 50})"
/>

<style>
	circle {
		stroke: none;
		fill: color-mix(in lab, var(--color-foreground) 5%, transparent);
	}

	rect {
		stroke: none;
		fill: var(--color-primary);
	}
</style>
