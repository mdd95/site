<script lang="ts">
	import { onMount } from 'svelte';
	import { on } from 'svelte/events';
	import { useAnimationFrame } from '$lib/utils.svelte.js';

	let offsetX = 0;
	let offsetY = 0;
	let screenX = 0;
	let screenY = 0;
	let sizeX = 0;
	let sizeY = 0;
	let velocityX = 3;
	let velocityY = 2;
	let posX = $state(0);
	let posY = $state(0);
	let color = $state(randomColor());
	let p = $state<SVGPathElement>();

	onMount(() => {
		if (!p) return;
		const box = p.getBBox();
		offsetX = box.x * -10;
		offsetY = box.y * -10;
		sizeX = box.width * 10;
		sizeY = box.height * 10;
		screenX = window.innerWidth - sizeX + offsetX;
		screenY = window.innerHeight - sizeY + offsetY;
		posX = Math.floor(Math.random() * screenX);
		posY = Math.floor(Math.random() * screenY);
	});

	function randomColor() {
		const r = Math.floor(Math.random() * 255);
		const g = Math.floor(Math.random() * 255);
		const b = Math.floor(Math.random() * 255);
		return `rgb(${r}, ${g}, ${b})`;
	}

	useAnimationFrame(() => {
		posX += velocityX;
		posY += velocityY;
		if (posX >= screenX || posX <= offsetX) {
			velocityX *= -1;
			color = randomColor();
		}
		if (posY >= screenY || posY <= offsetY) {
			velocityY *= -1;
			color = randomColor();
		}
	});

	$effect(() => {
		return on(window, 'resize', () => {
			screenX = window.innerWidth - sizeX + offsetX;
			screenY = window.innerHeight - sizeY + offsetY;
		});
	});
</script>

<svelte:head>
	<title>Bouncing DVD</title>
</svelte:head>

<main>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="240"
		height="240"
		viewBox="0 0 24 24"
		fill={color}
		style:--_pos-x="{posX}px"
		style:--_pos-y="{posY}px"
	>
		<path
			bind:this={p}
			d="M11.443 13.76C6.228 13.76 2 14.372 2 15.128S6.228 16.5 11.443 16.5s9.454-.612 9.454-1.368s-4.23-1.372-9.454-1.372m-.334 1.854c-1.2 0-2.158-.207-2.158-.459s.96-.459 2.158-.459s2.15.206 2.15.459s-.958.459-2.15.459M18.765 7.5h-4.088a104 104 0 0 0-1.286 1.557a20 20 0 0 0-1.29 1.743a13 13 0 0 0-.5-1.761s-.123-.36-.51-1.539H3.718l-.256 1.111h2.387c1.242 0 2.001.513 1.789 1.422c-.23.991-1.313 1.413-2.467 1.413h-.432l.555-2.421H3.365l-.819 3.537h2.739c2.062 0 4.018-1.106 4.371-2.529a2.75 2.75 0 0 0-.106-1.3a.4.4 0 0 0-.018-.054c-.008-.009-.017-.072.018-.081c.017-.009.053.027.053.036s.018.045.035.081l1.744 5.032l4.44-5.122l1.879-.014h.458c1.244 0 2.01.513 1.801 1.422c-.229.99-1.32 1.413-2.476 1.413h-.44l.557-2.421h-1.929l-.819 3.537h2.739c2.062 0 4.036-1.106 4.362-2.529S20.844 7.5 18.765 7.5"
		/>
	</svg>
</main>

<style>
	main {
		position: relative;
		height: 100vh;
		overflow: hidden;
	}

	svg {
		position: absolute;
		top: var(--_pos-y, 0);
		left: var(--_pos-x, 0);
	}
</style>
