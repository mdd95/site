<script lang="ts">
	import NumberFlow from '@number-flow/svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Navbar } from '$lib/components/ui/navbar/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import ThemeSelect from '$lib/components/app/theme-select.svelte';

	let counter = $state(0);
	let addend = $state(1);
</script>

<svelte:head>
	<title>Click Counter</title>
</svelte:head>

<div class="grid min-h-screen grid-rows-[--spacing(16)_1fr_auto]">
	<Navbar>
		<div></div>
		<ThemeSelect />
	</Navbar>
	<div class="grid place-content-center text-5xl tabular-nums md:text-8xl">
		<NumberFlow value={counter} animated={true} willChange />
	</div>
	<div class="flex flex-col space-y-4">
		<div class="flex justify-center py-8">
			<Button
				class="size-20 rounded-full [&>svg]:size-10"
				onclick={() => (counter += addend)}
			>
				<Plus />
			</Button>
		</div>
		<div class="flex justify-center space-x-2 py-4">
			<Button variant="secondary" onclick={() => (counter = 0)}>Reset</Button>
			{@render optionsDialog()}
		</div>
	</div>
</div>

{#snippet optionsDialog()}
	<Dialog.Root>
		<Dialog.Trigger>
			{#snippet child({ props })}
				<Button variant="secondary" {...props}>Options</Button>
			{/snippet}
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Title>Options</Dialog.Title>
			<div class="text-center text-4xl">{addend}</div>
			<Slider type="single" bind:value={addend} min={1} max={10} />
		</Dialog.Content>
	</Dialog.Root>
{/snippet}
