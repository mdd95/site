<script lang="ts">
	import { AnimationFrames } from 'runed';
	import NumberFlow from '@number-flow/svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Navbar from '$lib/components/ui/Navbar.svelte';
	import ThemeSelect from '$lib/components/app/ThemeSelect.svelte';
	import ArrowCounterClockwise from 'phosphor-svelte/lib/ArrowCounterClockwise';
	import Play from 'phosphor-svelte/lib/Play';
	import Pause from 'phosphor-svelte/lib/Pause';

	let msDiff = $state(0);
	let timeRemaining = 0;
	let timeEnd: number;

	let inputSeconds = $state(0);
	let inputMinutes = $state(0);
	let inputHours = $state(0);

	let isActive = $state(false);
	let isPaused = $state(false);
	let isCompleted = $state(false);

	const animation = new AnimationFrames(() => {
		msDiff = timeEnd - Date.now();

		if (msDiff <= 0) {
			msDiff = 0;
			isCompleted = true;
			isActive = false;
			animation.stop();
		}
	});

	function startTimer() {
		timeRemaining = inputHours * 3600000 + inputMinutes * 60000 + inputSeconds * 1000;
		if (timeRemaining <= 0) return;

		timeEnd = Date.now() + timeRemaining;
		isActive = true;
		isPaused = false;
		animation.start();
	}

	function pauseTimer() {
		animation.stop();
		timeRemaining = timeEnd - Date.now();
		isPaused = true;
	}

	function resumeTimer() {
		timeEnd = Date.now() + timeRemaining;
		isPaused = false;
		animation.start();
	}

	function resetTimer() {
		animation.stop();
		msDiff = 0;
		timeRemaining = 0;
		isActive = false;
		isPaused = false;
	}

	function clamp(value: number, min: number, max: number) {
		return Math.min(Math.max(value, min), max);
	}

	function getSeconds() {
		if (msDiff > 0) return Math.floor((msDiff / 1000) % 60);
		return inputSeconds;
	}
	function getMinutes() {
		if (msDiff > 0) return Math.floor((msDiff / 60000) % 60);
		return inputMinutes;
	}
	function getHours() {
		if (msDiff > 0) return Math.floor((msDiff / 3600000) % 24);
		return inputHours;
	}
</script>

<svelte:head>
	<title>Timer</title>
</svelte:head>

<div class="app-layout grid min-h-screen">
	<Navbar>
		<div></div>
		<ThemeSelect />
	</Navbar>

	<div class="timer-display flex items-center justify-center text-5xl tabular-nums md:text-8xl">
		<NumberFlow
			value={getHours()}
			animated={isActive}
			trend={-1}
			format={{ minimumIntegerDigits: 2 }}
			class="pointer-events-none"
		/>
		<NumberFlow
			value={getMinutes()}
			animated={isActive}
			trend={-1}
			digits={{ 1: { max: 5 } }}
			format={{ minimumIntegerDigits: 2 }}
			prefix=":"
			class="pointer-events-none"
		/>
		<NumberFlow
			value={getSeconds()}
			animated={isActive}
			trend={-1}
			digits={{ 1: { max: 5 } }}
			format={{ minimumIntegerDigits: 2 }}
			prefix=":"
			class="pointer-events-none"
		/>
	</div>

	{#if !isActive}
		<div
			class="timer-input *:caret-primary z-1 flex items-center justify-center text-5xl tabular-nums *:field-sizing-content *:text-transparent *:outline-none md:text-8xl"
		>
			<input
				type="number"
				bind:value={
					() => inputHours.toString().padStart(2, '0'),
					(value) => (inputHours = clamp(~~+value, 0, 23))
				}
				min="0"
				max="23"
				step="1"
				inputmode="numeric"
			/>
			<span>:</span>
			<input
				type="number"
				bind:value={
					() => inputMinutes.toString().padStart(2, '0'),
					(value) => (inputMinutes = clamp(~~+value, 0, 59))
				}
				min="0"
				max="59"
				step="1"
				inputmode="numeric"
			/>
			<span>:</span>
			<input
				type="number"
				bind:value={
					() => inputSeconds.toString().padStart(2, '0'),
					(value) => (inputSeconds = clamp(~~+value, 0, 59))
				}
				min="0"
				max="59"
				step="1"
				inputmode="numeric"
			/>
		</div>
	{/if}

	<div class="timer-controls grid items-center justify-items-center py-12">
		<div></div>
		<Button onclick={resetTimer} class="icon ghost size-14 rounded-full *:size-6">
			<ArrowCounterClockwise weight="fill" />
		</Button>
		{#if !isActive}
			<Button onclick={startTimer} class="icon size-20 rounded-full *:size-8">
				<Play weight="fill" />
			</Button>
		{:else if !isPaused}
			<Button onclick={pauseTimer} class="icon size-20 rounded-full *:size-8">
				<Pause weight="fill" />
			</Button>
		{:else}
			<Button onclick={resumeTimer} class="icon size-20 rounded-full *:size-8">
				<Play weight="fill" />
			</Button>
		{/if}
		<div></div>
		<div></div>
	</div>
</div>

<style>
	.app-layout {
		grid-template-areas: 'navbar' 'timer-display' 'timer-controls';
		grid-template-rows: calc(var(--spacing) * 16) 1fr auto;
	}
	.timer-display {
		grid-area: timer-display;
	}
	.timer-input {
		grid-area: timer-display;

		& input[type='number']::-webkit-inner-spin-button,
		& input[type='number']::-webkit-outer-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}
		& input[type='number'] {
			-moz-appearance: textfield;
		}
	}
	.timer-controls {
		grid-area: timer-controls;
		grid-template-columns:
			auto calc(var(--spacing) * 20)
			calc(var(--spacing) * 32)
			calc(var(--spacing) * 20) auto;
	}
</style>
