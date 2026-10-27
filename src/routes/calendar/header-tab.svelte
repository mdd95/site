<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	const views = [
		{ label: 'Year', value: 'year' },
		{ label: 'Month', value: 'month' },
		{ label: 'Day', value: 'day' }
	] as const;

	const params = $derived(Object.fromEntries(page.url.searchParams));
</script>

<div role="group" aria-label="Calendar view">
	{#each views as { label, value } (value)}
		<button
			type="button"
			class={['btn', params.view === value && 'active']}
			aria-pressed={params.view === value}
			onclick={() => goto(`/calendar?view=${value}`)}
		>
			{label}
		</button>
	{/each}
</div>

<style>
	div {
		display: inline-flex;
		align-items: center;
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	button {
		transition:
			background-color 150ms ease,
			color 150ms ease,
			box-shadow 150ms ease;

		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}
	}

	.btn:hover:not(.active) {
		background: rgb(0 0 0 / 5%);
	}

	.btn.active {
		background: var(--color-primary);
		color: var(--color-primary-text);
		box-shadow: 0 1px 3px rgb(0 0 0 / 12%);
	}

	.btn:focus-visible {
		outline: 2px solid var(--color-outline);
		outline-offset: 2px;
	}
</style>
