<script lang="ts">
	import { DAYS, MONTHS } from './constants.js';

	let year = $state(new Date().getFullYear());

	function monthMatrix(year: number, month: number) {
		const start = new Date(year, month, 1);
		const end = new Date(year, month + 1, 0);

		const dayStart = start.getDay();
		const dateEnd = end.getDate();

		return (row: number, col: number) => {
			const i = row * 7 + col;
			if (i - dayStart < 0 || i - dayStart > dateEnd - 1) return null;
			return i - dayStart + 1;
		};
	}
</script>

<svelte:head>
	<title>Calendar</title>
</svelte:head>

<div class="year">
	<button onclick={() => (year -= 1)}>Prev</button>
	<select bind:value={year}>
		<button>
			<selectedcontent></selectedcontent>
		</button>
		{#each { length: 100 }, i}
			<option value={1980 + i}>{1980 + i}</option>
		{/each}
	</select>
	<button onclick={() => (year += 1)}>Next</button>
</div>

<div class="calendar">
	{#each Object.entries(MONTHS) as [j, months] (j)}
		{@const getDate = monthMatrix(year, +j)}
		<div class="month-card">
			<span class="month-label">{months}</span>
			<table>
				<thead>
					<tr>
						{#each Object.entries(DAYS) as [k, day] (k)}
							<th>{day.charAt(0)}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each { length: 6 }, r}
						<tr>
							{#each { length: 7 }, c}
								<td>{getDate(r, c)}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/each}
</div>

<style>
	.year {
		padding: 1rem;
		display: flex;
		justify-content: center;
		gap: 4rem;
	}

	select,
	::picker(select) {
		appearance: base-select;
	}

	select {
		font-size: 2.5rem;
		border-radius: 0.25rem;
	}

	option {
		font-size: 1rem;
	}

	.calendar {
		padding: 1rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1rem;
	}

	.month-card {
		width: max-content;
	}

	.month-label {
		display: block;
		text-align: center;
		font-weight: bold;
	}

	table {
		width: max-content;
	}

	th,
	td {
		width: 2rem;
		height: 2rem;
		text-align: center;
	}
</style>
