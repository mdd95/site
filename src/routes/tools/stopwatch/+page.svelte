<script lang="ts">
	import ThemeSelect from '$lib/components/app/theme-select.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Navbar } from '$lib/components/ui/navbar/index.js';
	import ArrowCounterClockwise from 'phosphor-svelte/lib/ArrowCounterClockwise';
	import Pause from 'phosphor-svelte/lib/Pause';
	import Play from 'phosphor-svelte/lib/Play';

	let timeElapsed = 0;
	let baseTimestamp: number;
	let intervalId: number;

	let msDiff = $state(0);
	let isActive = $state(false);
	let isPaused = $state(false);

	const ticksPerSecond = 4;
	const timeDuration = 1000 / ticksPerSecond;
	const perSecond = 1 / 1000;
	const perMinute = 1 / 60000;
	const perHour = 1 / 3600000;

	function stopwatchLoop() {
		msDiff = Date.now() - baseTimestamp;
	}

	function startStopwatch() {
		baseTimestamp = Date.now();
		isActive = true;
		isPaused = false;
		intervalId = setInterval(stopwatchLoop, timeDuration);
	}

	function pauseStopwatch() {
		timeElapsed = Date.now() - baseTimestamp;
		clearInterval(intervalId);
		isPaused = true;
	}

	function resumeStopwatch() {
		baseTimestamp = Date.now() - timeElapsed;
		intervalId = setInterval(stopwatchLoop, timeDuration);
		isPaused = false;
	}

	function formatValue(value: number) {
		return value.toString().padStart(2, '0');
	}

	function getElapsedTime() {
		const seconds = Math.floor(msDiff * perSecond) % 60;
		const minutes = Math.floor(msDiff * perMinute) % 60;
		const hours = Math.floor(msDiff * perHour) % 24;
		return `${formatValue(hours)}:${formatValue(minutes)}:${formatValue(seconds)}`;
	}
</script>

<svelte:head>
	<title>Stopwatch</title>
</svelte:head>

<div class="grid h-screen grid-rows-[--spacing(16)_1fr_auto]">
	<Navbar>
		<div></div>
		<ThemeSelect />
	</Navbar>

	<div class="grid place-content-center text-5xl tabular-nums md:text-8xl">
		<p>{getElapsedTime()}</p>
	</div>
	<div class="grid grid-cols-[1fr_8rem_1fr] items-center justify-items-center py-16">
		<Button variant="secondary" class="size-14 justify-self-end rounded-full [&>svg]:size-4">
			<ArrowCounterClockwise weight="fill" />
		</Button>
		{#if !isActive}
			<Button onclick={startStopwatch} class="size-20 rounded-full [&>svg]:size-6">
				<Play weight="fill" />
			</Button>
		{:else if !isPaused}
			<Button onclick={pauseStopwatch} class="size-20 rounded-full [&>svg]:size-6">
				<Pause weight="fill" />
			</Button>
		{:else}
			<Button onclick={resumeStopwatch} class="size-20 rounded-full [&>svg]:size-6">
				<Play weight="fill" />
			</Button>
		{/if}
		<div></div>
	</div>
</div>
