<script lang="ts">
	import { user } from './user.remote';
	import { page } from '$app/state';

	let data = $derived(await user(page.params.id!));
</script>

<svelte:head>
	<title>Profile | @{page.params.id}</title>
</svelte:head>

<pre>{JSON.stringify(data, null, 2)}</pre>
