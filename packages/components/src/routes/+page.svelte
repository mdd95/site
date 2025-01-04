<script lang="ts">
  import 'inter-ui/inter.css';
  import 'inter-ui/inter-variable.css';
  import '$lib/styles/global.css';

  import Sun from 'svelte-radix/Sun.svelte';
  import Moon from 'svelte-radix/Moon.svelte';

  import Theme, { setTheme } from '$lib/theme.svelte';
  import Dialog from '$lib/dialog.svelte';
  import { Label } from 'bits-ui';
  import { Button, Checkbox, Switch, UseId } from '$lib/index.js';

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

  let mydialog: HTMLDialogElement | null = $state(null);
  let bitsDialog = $state(false);

  function openNative() {
    mydialog?.showModal();
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
    <h2>Dialog</h2>

    <Button onclick={openNative}>Open native dialog</Button>

    <Dialog bind:ref={mydialog} title="Are you sure?" description="This action cannot be undone.">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti earum quibusdam saepe,
      animi debitis distinctio!
    </Dialog>

    <Button onclick={() => (bitsDialog = true)}>Open dialog</Button>
    <Dialog
      bits
      title="Are you sure?"
      description="This action cannot be undone."
      open={bitsDialog}
      onOpenChange={(value) => (bitsDialog = value)}
    >
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti earum quibusdam saepe,
      animi debitis distinctio!
    </Dialog>
  </section>

  <section>
    <h2>Checkboxes</h2>

    <UseId>
      {#snippet children({ id })}
        <Checkbox {id} />
        <Label.Root for={id}>Enable notifications</Label.Root>
      {/snippet}
    </UseId>
  </section>

  <section>
    <h2>Switch</h2>

    <UseId>
      {#snippet children({ id })}
        <Switch {id} />
        <Label.Root for={id}>Enable notifications</Label.Root>
      {/snippet}
    </UseId>
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
