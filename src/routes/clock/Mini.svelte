<script lang="ts">
	import { cubicInOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';

	type Props = {
		x: number;
		y: number;
		rot: [number, number];
	};

	let { x, y, rot }: Props = $props();

	let rot1 = Tween.of(() => rot[0], { easing: cubicInOut, duration: 200 });
	let rot2 = Tween.of(() => rot[1], { easing: cubicInOut, duration: 200 });

	let color = 'green';
</script>

<circle cx={x + 50} cy={y + 50} r="49" fill="#ffffff10" stroke-width="2" />
<rect
	width="5"
	height="48"
	x={x + 47.5}
	y={y + 50}
	stroke="none"
	fill={color}
	transform="rotate({rot1.current} {x + 50} {y + 50})"
/>
<rect
	width="5"
	height="48"
	x={x + 47.5}
	y={y + 50}
	stroke="none"
	fill={color}
	transform="rotate({rot2.current} {x + 50} {y + 50})"
/>
