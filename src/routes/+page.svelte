<script lang="ts">
	import { Moon, Sun } from 'lucide';
	import { MorphIcon } from 'morphicons/svelte';
	import { resolve } from '$app/paths';
	import { getUser, signOut } from '$lib/remote/auth.remote.js';
	import { mode, toggleMode } from 'mode-watcher';
</script>

<div class="container">
	<header>
		<div></div>
		<nav aria-label="primary"></nav>
		<div class="actions">
			<button class="icon secondary" onclick={toggleMode}>
				<MorphIcon icon={mode.current === 'light' ? Sun : Moon} size="20" />
			</button>
			{#if (await getUser()).data}
				<form {...signOut}>
					<button type="submit">Sign out</button>
				</form>
			{:else}
				<a href={resolve('/signin')} class="btn secondary">Sign in</a>
			{/if}
		</div>
	</header>

	<main>
		<h1>Welcome to SvelteKit</h1>
		<p>
			Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
		</p>

		<div style="margin-top: 1rem;">
			<button class="primary">Get Started</button>
			<button onclick={toggle}>Toggle</button>
		</div>
	</main>
</div>

<style>
	.container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	header {
		height: 3.5rem;
		padding: 0 0.5rem;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		align-items: center;
	}

	main {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	ul {
		list-style: none;
		display: flex;
		justify-content: center;
	}

	.actions {
		display: flex;
		justify-content: end;
		gap: 0.5rem;
	}

	.icon {
		width: 2.5rem;
		height: 2.5rem;
		padding: 0;
		display: grid;
		place-items: center;
	}
</style>
