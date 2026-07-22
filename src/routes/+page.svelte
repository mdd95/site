<script lang="ts">
	import { resolve } from '$app/paths';
	import { getUser, signOut } from '$lib/remote/auth.remote.js';

	const user = $derived(await getUser());
</script>

<pre>{JSON.stringify(user, null, 2)}</pre>

<form {...signOut}>
	<button type="submit">Sign out</button>
</form>

<a href={resolve('/signin')}>Sign in</a>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<a href={resolve('/public-chat')}>Public Chat</a>
