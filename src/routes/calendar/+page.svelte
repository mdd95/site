<script lang="ts">
	import YearView from './view-year.svelte';
	import MonthView from './view-month.svelte';

	let viewDate = $state(Temporal.Now.plainDateISO(Temporal.Now.timeZoneId()).with({ day: 1 }));
</script>

<div>
	<button onclick={() => (viewDate = viewDate.subtract({ months: 1 }))} class="btn secondary">
		&lt;
	</button>
	<button onclick={() => (viewDate = viewDate.add({ months: 1 }))} class="btn secondary">
		&gt;
	</button>
</div>

<h1>{new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(viewDate)}</h1>
<MonthView year={viewDate.year} month={viewDate.month} />
<YearView year={viewDate.year} />

<style>
</style>
