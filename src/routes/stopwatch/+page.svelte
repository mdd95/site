<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Play from '@lucide/svelte/icons/play';
	import Pause from '@lucide/svelte/icons/pause';
	import Square from '@lucide/svelte/icons/square';
	import Timer from '@lucide/svelte/icons/timer';

	let ms = $state(0);
	let msElapsed = 0;
	let baseTimestamp = 0;
	let intervalId: number | null = null;

	let splitTimes = $state([] as number[]);
	let hasStarted = $state(false);
	let isPaused = $state(false);

	function loop() {
		ms = Date.now() - baseTimestamp;
	}

	const pad = (n: number) => n.toString().padStart(2, '0');
	function formatMs(ms: number) {
		return pad(Math.floor((ms % 1000) / 10));
	}
	function formatSecs(ms: number) {
		return pad(Math.floor(ms / 1000) % 60);
	}
	function formatMins(ms: number) {
		return pad(Math.floor(ms / 1000 / 60) % 60);
	}

	function startOrPause() {
		if (!hasStarted || isPaused) {
			// Start or resume
			baseTimestamp = Date.now() - msElapsed;
			clearInterval(intervalId as number); // Clear any existing interval
			intervalId = setInterval(loop, 1000 / 60);
			hasStarted = true;
			isPaused = false;
		} else {
			// Pause
			msElapsed = Date.now() - baseTimestamp;
			clearInterval(intervalId as number);
			intervalId = null;
			isPaused = true;
		}
	}

	function resetTimer() {
		clearInterval(intervalId as number);
		ms = 0;
		msElapsed = 0;
		baseTimestamp = 0;
		intervalId = null;
		hasStarted = false;
		isPaused = false;
		splitTimes = [];
	}

	function splitTime(time: number) {
		if (hasStarted && !isPaused) {
			splitTimes = [...splitTimes, time];
		}
	}
</script>

<div class="p-4 md:py-12">
	<p class="text-center tabular-nums">
		<span class="text-5xl md:text-8xl">
			{formatMins(ms)}:{formatSecs(ms)}
		</span>
		<span class="text-muted-foreground text-2xl md:text-5xl">.{formatMs(ms)}</span>
	</p>
</div>

<div class="flex justify-center gap-2 p-4">
	<Button variant="secondary" class="size-14 rounded-full" onclick={resetTimer}>
		<Square fill="currentColor" />
		<span class="sr-only">Stop stopwatch</span>
	</Button>
	<Button variant="secondary" class="size-14 rounded-full" onclick={startOrPause}>
		<Play fill="currentColor" class={{ hidden: hasStarted && !isPaused }} />
		<Pause fill="currentColor" class={{ hidden: !hasStarted || isPaused }} />
		<span class="sr-only">Start/Pause stopwatch</span>
	</Button>
	<Button variant="secondary" class="size-14 rounded-full" onclick={() => splitTime(ms)}>
		<Timer size={56} />
		<span class="sr-only">Split timer</span>
	</Button>
</div>

<ul class="mx-auto max-w-md p-4 text-center tabular-nums select-none">
	{#each splitTimes as _ms, i}
		<li class="hover:bg-muted flex justify-between rounded-md py-1">
			<span class="text-muted-foreground ml-4">{i + 1}</span>
			<span>{formatMins(_ms)}:{formatSecs(_ms)}.{formatMs(_ms)}</span>
			<span></span>
		</li>
	{/each}
</ul>
