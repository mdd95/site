<script lang="ts">
  import { Dialog } from 'bits-ui';
  import Cross from 'svelte-radix/Cross2.svelte';

  type DialogProps = Dialog.RootProps & {
    bits?: boolean;
    ref?: HTMLDialogElement | null;
    title?: string;
    description?: string;
  };

  let {
    bits = false,
    ref = $bindable(null),
    open = $bindable(false),
    children,
    title,
    description,
    ...restProps
  }: DialogProps = $props();
</script>

{#if bits}
  <Dialog.Root bind:open {...restProps}>
    <Dialog.Portal>
      <div class="dialog" style="display: contents;">
        <Dialog.Overlay />
        <Dialog.Content>
          <div class="header">
            <div>
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.Description>{description}</Dialog.Description>
            </div>
            <Dialog.Close>
              <Cross size={16} />
            </Dialog.Close>
          </div>
          <div class="content">
            {@render children?.()}
          </div>
        </Dialog.Content>
      </div>
    </Dialog.Portal>
  </Dialog.Root>
{:else}
  <dialog bind:this={ref} {open} {...restProps}>
    <div class="header">
      <div>
        <p>{title}</p>
        <p>{description}</p>
      </div>
      <button onclick={() => ref?.close()} class="close">
        <Cross size={16} />
      </button>
    </div>
    <div class="content">
      {@render children?.()}
    </div>
  </dialog>
{/if}

<style>
  dialog,
  .dialog :global([data-dialog-content]) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% - 1rem));
    background-color: var(--root-bg);
    border-radius: var(--radius);
    opacity: 0;
    transition:
      opacity var(--tr-duration) var(--tr-timing),
      transform var(--tr-duration) var(--tr-timing),
      overlay var(--tr-duration) var(--tr-timing) allow-discrete,
      display var(--tr-duration) var(--tr-timing) allow-discrete;
  }

  dialog[open],
  .dialog :global([data-dialog-content]:where([data-state='open'])) {
    opacity: 1;
    transform: translate(-50%, -50%);
  }

  @starting-style {
    dialog[open],
    .dialog :global([data-dialog-content]:where([data-state='open'])) {
      opacity: 0;
      transform: translate(-50%, calc(-50% - 1rem));
    }
  }

  dialog::backdrop,
  .dialog :global([data-dialog-overlay]) {
    position: absolute;
    inset: 0;
    background-color: rgba(0 0 0 / 0);
    transition:
      display var(--tr-duration) allow-discrete,
      overlay var(--tr-duration) allow-discrete,
      background-color var(--tr-duration);
  }

  dialog[open]::backdrop,
  .dialog :global([data-dialog-overlay]:where([data-state='open'])) {
    background-color: rgba(0 0 0 / 0.5);
  }

  @starting-style {
    dialog[open]::backdrop,
    .dialog :global([data-dialog-overlay]:where([data-state='open'])) {
      background-color: rgba(0 0 0 / 0);
    }
  }

  dialog .header,
  .dialog .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
  }

  dialog .close,
  .dialog :global([data-dialog-close]) {
    align-self: flex-start;
    cursor: pointer;
  }

  dialog .content,
  .dialog .content {
    padding: 1rem;
    padding-top: 0;
  }
</style>
