<script lang="ts">
  import { Dialog, useId } from 'bits-ui';
  import Cross from 'svelte-radix/Cross2.svelte';

  import type { HTMLDialogAttributes } from 'svelte/elements';

  type DialogProps = Dialog.RootProps &
    HTMLDialogAttributes & {
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

  const titleId = useId();
  const descriptionId = useId();
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
              <span class="sr-only">Close</span>
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
  <dialog
    bind:this={ref}
    aria-labelledby={titleId}
    aria-describedby={descriptionId}
    {open}
    {...restProps}
  >
    <div class="header">
      <div>
        <div id={titleId} role="heading" aria-level="2" class="title">{title}</div>
        <div id={descriptionId} class="description">{description}</div>
      </div>
      <button onclick={() => ref!.close()} class="close">
        <Cross size={16} />
        <span class="sr-only">Close</span>
      </button>
    </div>
    <div class="content">
      {@render children?.()}
    </div>
  </dialog>
{/if}

<style>
  .dialog :global([data-dialog-content]) {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 20;
    max-height: calc(100% - 2rem);
    overflow-y: auto;
    background-color: var(--root-bg);
    border-radius: var(--radius);
  }

  .dialog :global([data-dialog-overlay]) {
    position: fixed;
    inset: 0;
    z-index: 19;
    background-color: rgba(0 0 0 / 0.5);
  }

  dialog {
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% - 1rem));
    border-radius: var(--radius);
    opacity: 0;
    transition:
      opacity var(--tr-duration) var(--tr-timing),
      transform var(--tr-duration) var(--tr-timing),
      overlay var(--tr-duration) var(--tr-timing) allow-discrete,
      display var(--tr-duration) var(--tr-timing) allow-discrete;
  }

  dialog[open] {
    opacity: 1;
    transform: translate(-50%, -50%);
  }

  @starting-style {
    dialog[open] {
      opacity: 0;
      transform: translate(-50%, calc(-50% - 1rem));
    }
  }

  dialog::backdrop {
    background-color: rgba(0 0 0 / 0);
    transition:
      display var(--tr-duration) allow-discrete,
      overlay var(--tr-duration) allow-discrete,
      background-color var(--tr-duration);
  }

  dialog[open]::backdrop {
    background-color: rgba(0 0 0 / 0.5);
  }

  @starting-style {
    dialog[open]::backdrop {
      background-color: rgba(0 0 0 / 0);
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
  }

  .close,
  .dialog :global([data-dialog-close]) {
    align-self: flex-start;
    cursor: pointer;
  }

  .content {
    padding: 1rem;
    padding-top: 0;
  }
</style>
