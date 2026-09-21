<script lang="ts">
	const today = Temporal.Now.plainDateISO(Temporal.Now.timeZoneId());
	const monthFmt = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' });
	const weekdayFmt = new Intl.DateTimeFormat(undefined, { weekday: 'narrow' });

	let date = $state(today.with({ day: 1 }));
	let dayOfWeek = $derived(date.dayOfWeek % 7);
	let daysInMonth = $derived(date.daysInMonth);

	function getWeekday() {
		return Array.from({ length: 7 }, (_, i) => {
			const date = new Date(2026, 8, 6 + i);
			return weekdayFmt.format(date);
		});
	}
</script>

<div class="header">
	<div class="headline">{monthFmt.format(date)}</div>
	<button
		onclick={() => (date = date.subtract({ months: 1 }))}
		class="btn secondary"
		aria-label="Previous month"
	>
		&lt;
	</button>
	<button
		onclick={() => (date = date.add({ months: 1 }))}
		class="btn secondary"
		aria-label="Next month"
	>
		&gt;
	</button>
	<button
		onclick={() => (date = today.with({ day: 1 }))}
		class="btn secondary"
		aria-label="Today"
	>
		Today
	</button>
</div>

<div class="month-view">
	{#each getWeekday() as weekday, i (i)}
		<div class="weekday">{weekday}</div>
	{/each}

	{#each { length: 42 }, i}
		{#if i < dayOfWeek}
			{const d = $derived(date.subtract({ days: dayOfWeek - i }))}
			<div class="day prev-month">{d.day}</div>
		{:else if i >= dayOfWeek + daysInMonth}
			{const d = $derived(
				date.with({ day: daysInMonth }).add({ days: i - (dayOfWeek + daysInMonth) + 1 })
			)}
			<div class="day next-month">{d.day}</div>
		{:else}
			{const d = $derived(date.with({ day: i - dayOfWeek + 1 }))}
			<div class="day">{d.day}</div>
		{/if}
	{/each}
</div>

<style>
	.header {
		padding: 0 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.headline {
		flex-grow: 1;
		font-weight: 700;
	}

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

	.day {
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

	.prev-month,
	.next-month {
		opacity: 0.5;
	}
</style>
