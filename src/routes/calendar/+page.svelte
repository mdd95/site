<script lang="ts">
	import YearView from './view-year.svelte';
	import MonthView from './view-month.svelte';

	let tab = $state(0);
</script>

<div class="app">
	<header>
		<button
			onclick={() => (tab = 0)}
			class={['btn', tab === 0 ? 'primary' : 'secondary']}
			aria-label="Year view"
		>
			Year
		</button>
		<button
			onclick={() => (tab = 1)}
			class={['btn', tab === 1 ? 'primary' : 'secondary']}
			aria-label="Month view"
		>
			Month
		</button>
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
	header {
		height: 4rem;
		padding: 0 1rem;
		display: flex;
		align-items: center;
		justify-content: end;
		gap: 0.5rem;
	}
</style>
