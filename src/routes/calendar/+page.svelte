<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';
	import Clock from './Clock.svelte';

	const viewDate = new SvelteDate();
	const currentDate = new SvelteDate();

	const year = $derived(viewDate.getFullYear());
	const month = $derived(viewDate.getMonth());
	const firstDay = $derived(new Date(year, month, 1));
	const startDay = $derived(firstDay.getDay());

	const formatter = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	});

	onMount(() => {
		const interval = setInterval(() => {
			currentDate.setTime(Date.now());
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});

	const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
</script>

<p>{formatter.format(currentDate)}</p>
<p>{viewDate}</p>
<p>{startDay}</p>

<Clock />

<div>
	<button onclick={() => viewDate.setMonth(viewDate.getMonth() - 1)} class="btn secondary">
		&lt;
	</button>
	<button onclick={() => viewDate.setMonth(viewDate.getMonth() + 1)} class="btn secondary">
		&gt;
	</button>
</div>

<div class="month-view">
	{let daysInMonth = new Date(year, month + 1, 0).getDate()}

	{#each weekdays as day (day)}
		<div class="weekday">{day}</div>
	{/each}

	{#each { length: 42 }, i}
		{#if i < startDay}
			{let prevDate = new Date(year, month, 0).getDate()}
			{let date = new Date(year, month - 1, prevDate - startDay + i + 1)}
			<div class="day-cell">{date.getDate()}</div>
		{:else if i >= startDay + daysInMonth}
			{let date = new Date(year, month + 1, i - startDay - daysInMonth + 1)}
			<div class="day-cell">{date.getDate()}</div>
		{:else}
			{let date = new Date(year, month, i - startDay + 1)}
			<div class="day-cell">{date.getDate()}</div>
		{/if}
	{/each}
</div>

<style>
	.month-view {
		padding: 1rem;
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		gap: 0.25rem;
	}

	.weekday {
		padding: 1rem 0.5rem;
		color: #52617b;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		font-weight: 600;
		text-align: center;
	}

	.day-cell {
		padding: 0.5rem;
		height: 6rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);

		@media (hover: hover) {
			&:hover {
				background-color: rgb(0 0 0 / 5%);
			}
		}
	}
</style>
