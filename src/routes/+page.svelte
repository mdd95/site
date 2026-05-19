<script lang="ts">
	import { resolve } from '$app/paths';
	import { signOut, user } from '$lib/auth.remote.js';
</script>

<pre>{JSON.stringify(await user(), null, 2)}</pre>
<form {...signOut}>
	<button type="submit">Sign out</button>
</form>

<a href={resolve('/signin')}>Sign in</a>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
