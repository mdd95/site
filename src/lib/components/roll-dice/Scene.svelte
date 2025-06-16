<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls, useDraco, useGltf } from '@threlte/extras';
	import { AutoColliders, Collider, RigidBody } from '@threlte/rapier';
	import diceAssetPath from '$lib/assets/dice.glb?url';
	import type { Body } from './types.js';

	type Props = {
		bodies: Body[];
	};
	let { bodies }: Props = $props();

	const dracoLoader = useDraco();
	const model = useGltf(diceAssetPath, { dracoLoader });
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
{#each bodies as body (body.id)}
	<T.Group position={body.position}>
		<RigidBody>
			<Collider shape="cuboid" args={[0.1, 0.1, 0.1]} />
			{#if $model}
				<T is={$model.scene.clone()} scale={0.1} />
			{/if}
		</RigidBody>
	</T.Group>
{/each}
