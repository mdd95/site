<script lang="ts">
	import { getUser } from '$lib/remote/auth.remote.js';
	import ChatWindow from './chat-window.svelte';

	let user = $derived(await getUser());
</script>

{#if user}
	{#key user}
		<ChatWindow {user} />
	{/key}
{/if}
