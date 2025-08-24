<script lang="ts">
	import { getThemeMode } from '$lib/theme-manager.svelte.js';

	let themeMode = getThemeMode();
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<p>Mode: {themeMode.mode}</p>
<p>User Prefers Mode: {themeMode.userPreferred}</p>

<button onclick={() => themeMode.setMode('system')}>System</button>
<button onclick={() => themeMode.setMode('dark')}>Dark</button>
<button onclick={() => themeMode.setMode('light')}>Light</button>
<button onclick={() => themeMode.toggleMode()}>Toggle</button>
