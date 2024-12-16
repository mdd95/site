<script>
  import 'inter-ui/inter.css';
  import 'inter-ui/inter-variable.css';
  import '$lib/base.css';

  import Sun from 'svelte-radix/Sun.svelte';
  import Moon from 'svelte-radix/Moon.svelte';

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
  <div class="header">
    <Button class="ghost icon" onclick={theme.toggleMode}>
      <Sun class={theme.mode == 'light' ? 'hidden' : ''} />
      <Moon class={theme.mode == 'dark' ? 'hidden' : ''} />
    </Button>
  </div>
  <h2>Buttons</h2>

  <Button class="ghost" onclick={theme.resetMode} disabled={theme.mode == 'system'}>Reset</Button>

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
  <Button class="primary sm" onclick={changeTheme}>Change theme</Button>
  <Button class="primary sm" onclick={resetTheme} disabled={theme.colors == null}>
    Reset theme
  </Button>
  <Button class="destructive">Delete</Button>

  <section>
    <h2>Checkbox</h2>

    <input type="checkbox" />
  </section>

  <section>
    <h2>Dialog</h2>

    <Button>Open dialog</Button>
  </section>
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

  .header {
    padding-block: 0.75rem;
    display: flex;
    justify-content: flex-end;
  }

  :global(.hidden) {
    display: none;
  }
</style>
