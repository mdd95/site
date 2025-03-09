<script lang="ts">
	import { onMount } from 'svelte';
	import NumberFlow from '@number-flow/svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Navbar from '$lib/components/ui/Navbar.svelte';
	import ThemeSelect from '$lib/components/app/ThemeSelect.svelte';
	import ArrowCounterClockwise from 'phosphor-svelte/lib/ArrowCounterClockwise';
	import Play from 'phosphor-svelte/lib/Play';
	import Pause from 'phosphor-svelte/lib/Pause';
	import AlarmSound from '$lib/assets/sounds/alarm.mp3';

	let msDiff = $state(0);
	let timeRemaining = 0;
	let timeEnd: number;

	let inputSeconds = $state(0);
	let inputMinutes = $state(0);
	let inputHours = $state(0);

	let isActive = $state(false);
	let isPaused = $state(false);
	let isCompleted = $state(false);

	const ticksPerSecond = 4;
	const timeInterval = 1000 / ticksPerSecond;
	let audioEl: HTMLAudioElement;
	let audioCtx: AudioContext;
	let intervalId: number;

	onMount(() => {
		audioCtx = new AudioContext();
		const audioTrack = new MediaElementAudioSourceNode(audioCtx, {
			mediaElement: audioEl
		});
		audioTrack.connect(audioCtx.destination);

		function applyAudioDataset() {
			audioEl.dataset.playing = 'false';
		}
		applyAudioDataset();
		audioEl.addEventListener('ended', applyAudioDataset);
		return () => {
			audioEl.removeEventListener('ended', applyAudioDataset);
		};
	});

	function playAlarmSound() {
		if (audioCtx.state === 'suspended') {
			audioCtx.resume();
		}
		if (audioEl.dataset.playing === 'false') {
			audioEl.play();
			audioEl.dataset.playing = 'true';
		}
	}

	function stopAlarmSound() {
		if (audioEl.dataset.playing === 'true') {
			audioEl.pause();
			audioEl.currentTime = 0;
			audioEl.dataset.playing = 'false';
		}
	}

	function loop() {
		msDiff = timeEnd - Date.now();

		if (msDiff <= 0) {
			msDiff = 0;
			isCompleted = true;
			isActive = false;
			clearInterval(intervalId);
			playAlarmSound();
		}
	}

	function startTimer() {
		timeRemaining = inputHours * 3600000 + inputMinutes * 60000 + inputSeconds * 1000;
		if (timeRemaining <= 0) return;

		timeEnd = Date.now() + timeRemaining;
		isActive = true;
		isPaused = false;
		intervalId = setInterval(loop, timeInterval);
	}

	function pauseTimer() {
		clearInterval(intervalId);
		timeRemaining = timeEnd - Date.now();
		isPaused = true;
	}

	function resumeTimer() {
		timeEnd = Date.now() + timeRemaining;
		isPaused = false;
		intervalId = setInterval(loop, timeInterval);
	}

	function resetTimer() {
		clearInterval(intervalId);
		stopAlarmSound();
		msDiff = 0;
		timeRemaining = 0;
		isActive = false;
		isPaused = false;
		isCompleted = false;
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

	function setByWheel(getter: () => number, setter: (value: number) => void) {
		return (e: WheelEvent) => {
			const inputEl = e.target as HTMLInputElement;
			const min = Number(inputEl.min);
			const max = Number(inputEl.max);
			const value = getter() + Math.floor(-e.deltaY / 100);
			if (value < min || value > max) return;
			setter(value);
		};
	}
</script>

<svelte:head>
	<title>Timer</title>
</svelte:head>

<div class="layout">
	<Navbar>
		<div></div>
		<ThemeSelect />
	</Navbar>

	<div class="display" data-completed={isCompleted}>
		<NumberFlow
			value={getHours()}
			animated={isActive}
			trend={-1}
			format={{ minimumIntegerDigits: 2 }}
		/>
		<NumberFlow
			value={getMinutes()}
			animated={isActive}
			trend={-1}
			digits={{ 1: { max: 5 } }}
			format={{ minimumIntegerDigits: 2 }}
			prefix=":"
		/>
		<NumberFlow
			value={getSeconds()}
			animated={isActive}
			trend={-1}
			digits={{ 1: { max: 5 } }}
			format={{ minimumIntegerDigits: 2 }}
			prefix=":"
		/>
	</div>

	{#if !isActive && !isCompleted}
		<div class="input">
			<input
				type="number"
				bind:value={
					() => inputHours.toString().padStart(2, '0'),
					(value) => (inputHours = clamp(Math.floor(Number(value)), 0, 23))
				}
				onwheel={setByWheel(
					() => inputHours,
					(value) => (inputHours = value)
				)}
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
					(value) => (inputMinutes = clamp(Math.floor(Number(value)), 0, 59))
				}
				onwheel={setByWheel(
					() => inputMinutes,
					(value) => (inputMinutes = value)
				)}
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
					(value) => (inputSeconds = clamp(Math.floor(Number(value)), 0, 59))
				}
				onwheel={setByWheel(
					() => inputSeconds,
					(value) => (inputSeconds = value)
				)}
				min="0"
				max="59"
				step="1"
				inputmode="numeric"
			/>
		</div>
	{/if}

	<div class="controls">
		<Button
			onclick={resetTimer}
			class="icon ghost size-14 rounded-full *:size-6"
			style="justify-self: end"
		>
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
	</div>
</div>
<audio loop bind:this={audioEl}>
	<source src={AlarmSound} type="audio/mpeg" />
</audio>

<style>
	.layout {
		height: 100vh;
		display: grid;
		grid-template-areas: 'navbar' 'display' 'controls';
		grid-template-rows: 4rem 1fr auto;
	}

	.display {
		grid-area: display;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 3rem;
		font-variant-numeric: tabular-nums;

		@media (width >= 48rem) {
			font-size: 6rem;
		}

		&[data-completed='true'] {
			color: var(--color-primary);
		}

		& :global(number-flow-svelte) {
			pointer-events: none;
		}
	}
	.input {
		display: flex;
		align-items: center;
		justify-content: center;
		grid-area: display;
		font-size: 3rem;
		font-variant-numeric: tabular-nums;
		z-index: 5;

		@media (width >= 48rem) {
			font-size: 6rem;
		}

		& input[type='number'] {
			color: transparent;
			caret-color: var(--color-primary);
			outline: none;
			field-sizing: content;
		}

		& input[type='number']::-webkit-inner-spin-button,
		& input[type='number']::-webkit-outer-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}
		& input[type='number'] {
			-moz-appearance: textfield;
		}
	}
	.controls {
		padding-block: 4rem;
		display: grid;
		align-items: center;
		justify-items: center;
		grid-area: controls;
		grid-template-columns: 1fr 8rem 1fr;
	}
</style>
