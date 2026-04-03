<script lang="ts">
	import {
		CalendarDate,
		GregorianCalendar,
		getDayOfWeek,
		getLocalTimeZone,
		isSameDay,
		today
	} from '@internationalized/date';

	const calendar = new GregorianCalendar();
	let current = $state(today(getLocalTimeZone()));

	function getMonthDetails(year: number, month: number) {
		const start = new CalendarDate(year, month + 1, 1);
		return [getDayOfWeek(start, 'en-PH'), calendar.getDaysInMonth(start)];
	}
</script>

<svelte:head>
	<title>Calendar | {current.year}</title>
</svelte:head>

<div class="layout">
	<h1>{current.year}</h1>
	<main>
		{#each { length: 12 }, month}
			{@const [start, end] = getMonthDetails(current.year, month)}
			<div class="month">
				<table>
					<caption>
						{new Intl.DateTimeFormat('en-PH', { month: 'long' }).format(
							new Date(current.year, month, 1)
						)}
					</caption>
					<thead>
						<tr>
							{#each { length: 7 }, day}
								<th scope="col">
									<div class="cell">
										{new Intl.DateTimeFormat('en-PH', {
											weekday: 'narrow'
										}).format(
											new Date(current.year, month, 7 + day - start + 1)
										)}
									</div>
								</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each { length: 6 }, week}
							<tr>
								{#each { length: 7 }, day}
									{@const i = week * 7 + day - start}
									{#if i < 0 || i >= end}
										<td></td>
									{:else}
										{@const date = new CalendarDate(
											current.year,
											month + 1,
											i + 1
										)}
										<td
											aria-label={new Intl.DateTimeFormat('en-US', {
												dateStyle: 'full'
											}).format(new Date(current.year, month, i + 1))}
											data-value={date.toString()}
											class:today={isSameDay(date, current)}
										>
											<div class="cell">{i + 1}</div>
										</td>
									{/if}
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/each}
	</main>
</div>

<style>
	.layout {
		min-height: 100vh;
		padding: 1rem;
		background-color: var(--color-muted);

		& h1 {
			text-align: center;
		}
	}

	main {
		width: min(80rem, 100%);
		margin-block: 1rem;
		margin-inline: auto;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(17.5rem, 1fr));
		gap: 1rem;
	}

	.month {
		padding: 1rem;
		background-color: var(--color-background);
		border-radius: var(--radius);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		table-layout: fixed;
	}

	th:nth-child(1),
	td:nth-child(1) {
		color: oklch(63.7% 0.237 25.331);
	}

	.today .cell {
		background-color: color-mix(in lab, var(--color-primary) 30%, var(--color-background));
	}

	.cell {
		aspect-ratio: 1 / 1;
		display: grid;
		place-items: center;
		border-radius: 9999px;
		font-size: 0.875rem;
		text-align: center;
	}
</style>
