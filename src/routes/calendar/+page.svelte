<script lang="ts">
	import { page } from '$app/state';
	import { MediaQuery } from 'svelte/reactivity';
	import YearView from './view-year.svelte';
	import MonthView from './view-month.svelte';
	import HeaderTab from './header-tab.svelte';
	import SidenavDialog from './sidenav-dialog.svelte';
	import Sidenav from './sidenav.svelte';

	const params = $derived(Object.fromEntries(page.url.searchParams));
	const isMobile = new MediaQuery('(max-width: 768px)');
</script>

<svelte:head>
	<title>Calendar</title>
</svelte:head>

<div class="app">
	<header>
		<div>
			{#if isMobile.current}
				<SidenavDialog />
			{/if}
		</div>
		<HeaderTab />
	</header>
	<main>
		{#if params.view === 'year'}
			<YearView />
		{:else if params.view === 'month'}
			<MonthView />
		{:else}
			<MonthView />
		{/if}
	</main>
	<aside class="sidenav">
		<Sidenav />
	</aside>
	<aside class="events"></aside>
	<aside class="tasks"></aside>
</div>

<style>
	.app {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: 3.5rem auto auto auto;
		grid-template-areas:
			'header'
			'main'
			'events'
			'tasks';
	}
	.sidenav {
		display: none;
	}

	@media (width > 1080px) {
		.app {
			grid-template-columns: 18rem minmax(0, 1fr) 18rem;
			grid-template-rows: 3.5rem auto auto;
			grid-template-areas:
				'header  header header'
				'sidenav main   events'
				'sidenav main   tasks';
		}
		.sidenav {
			display: block;
		}
	}

	header {
		grid-area: header;
		height: 4rem;
		padding: 0 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	main {
		grid-area: main;
	}
</style>
