<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';
	import Scene from '$lib/components/roll-dice/Scene.svelte';
	import type { Body } from '$lib/components/roll-dice/types.js';
	import { Button } from '$lib/components/ui/button';
	('bits-ui');

	let counter = 0;
	let bodies: Body[] = $state([
		{
			id: ++counter,
			timestamp: Date.now(),
			position: [0, 2, 0],
			rotation: [0, 0, 0]
		}
	]);

	function add() {
		bodies.push({
			id: ++counter,
			timestamp: Date.now(),
			position: [0, 2, 0],
			rotation: [0, 0, 0]
		});
	}
</script>

<div class="absolute inset-0">
	<Canvas>
		<World>
			<Scene {bodies} />
		</World>
	</Canvas>
</div>

<div class="fixed bottom-0 flex w-full justify-center py-12">
	<Button onclick={add}>Add</Button>
</div>
