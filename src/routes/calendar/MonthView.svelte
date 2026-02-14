<script lang="ts">
	type Props = {
		year: number;
		month: number;
	};

	let { year, month }: Props = $props();

	let start = $derived(new Date(year, month, 1));
	let end = $derived(new Date(year, month + 1, 0));

	let dayStart = $derived(start.getDay());
	let dateEnd = $derived(end.getDate());

	function getDate(week: number, day: number) {
		const cell = week * 7 + day - dayStart;
		if (cell < 0 || cell > dateEnd - 1) return null;
		return cell + 1;
	}

	const fmtMonth = new Intl.DateTimeFormat('en-US', { month: 'long' });
	const fmtDay = new Intl.DateTimeFormat('en-US', { weekday: 'narrow' });
</script>

<div>
	<span>{fmtMonth.format(start)}</span>
	<table>
		<thead>
			<tr>
				{#each { length: 7 }, day}
					<th>{fmtDay.format(new Date(year, month, day + 1 - dayStart))}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each { length: 6 }, week}
				<tr>
					{#each { length: 7 }, day}
						<td>{getDate(week, day)}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	div {
		padding: 1rem 1rem;
		width: max-content;
		border: 1px solid oklch(0 0 0 / 0.1);
		border-radius: 0.25rem;
	}

	span {
		margin: 0 0 1rem 0;
		display: block;
		text-align: center;
	}

	th,
	td {
		width: 2rem;
		height: 2rem;
		border-radius: 9999px;
		text-align: center;
		user-select: none;
	}

	th:first-child,
	td:first-child {
		color: red;
	}

	th:hover,
	td:hover {
		background-color: oklch(0 0 0 / 0.15);
	}
</style>
