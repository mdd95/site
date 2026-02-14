<script lang="ts">
	import MonthView from './MonthView.svelte';

	let year = $state(new Date().getFullYear());
</script>

<div class="header">
	<button onclick={() => (year -= 1)}>Prev</button>
	<select bind:value={year}>
		<button>
			<selectedcontent></selectedcontent>
		</button>
		{#each { length: 120 }, i}
			<option value={1980 + i}>{1980 + i}</option>
		{/each}
	</select>
	<button onclick={() => (year += 1)}>Next</button>
</div>

<div class="calendar">
	{#each { length: 12 }, month}
		<MonthView {year} {month} />
	{/each}
</div>

<style>
	.header {
		padding: 1rem 0;
		display: flex;
		justify-content: center;
		gap: 2rem;
	}

	select,
	::picker(select) {
		appearance: base-select;
	}

	select {
		border-radius: 0.25rem;
	}

	::picker(select) {
		scrollbar-width: thin;
		border-radius: 0.25rem;
	}

	option {
		font-size: 0.8rem;
		text-align: center;
	}

	.calendar {
		padding: 1rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
	}
</style>
