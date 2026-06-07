<script lang="ts">
	import { getUserProfile } from '$lib/remote/profile.remote.js';

	let { params } = $props();
	const profile = $derived(await getUserProfile(params.id));
</script>

<svelte:head>
	<title>{profile?.user.username}</title>
</svelte:head>

<pre>{JSON.stringify(profile, null, 2)}</pre>
