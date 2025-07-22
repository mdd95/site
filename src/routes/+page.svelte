<script lang="ts">
	import { getThemeContext } from '$lib/theme-context.js';

	let theme = getThemeContext();
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<p>Mode: {theme.resolvedMode}</p>
<p>User Prefers Mode: {theme.userPreference}</p>

<button onclick={() => theme.setMode('system')}>System</button>
<button onclick={() => theme.setMode('dark')}>Dark</button>
<button onclick={() => theme.setMode('light')}>Light</button>
<button onclick={() => theme.toggleMode()}>Toggle</button>
