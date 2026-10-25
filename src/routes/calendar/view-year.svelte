<script lang="ts">
	const today = Temporal.Now.plainDateISO();

	const weekStartsOn = 0;
	const locale = Intl.DateTimeFormat().resolvedOptions().locale;

	const sunday = new Date(2023, 0, 1);
	const weekdays = Array.from({ length: 7 }, (_, i) => {
		const day = (weekStartsOn + i) % 7;
		return new Date(
			sunday.getFullYear(),
			sunday.getMonth(),
			sunday.getDate() + day
		).toLocaleString(locale, { weekday: 'short' });
	});

	let year = $state(today.year);
</script>

<div class="year-view">
	{#each { length: 12 }, month (month)}
		{const first = new Temporal.PlainDate(year, month + 1, 1)}
		{const offset = ((first.dayOfWeek % 7) - weekStartsOn + 7) % 7}
		{const days = first.daysInMonth}
		{const cellCount = Math.ceil((offset + days) / 7) * 7}

		<section
			class="month"
			aria-label={first.toLocaleString(locale, { month: 'long', year: 'numeric' })}
		>
			<h2 class="header">{first.toLocaleString(locale, { month: 'long' })}</h2>

			{#each weekdays as weekday, i (i)}
				<div class="weekday">{weekday}</div>
			{/each}

			{#each { length: cellCount } as _, i (i)}
				{@const day = i - offset + 1}
				{#if day < 1 || day > days}
					<div class="day empty" aria-hidden="true"></div>
				{:else}
					{const date = first.with({ day })}
					<div
						class={['day', date.equals(today) && 'today']}
						aria-label={date.toLocaleString(locale, { dateStyle: 'full' })}
						aria-current={date.equals(today) ? 'date' : undefined}
					>
						{day}
					</div>
				{/if}
			{/each}
		</section>
	{/each}
</div>

<style>
	.year-view {
		width: min(80rem, 100%);
		margin: 1rem auto;
		padding: 0 1rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 17.5rem), 1fr));
		gap: 1rem;
	}

	.month {
		min-width: 0;
		padding: 1rem;
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		gap: 0.25rem;
		border-radius: var(--radius-md, 0.75rem);
	}

	.header {
		grid-column: 1 / -1;
		margin: 0 0 0.5rem;
		font-size: 1rem;
		font-weight: 600;
	}

	.weekday,
	.day {
		display: grid;
		place-items: center;
		aspect-ratio: 1;
		min-width: 0;
	}

	.weekday {
		font-size: 0.75rem;
		color: var(--muted-foreground, #737373);
	}

	.day {
		border-radius: 50%;
		font-variant-numeric: tabular-nums;
	}

	.empty {
		pointer-events: none;
	}

	.today {
		background: var(--primary, #5b5bf0);
		color: white;
		font-weight: 700;
	}
</style>
