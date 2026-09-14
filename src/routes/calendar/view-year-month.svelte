<script lang="ts">
	type Props = {
		year: number;
		month: number;
	};

	let { year, month }: Props = $props();
	const date = $derived(new Temporal.PlainDate(year, month, 1));
	const start = $derived(date.dayOfWeek % 7);
	const end = $derived(date.daysInMonth);
</script>

<div class="month">
	<div class="header">
		{new Intl.DateTimeFormat(undefined, {
			month: 'long'
		}).format(date)}
	</div>
	{const formatter = new Intl.DateTimeFormat(undefined, { weekday: 'narrow' })}
	{#each Array.from({ length: 7 }, (_, i) => {
		const date = new Date(2026, 8, 6 + i);
		return formatter.format(date);
	}) as weekday, i (i)}
		<div>{weekday}</div>
	{/each}
	{#each { length: 42 }, i}
		{#if i < start}
			<div></div>
		{:else if i >= start + end}
			<div></div>
		{:else}
			{const date = new Temporal.PlainDate(year, month, i - start + 1)}
			<div>{date.day}</div>
		{/if}
	{/each}
</div>

<style>
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
