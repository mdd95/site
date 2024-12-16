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

  function resetTheme() {
    theme.colors = null;
  }
</script>

<Theme />

<svelte:head>
  <title>My Components</title>
</svelte:head>

<div class="container">
  <h2>Buttons</h2>

  <Button variant="primary" class="outline" onclick={theme.toggleMode}>Toggle mode</Button>
  <Button class="ghost" onclick={theme.resetMode}>Reset</Button>

  <div class="flex">
    <label for="backdrop">Backdrop </label>
    <div style="width: 64px; height: 48px; background-color: oklch(0.648 0.147 {backdrop});"></div>
    <input type="range" id="backdrop" min="0" max="360" bind:value={backdrop} />
  </div>
  <div class="flex">
    <label for="primary">Primary</label>
    <div style="width: 64px; height: 48px; background-color: oklch(0.648 0.147 {primary});"></div>
    <input type="range" id="primary" min="0" max="360" bind:value={primary} />
  </div>
  <Button size="sm" onclick={changeTheme}>Change theme</Button>
  <Button variant="primary" size="sm" onclick={resetTheme}>Reset theme</Button>
</div>

<style>
  :global(:root) {
    --sans: 'Inter';
  }

  @supports (font-variation-settings: normal) {
    :global(:root) {
      --sans: 'InterVariable';
    }
  }

  .flex {
    display: flex;
  }
</style>
