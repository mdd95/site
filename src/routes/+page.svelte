<script lang="ts">
	import { resolve } from '$app/paths';
	import { getUser, signOut } from '$lib/remote/auth.remote.js';

	let mode = 'light';
	function toggle() {
		mode = mode === 'light' ? 'dark' : 'light';
		document.documentElement.style.colorScheme = mode;
	}
</script>

<div class="page">
	<header>
		<a href={resolve('/public-chat')}>Public Chat</a>
		<a href={resolve('/signin')} class="btn">Sign in</a>

		{#if await getUser()}
			<form {...signOut}>
				<button type="submit">Sign out</button>
			</form>
		{/if}
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
	.page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	main {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	header {
		padding: 0.5rem 0.75rem;
		display: flex;
		justify-content: end;
		align-items: center;
		gap: 1rem;
	}
</style>
