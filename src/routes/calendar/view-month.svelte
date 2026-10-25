<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	const today = Temporal.Now.plainDateISO();
	const locale = Intl.DateTimeFormat().resolvedOptions().locale;

	const sunday = new Date(2023, 0, 1);
	const weekdays = Array.from({ length: 7 }, (_, i) => {
		return new Date(
			sunday.getFullYear(),
			sunday.getMonth(),
			sunday.getDate() + i
		).toLocaleString(locale, { weekday: 'short' });
	});

	let date = $state(today.with({ day: 1 }));

	const dayOfWeek = $derived(date.dayOfWeek % 7);
	const daysInMonth = $derived(date.daysInMonth);

	function navigateMonth(amount: number) {
		date = date.add({ months: amount });
	}

	function goToToday() {
		date = today.with({ day: 1 });
	}
</script>

<div class="header">
	<h1>
		{date.toLocaleString(locale, {
			month: 'long',
			year: 'numeric'
		})}
	</h1>

	<button
		onclick={() => navigateMonth(-1)}
		class="btn icon secondary"
		aria-label="Previous month"
	>
		<ChevronLeft size={20} />
	</button>

	<button onclick={() => navigateMonth(1)} class="btn icon secondary" aria-label="Next month">
		<ChevronRight size={20} />
	</button>

	<button onclick={goToToday} class="btn secondary"> Today </button>
</div>

<div
	class="month-view"
	aria-label={date.toLocaleString(locale, {
		month: 'long',
		year: 'numeric'
	})}
>
	{#each weekdays as weekday, i (i)}
		<div class="weekday">{weekday}</div>
	{/each}

	{#each { length: 42 } as _, i (i)}
		{const cellDate = $derived(date.subtract({ days: dayOfWeek - i }))}
		<!-- {const isCurrentMonth = $derived(i >= dayOfWeek && i < dayOfWeek + daysInMonth)} -->
		{const isToday = $derived(cellDate.equals(today))}

		<div
			class={[
				'day',
				i < dayOfWeek && 'prev-month',
				i >= dayOfWeek + daysInMonth && 'next-month',
				isToday && 'today'
			]}
			aria-label={cellDate.toLocaleString(locale, { dateStyle: 'full' })}
			aria-current={isToday ? 'date' : undefined}
		>
			<span class="day-number">{cellDate.day}</span>
		</div>
	{/each}
</div>

<style>
	.header {
		padding: 0 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	h1 {
		flex: 1;
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.month-view {
		padding: 1rem;
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
	}

	.weekday {
		min-width: 0;
		height: 3.5rem;
		border-block: 1px solid var(--color-border);
		display: grid;
		place-items: center;
		font-weight: 600;
	}

	.day {
		min-width: 0;
		min-height: 6rem;
		padding: 0.5rem;
		border-right: 1px solid var(--color-border);
		border-bottom: 1px solid var(--color-border);

		&:nth-child(7n + 1) {
			border-left: 1px solid var(--color-border);
		}

		@media (hover: hover) {
			&:hover {
				background-color: rgb(0 0 0 / 5%);
			}
		}
	}

	/* Weekday headers occupy the first seven grid positions. */
	.day:nth-child(7n + 8) {
		border-left: 1px solid var(--color-border);
	}

	.day-number {
		display: inline-grid;
		place-items: center;
		min-width: 2rem;
		height: 2rem;
		border-radius: 50%;
		font-variant-numeric: tabular-nums;
	}

	.prev-month,
	.next-month {
		color: oklch(from var(--color-base-text) l c h / 0.5);
	}

	.today .day-number {
		background: var(--color-primary, #5b5bf0);
		color: white;
		font-weight: 700;
	}
</style>
