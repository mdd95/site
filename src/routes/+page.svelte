<script lang="ts">
	import { resolve } from '$app/paths';
	import { getUserSession, signOut } from '$lib/remote/auth.remote.js';
	import { onMount } from 'svelte';

	const userSession = getUserSession();

	onMount(() => {
		const ws = new WebSocket('ws://localhost:5173/app/chat');
	});
</script>

<pre>{JSON.stringify(await userSession, null, 2)}</pre>

<form {...signOut}>
	<button type="submit">Sign out</button>
</form>

<a href={resolve('/signin')}>Sign in</a>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
