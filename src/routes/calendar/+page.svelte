<script lang="ts">
	import YearView from './view-year.svelte';
	import MonthView from './view-month.svelte';
	import { page } from '$app/state';
	import HeaderTab from './header-tab.svelte';

	const params = $derived(Object.fromEntries(page.url.searchParams));
</script>

<svelte:head>
	<title>Calendar</title>
</svelte:head>

<div class="app">
	<header>
		<HeaderTab />
	</header>
	<main>
		{#if params.view === 'year'}
			<YearView />
		{:else if params.view === 'month'}
			<MonthView />
		{/if}
	</main>
</div>

<style>
	header {
		height: 4rem;
		padding: 0 1rem;
		display: flex;
		align-items: center;
		justify-content: end;
		gap: 0.5rem;
	}
</style>
