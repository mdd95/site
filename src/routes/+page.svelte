<script lang="ts">
	import Navbar from '$lib/components/ui/Navbar.svelte';
	import ThemeSelect from '$lib/components/app/theme-select.svelte';
</script>

<Navbar>
	<div></div>
	<ThemeSelect />
</Navbar>
<main class="container mx-auto px-4">
	<h1>Welcome to SvelteKit</h1>
	<p>
		Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
	</p>
</main>
