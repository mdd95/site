<script lang="ts">
	import YearView from './view-year.svelte';
	import MonthView from './view-month.svelte';

	let tab = $state(0);
</script>

<div class="app">
	<header>
		<button onclick={() => (tab = 0)}>Year</button>
		<button onclick={() => (tab = 1)}>Month</button>
	</header>
	<main>
		{#if tab === 0}
			<YearView />
		{:else if tab === 1}
			<MonthView />
		{/if}
	</main>
</div>

<style>
</style>
