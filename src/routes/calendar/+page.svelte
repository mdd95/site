<script lang="ts">
	import YearView from './view-year.svelte';
	import MonthView from './view-month.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	const params = $derived(Object.fromEntries(page.url.searchParams));
</script>

<svelte:head>
	<title>Calendar</title>
</svelte:head>

<div class="app">
	<header>
		<button
			onclick={() => goto('/calendar?view=year', { replace: true })}
			class={['btn', params.view === 'year' ? 'primary' : 'secondary']}
			aria-label="Year view"
		>
			Year
		</button>
		<button
			onclick={() => goto('/calendar?view=month', { replace: true })}
			class={['btn', params.view === 'month' ? 'primary' : 'secondary']}
			aria-label="Month view"
		>
			Month
		</button>
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
