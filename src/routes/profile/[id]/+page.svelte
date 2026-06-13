<script lang="ts">
	import { getUserProfile } from '$lib/remote/profile.remote.js';
	import Profile from './Profile.svelte';

	let { params } = $props();
	const result = $derived(await getUserProfile(params.id));
</script>

{#if result.error}
	{let { status, code, message } = result.error}
	<!-- TODO -->
{:else}
	<Profile data={result.data} />
{/if}
