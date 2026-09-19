<script lang="ts">
	type Props = {
		year: number;
	};

	let { year }: Props = $props();

	const monthFmt = new Intl.DateTimeFormat(undefined, { month: 'long' });
	const weekdayFmt = new Intl.DateTimeFormat(undefined, { weekday: 'narrow' });
</script>

<div class="year-view">
	{#each { length: 12 }, month}
		{const date = $derived(new Temporal.PlainDate(year, month + 1, 1))}
		{const dayOfWeek = $derived(date.dayOfWeek % 7)}
		{const daysInMonth = $derived(date.daysInMonth)}

		<div class="month">
			<div class="header">{monthFmt.format(date)}</div>

			{#each Array.from({ length: 7 }, (_, i) => {
				const date = new Date(2026, 8, 6 + i);
				return weekdayFmt.format(date);
			}) as weekday, i (i)}
				<div>{weekday}</div>
			{/each}

			{#each { length: 42 }, i}
				{#if i < dayOfWeek || i >= dayOfWeek + daysInMonth}
					<div></div>
				{:else}
					{const date = new Temporal.PlainDate(year, month + 1, i - dayOfWeek + 1)}
					<div>{date.day}</div>
				{/if}
			{/each}
		</div>
	{/each}
</div>

<style>
	.year-view {
		width: min(80rem, 100%);
		margin: 1rem auto;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(17.5rem, 1fr));
		gap: 1rem;
	}

	.month {
		padding: 1rem;
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		border-radius: var(--radius-md);
	}

	.header {
		grid-column: span 7;
	}
</style>
