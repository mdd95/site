<script>
  import '$lib/base.css';
  import Button from '$lib/button.svelte';
  import Theme, { setTheme } from '$lib/theme.svelte';

  const theme = setTheme();
</script>

<Theme />

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<Button>Click me</Button>
