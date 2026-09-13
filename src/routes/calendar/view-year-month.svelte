<script lang="ts">
	type Props = {
		year: number;
		month: number;
	};

	let { year, month }: Props = $props();
	const date = $derived(new Temporal.PlainDate(year, month, 1));
	const start = $derived(date.dayOfWeek);
	const end = $derived(date.daysInMonth);
</script>

<div class="month">
	<table>
		<caption>
			{new Intl.DateTimeFormat('en-PH', {
				month: 'long'
			}).format(date)}
		</caption>
		<thead>
			<tr>
				<th>S</th>
				<th>M</th>
				<th>T</th>
				<th>W</th>
				<th>T</th>
				<th>F</th>
				<th>S</th>
			</tr>
		</thead>
		<tbody>
			{#each { length: 6 }, w}
				<tr>
					{#each { length: 7 }, d}
						{const i = w * 7 + d - start + 1}
						{#if i <= 0 || i > end}
							<td>
								<div></div>
							</td>
						{:else}
							<td>
								<div>{i}</div>
							</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.month {
		padding: 1rem;
		border-radius: var(--radius-md);
	}

	table {
		width: 100%;
		table-layout: fixed;
		border-collapse: collapse;
	}

	td div {
		width: 1rem;
		aspect-ratio: 1 / 1;
		display: grid;
		place-items: center;
		border-radius: var(--radius-full);
		font-size: 0.875rem;
		text-align: center;
	}
</style>
