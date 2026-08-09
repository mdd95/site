<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';
	import Scene from '$lib/components/roll-dice/Scene.svelte';
</script>

<div class="absolute inset-0">
	<Canvas>
		<World>
			<Scene />
		</World>
	</Canvas>
</div>
