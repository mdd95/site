<script>
  import 'inter-ui/inter.css';
  import 'inter-ui/inter-variable.css';
  import '$lib/base.css';
  import Button from '$lib/button.svelte';
  import Theme, { setTheme } from '$lib/theme.svelte';

  const theme = setTheme();

  let backdrop = $state(
    typeof window != 'undefined' && window.themeColors ? window.themeColors.backdrop : 0
  );
  let primary = $state(
    typeof window != 'undefined' && window.themeColors ? window.themeColors.primary : 0
  );

  function changeTheme() {
    theme.colors = {
      backdrop: backdrop.toString(),
      primary: primary.toString()
    };
  }
</script>

<Theme />

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<Button onclick={theme.toggleMode}>Toggle mode</Button>

<div style="width: 64px; height: 48px; background-color: oklch(0.648 0.147 {backdrop});"></div>
<input type="range" min="0" max="360" bind:value={backdrop} />
<div style="width: 64px; height: 48px; background-color: oklch(0.648 0.147 {primary});"></div>
<input type="range" min="0" max="360" bind:value={primary} />
<Button size="sm" onclick={changeTheme}>Change theme</Button>

<style>
  :global(:root) {
    --sans: 'Inter';
  }

  @supports (font-variation-settings: normal) {
    :global(:root) {
      --sans: 'InterVariable';
    }
  }
</style>
