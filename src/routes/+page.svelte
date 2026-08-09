<script lang="ts">
	import { Moon, Sun } from 'lucide';
	import { MorphIcon } from 'morphicons/svelte';
	import { resolve } from '$app/paths';
	import { getUser, signOut } from '$lib/remote/auth.remote.js';

	let open = $state(false);
	let mode = 'light';
	function toggle() {
		mode = mode === 'light' ? 'dark' : 'light';
		document.documentElement.style.colorScheme = mode;
	}
</script>

<div class="container">
	<header>
		<div><a href="/">mjayar</a></div>
		<nav aria-label="primary">
			<ul>
				<li><a href={resolve('/')} class="btn">Home</a></li>
				<li><a href={resolve('/projects')} class="btn">Projects</a></li>
			</ul>
		</nav>
		<div class="actions">
			<button class="icon secondary" onclick={() => (open = !open)}>
				<MorphIcon icon={open ? Sun : Moon} size="20" />
			</button>
			{#if (await getUser()).data}
				<form {...signOut}>
					<button type="submit">Sign out</button>
				</form>
			{:else}
				<a href={resolve('/signin')} class="btn">Sign in</a>
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
		display: flex;
		justify-content: space-between;
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
	}

	.actions {
		display: flex;

		& > *:has(+ *) {
			margin-inline-end: 0.5rem;
		}
	}

	.icon {
		width: 2.5rem;
		height: 2.5rem;
		padding: 0;
		display: grid;
		place-items: center;
	}
</style>
