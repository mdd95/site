<script lang="ts">
	type Props = {
		year: number;
		month: number;
	};

	let { year, month }: Props = $props();

	let date = $derived(new Temporal.PlainDate(year, month, 1));
	let dayOfWeek = $derived(date.dayOfWeek % 7);
	let daysInMonth = $derived(date.daysInMonth);

	const weekdayFmt = new Intl.DateTimeFormat(undefined, { weekday: 'narrow' });
</script>

<div class="month-view">
	{#each Array.from({ length: 7 }, (_, i) => {
		const date = new Date(2026, 8, 6 + i);
		return weekdayFmt.format(date);
	}) as weekday, i (i)}
		<div class="weekday">{weekday}</div>
	{/each}

	{#each { length: 42 }, i}
		{#if i < dayOfWeek || i >= dayOfWeek + daysInMonth}
			<div class="day"></div>
		{:else}
			{const date = new Temporal.PlainDate(year, month, i - dayOfWeek + 1)}
			<div class="day">{date.day}</div>
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
</style>
