<script lang="ts">
	import { Portal } from 'bits-ui';
	import { Vector3 } from 'three';
	import { T } from '@threlte/core';
	import { OrbitControls, useDraco, useGltf } from '@threlte/extras';
	import { AutoColliders, Collider, RigidBody } from '@threlte/rapier';
	import diceAssetPath from '$lib/assets/dice.glb?url';
	import { Button } from '$lib/components/ui/button/index.js';
	import { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';

	const dracoLoader = useDraco();
	const model = useGltf(diceAssetPath, { dracoLoader });

	let count = $state(2);
	let bodies = $state<RapierRigidBody[]>([]);
	$inspect(bodies);

	function createRigidBody(ref: RapierRigidBody, i: number) {
		let position = new Vector3(0, i + 3, 0);
		ref.setTranslation(position, true);
		bodies.push(ref);
	}

	function add() {
		count += 1;
	}

	function reroll() {
		for (let i = 0; i < count; i++) {
			let position = new Vector3(0, i + 3, 0);
			bodies[i].setTranslation(position, true);
		}
	}
</script>

<T.Color args={[0x000000]} attach="background" />
<T.Fog args={[0x000000, 0, 20]} attach="fog" />
<T.AmbientLight intensity={0.5} />
<T.DirectionalLight args={[0xffffff, 2]} position={[0, 0.75, -0.5]} />
<T.DirectionalLight args={[0xffffff, 2]} position={[0, 0.75, 0.5]} />
<T.PerspectiveCamera
	makeDefault
	position={[2.5, 2, -2.5]}
	oncreate={(ref) => {
		ref.lookAt(0, 0, 0);
	}}
>
	<OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2 - 0.1} />
</T.PerspectiveCamera>
<T.Group position={[0, -0.05, 0]}>
	<AutoColliders shape="cuboid" friction={0.5} restitution={0.75}>
		<T.Mesh>
			<T.BoxGeometry args={[50, 0.1, 50]} />
			<T.MeshStandardMaterial color={0x121212} roughness={0.5} metalness={1} />
		</T.Mesh>
	</AutoColliders>
</T.Group>
{#each { length: count }, i}
	<T.Group>
		<RigidBody oncreate={(ref) => createRigidBody(ref, i)}>
			<Collider shape="cuboid" args={[0.1, 0.1, 0.1]} />
			{#if $model}
				<T is={$model.scene.clone()} scale={0.1} />
			{/if}
		</RigidBody>
	</T.Group>
{/each}

<Portal>
	<div class="fixed bottom-0 z-10 flex w-full justify-center gap-2 py-12">
		<Button variant="secondary" onclick={add}>Add</Button>
		<Button onclick={reroll}>Reroll</Button>
	</div>
</Portal>
