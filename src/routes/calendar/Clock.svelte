<script lang="ts">
	import { onMount } from 'svelte';

	let d = $state(new Date());
	let t = $derived.by(() => {
		return {
			h: d.getHours(),
			m: d.getMinutes(),
			s: d.getSeconds()
		};
	});

	onMount(() => {
		const update = () => {
			d = new Date();
		};
		update();
		const interval = setInterval(update, 1000 / 15);

		return () => {
			clearInterval(interval);
		};
	});

	const pad = (s: number) => s.toString().padStart(2, '0');
</script>

<p>{pad(t.h)}:{pad(t.m)}:{pad(t.s)}</p>
