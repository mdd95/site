<script lang="ts">
	import { resolve } from '$app/paths';
	import { getUserSession, signOut } from '$lib/remote/auth.remote.js';
	import { useWebSocket } from '$lib/hooks/use-websocket.js';

	const userSession = getUserSession();

	const { send } = useWebSocket(`ws://localhost:5173/ws`, {
		onmessage: async (event) => {
			console.log(await event.data.text());
		}
	});
</script>

<pre>{JSON.stringify(await userSession, null, 2)}</pre>

<form {...signOut}>
	<button type="submit">Sign out</button>
</form>

<a href={resolve('/signin')}>Sign in</a>
<button onclick={() => send('HELLO')}>Send</button>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
