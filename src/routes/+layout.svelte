<script lang="ts">
	import '@fontsource-variable/inter/wght.css';
	import '../app.css';
	import '../styles/button.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
