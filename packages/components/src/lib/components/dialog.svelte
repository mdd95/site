<script lang="ts">
  import { Dialog, useId } from 'bits-ui';
  import Cross from 'svelte-radix/Cross2.svelte';

  import type { HTMLDialogAttributes } from 'svelte/elements';
  import type { WithoutChild } from 'bits-ui';

  type DialogProps = WithoutChild<Dialog.RootProps> &
    HTMLDialogAttributes & {
      native?: boolean;
      ref?: HTMLDialogElement | null;
      title?: string;
      description?: string;
    };

  let {
    native = true,
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

{#if native}
  <dialog
    bind:this={ref}
    aria-labelledby={titleId}
    aria-describedby={descriptionId}
    {open}
    {...restProps}
  >
    <div class="header">
      <div>
        <h2 id={titleId} class="title">{title}</h2>
        <p id={descriptionId} class="description">{description}</p>
      </div>
      <button onclick={() => ref!.close()} class="close" aria-label="Close">
        <Cross size={16} />
      </button>
    </div>
    <div class="content">
      {@render children?.()}
    </div>
  </dialog>
{:else}
  <Dialog.Root bind:open {...restProps}>
    <Dialog.Portal>
      <Dialog.Overlay>
        {#snippet child({ props })}
          <div class="overlay" {...props}></div>
        {/snippet}
      </Dialog.Overlay>
      <Dialog.Content>
        {#snippet child({ props })}
          <div class="content" {...props}>
            <div class="header">
              <div>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Description>{description}</Dialog.Description>
              </div>
              <Dialog.Close aria-label="Close">
                <Cross size={16} />
              </Dialog.Close>
            </div>
            <div class="content">
              {@render children?.()}
            </div>
          </div>
        {/snippet}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
{/if}

<style>
  .content:global([data-dialog-content]) {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 20;
    max-height: calc(100% - 2rem);
    overflow-y: auto;
    background-color: var(--background-default);
    border-radius: var(--border-radius-default);
  }

  .overlay {
    position: fixed;
    inset: 0;
    z-index: 19;
    background-color: rgba(0 0 0 / 0.5);
  }

  dialog {
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% - 1rem));
    border-radius: var(--border-radius-default);
    opacity: 0;
    transition:
      opacity var(--transition-duration-default) var(--transition-timing-function-default),
      transform var(--transition-duration-default) var(--transition-timing-function-default),
      overlay var(--transition-duration-default) var(--transition-timing-function-default)
        allow-discrete,
      display var(--transition-duration-default) var(--transition-timing-function-default)
        allow-discrete;
  }

  @media (prefers-reduced-motion: reduce) {
    dialog {
      transition: none;
    }
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
      display var(--transition-duration-default) allow-discrete,
      overlay var(--transition-duration-default) allow-discrete,
      background-color var(--transition-duration-default);
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
  .header :global([data-dialog-close]) {
    align-self: flex-start;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    & :global(svg) {
      width: 1rem;
      height: 1rem;
    }
  }

  .title,
  .dialog :global([data-dialog-title]) {
    font-weight: 600;
  }

  .description,
  .dialog :global([data-dialog-description]) {
    color: var(--text-muted);
    font-size: 0.875rem;
  }

  .content {
    padding: 1rem;
    padding-top: 0;
  }
</style>
