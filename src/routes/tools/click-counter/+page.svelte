<script lang="ts">
	import NumberFlow from '@number-flow/svelte';
	import Plus from 'svelte-lucide/Plus.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Dialog from '$lib/components/ui/dialog/index.js';
	import Navbar from '$lib/components/ui/Navbar.svelte';
	import Slider from '$lib/components/ui/Slider.svelte';
	import ThemeSelect from '$lib/components/app/ThemeSelect.svelte';

	let counter = $state(0);
	let addend = $state(1);
</script>

<svelte:head>
	<title>Click Counter</title>
</svelte:head>

<div class="layout">
	<Navbar>
		<div></div>
		<ThemeSelect />
	</Navbar>
	<div class="display">
		<NumberFlow value={counter} animated={true} willChange />
	</div>
	<div class="flex flex-col space-y-4">
		<div class="flex justify-center py-8">
			<Button class="btn" onclick={() => (counter += addend)}>
				<Plus />
			</Button>
		</div>
		<div class="flex justify-center space-x-2 py-4">
			<Button class="elevated" onclick={() => (counter = 0)}>Reset</Button>
			{@render optionsDialog()}
		</div>
	</div>
</div>

{#snippet optionsDialog()}
	<Dialog.Root>
		<Dialog.Trigger class="elevated">
			{#snippet child({ props })}
				<Button {...props}>Options</Button>
			{/snippet}
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Title>Options</Dialog.Title>
			<div class="text-center text-4xl">{addend}</div>
			<Slider type="single" bind:value={addend} min={1} max={10} />
		</Dialog.Content>
	</Dialog.Root>
{/snippet}

<style>
	@reference '../../../app.css';

	@layer components {
		.layout {
			@apply grid min-h-screen;
			grid-template-rows: calc(var(--spacing) * 16) 1fr auto;
		}

		.display {
			@apply grid place-items-center;
			@apply text-8xl tabular-nums;
		}

		.layout :global(.btn) {
			@apply size-20 rounded-full [&>svg]:size-10;
		}
	}
</style>
